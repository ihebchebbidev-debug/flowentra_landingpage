<?php
/**
 * Flowentra IMAP Mailbox API
 * Reads real OVH mailboxes over IMAP (ssl0.ovh.net:993 SSL).
 * Features: list folders, list/read messages (INBOX, Sent, Spam, Trash),
 *           download attachments, mark read/unread, move (spam/trash), delete.
 *
 * Requires the PHP `imap` extension. Reuses/stores credentials in
 * flowentra_email_imap_settings (auto-created on first use).
 */

require_once __DIR__ . '/../config.php';

$db = new Database();
$conn = $db->getConnection();

// Auto-create the IMAP settings table (one row per mailbox: contact, support)
$conn->exec("CREATE TABLE IF NOT EXISTS flowentra_email_imap_settings (
    id            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mailbox       VARCHAR(20)  NOT NULL DEFAULT 'contact',
    host          VARCHAR(190) NOT NULL DEFAULT 'ssl0.ovh.net',
    port          INT          NOT NULL DEFAULT 993,
    encryption    VARCHAR(20)  NOT NULL DEFAULT 'ssl',
    validate_cert TINYINT(1)   NOT NULL DEFAULT 1,
    username      VARCHAR(190) NOT NULL DEFAULT '',
    password      VARCHAR(255) NOT NULL DEFAULT '',
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_mailbox (mailbox)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// Self-healing migration for installs created before multi-mailbox support.
// Runs only once (until the `mailbox` column exists) to avoid per-request churn.
if (!$conn->query("SHOW COLUMNS FROM flowentra_email_imap_settings LIKE 'mailbox'")->fetch()) {
    foreach ([
        "ALTER TABLE flowentra_email_imap_settings MODIFY id INT NOT NULL AUTO_INCREMENT",
        "ALTER TABLE flowentra_email_imap_settings ADD COLUMN mailbox VARCHAR(20) NOT NULL DEFAULT 'contact'",
        "ALTER TABLE flowentra_email_imap_settings ADD UNIQUE KEY uniq_mailbox (mailbox)",
    ] as $mig) { try { $conn->exec($mig); } catch (Exception $e) { /* already applied */ } }
}

// Which mailbox account this request targets (contact | support)
function mailboxParam(): string {
    $m = $_GET['mailbox'] ?? 'contact';
    return in_array($m, ['contact', 'support'], true) ? $m : 'contact';
}
$mailbox = mailboxParam();

$action = $_GET['action'] ?? '';

// Guard: the imap extension must be present for anything except reading settings
function requireImapExtension() {
    if (!function_exists('imap_open')) {
        http_response_code(501);
        echo json_encode([
            'success' => false,
            'message' => 'The PHP IMAP extension is not enabled on this server. Enable php-imap (OVH: add "extension=imap" / enable it in the hosting config) to read mailboxes.',
            'code'    => 'imap_missing',
        ]);
        exit;
    }
}

function getImapSettings($conn, $mailbox = 'contact') {
    $stmt = $conn->prepare("SELECT * FROM flowentra_email_imap_settings WHERE mailbox = ?");
    $stmt->execute([$mailbox]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

// Build an IMAP mailbox connection string, e.g. {ssl0.ovh.net:993/imap/ssl}FOLDER
function imapRef($s, $folder = '') {
    $flags = '/imap';
    if (($s['encryption'] ?? 'ssl') === 'ssl') {
        $flags .= '/ssl';
    } elseif (($s['encryption'] ?? '') === 'tls') {
        $flags .= '/tls';
    } else {
        $flags .= '/notls';
    }
    if (empty($s['validate_cert'])) {
        $flags .= '/novalidate-cert';
    }
    return '{' . $s['host'] . ':' . intval($s['port']) . $flags . '}' . $folder;
}

function openImap($s, $folder = 'INBOX') {
    $ref = imapRef($s, $folder);
    $imap = @imap_open($ref, $s['username'], $s['password'], 0, 1);
    return $imap;
}

// Decode MIME-encoded header text (subjects, names) to UTF-8
function decodeMime($str) {
    if ($str === null || $str === '') return '';
    $out = '';
    foreach (imap_mime_header_decode($str) as $part) {
        $charset = strtoupper($part->charset);
        $text = $part->text;
        if ($charset !== 'DEFAULT' && $charset !== 'UTF-8' && $charset !== 'US-ASCII') {
            $conv = @iconv($charset, 'UTF-8//TRANSLIT', $text);
            if ($conv !== false) $text = $conv;
        }
        $out .= $text;
    }
    return $out;
}

// Decode a body part according to its transfer encoding
function decodePart($data, $encoding) {
    switch ($encoding) {
        case 3: return base64_decode($data);       // BASE64
        case 4: return quoted_printable_decode($data); // QUOTED-PRINTABLE
        default: return $data;                       // 7BIT / 8BIT / BINARY / OTHER
    }
}

// Recursively walk the message structure collecting body + attachments.
// Returns ['html' => ..., 'plain' => ..., 'attachments' => [['name','size','part','type']]]
function walkParts($imap, $uid, $structure, $partNumber, &$result) {
    if (!isset($structure->parts) || empty($structure->parts)) {
        collectPart($imap, $uid, $structure, $partNumber ?: '1', $result);
        return;
    }
    foreach ($structure->parts as $idx => $sub) {
        $pn = $partNumber === '' ? (string)($idx + 1) : $partNumber . '.' . ($idx + 1);
        if (isset($sub->parts) && !empty($sub->parts)) {
            walkParts($imap, $uid, $sub, $pn, $result);
        } else {
            collectPart($imap, $uid, $sub, $pn, $result);
        }
    }
}

function collectPart($imap, $uid, $part, $pn, &$result) {
    $params = [];
    if (!empty($part->parameters)) {
        foreach ($part->parameters as $p) $params[strtolower($p->attribute)] = $p->value;
    }
    if (!empty($part->dparameters)) {
        foreach ($part->dparameters as $p) $params[strtolower($p->attribute)] = $p->value;
    }

    $isAttachment = false;
    $filename = '';
    if (isset($part->disposition) && strtolower($part->disposition) === 'attachment') {
        $isAttachment = true;
    }
    if (!empty($params['filename'])) { $filename = $params['filename']; $isAttachment = true; }
    elseif (!empty($params['name'])) { $filename = $params['name']; $isAttachment = true; }

    if ($isAttachment) {
        $result['attachments'][] = [
            'name' => decodeMime($filename ?: 'attachment'),
            'size' => intval($part->bytes ?? 0),
            'part' => $pn,
            'type' => strtolower(($part->subtype ?? '')),
        ];
        return;
    }

    // Body text/html or text/plain
    if (($part->type ?? 0) == 0) { // TYPETEXT
        $raw = imap_fetchbody($imap, $uid, $pn, FT_UID | FT_PEEK);
        $decoded = decodePart($raw, $part->encoding ?? 0);
        $charset = $params['charset'] ?? 'UTF-8';
        if (strtoupper($charset) !== 'UTF-8') {
            $conv = @iconv($charset, 'UTF-8//TRANSLIT', $decoded);
            if ($conv !== false) $decoded = $conv;
        }
        $sub = strtolower($part->subtype ?? '');
        if ($sub === 'html') $result['html'] .= $decoded;
        else $result['plain'] .= $decoded;
    }
}

switch ($action) {

    // ==================== SETTINGS ====================
    case 'get_settings': {
        $s = getImapSettings($conn, $mailbox);
        if ($s) $s['password'] = $s['password'] ? '••••••••' : '';
        echo json_encode([
            'success'      => true,
            'data'         => $s,
            'imap_enabled' => function_exists('imap_open'),
        ]);
        break;
    }

    case 'save_settings': {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $host          = trim($data['host'] ?? 'ssl0.ovh.net');
        $port          = intval($data['port'] ?? 993);
        $encryption    = $data['encryption'] ?? 'ssl';
        $validate_cert = !empty($data['validate_cert']) ? 1 : 0;
        $username      = trim($data['username'] ?? '');
        $password      = $data['password'] ?? null;

        if (empty($host) || empty($username)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Host and username are required']);
            exit;
        }

        $check = $conn->prepare("SELECT id FROM flowentra_email_imap_settings WHERE mailbox = ?");
        $check->execute([$mailbox]);
        $exists = $check->fetch();
        if ($exists) {
            $sql = "UPDATE flowentra_email_imap_settings SET host=?, port=?, encryption=?, validate_cert=?, username=?, updated_at=NOW()";
            $params = [$host, $port, $encryption, $validate_cert, $username];
            if ($password && $password !== '••••••••') { $sql .= ", password=?"; $params[] = $password; }
            $sql .= " WHERE mailbox = ?";
            $params[] = $mailbox;
            $conn->prepare($sql)->execute($params);
        } else {
            $stmt = $conn->prepare("INSERT INTO flowentra_email_imap_settings (mailbox, host, port, encryption, validate_cert, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$mailbox, $host, $port, $encryption, $validate_cert, $username, $password ?? '']);
        }
        echo json_encode(['success' => true, 'message' => 'IMAP settings saved']);
        break;
    }

    case 'test': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $imap = openImap($s, 'INBOX');
        if (!$imap) {
            echo json_encode(['success' => false, 'message' => 'Connection failed: ' . imap_last_error()]);
            break;
        }
        $check = imap_check($imap);
        imap_close($imap);
        echo json_encode(['success' => true, 'message' => 'Connected. ' . ($check->Nmsgs ?? 0) . ' messages in INBOX.']);
        break;
    }

    // ==================== FOLDERS ====================
    case 'folders': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $imap = openImap($s, 'INBOX');
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Connection failed: ' . imap_last_error()]); break; }

        $prefix = imapRef($s, '');
        $list = imap_list($imap, $prefix, '*') ?: [];
        $folders = [];
        foreach ($list as $mb) {
            $name = str_replace($prefix, '', $mb);
            $status = @imap_status($imap, $prefix . $name, SA_MESSAGES | SA_UNSEEN);
            $folders[] = [
                'name'     => $name,
                'display'  => $name,
                'messages' => $status ? intval($status->messages) : 0,
                'unseen'   => $status ? intval($status->unseen) : 0,
            ];
        }
        imap_close($imap);
        echo json_encode(['success' => true, 'data' => $folders]);
        break;
    }

    // ==================== LIST MESSAGES ====================
    case 'list': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $folder = $_GET['folder'] ?? 'INBOX';
        $page   = max(1, intval($_GET['page'] ?? 1));
        $limit  = min(100, max(10, intval($_GET['limit'] ?? 25)));
        $search = trim($_GET['search'] ?? '');

        $imap = openImap($s, $folder);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Cannot open folder: ' . imap_last_error()]); break; }

        if ($search !== '') {
            $criteria = 'TEXT "' . str_replace('"', '', $search) . '"';
            $ids = imap_search($imap, $criteria, SE_UID) ?: [];
            rsort($ids);
        } else {
            $total = imap_num_msg($imap);
            $ids = [];
            for ($i = $total; $i >= 1; $i--) $ids[] = imap_uid($imap, $i);
        }

        $totalCount = count($ids);
        $slice = array_slice($ids, ($page - 1) * $limit, $limit);

        $messages = [];
        foreach ($slice as $uid) {
            $header = imap_fetch_overview($imap, $uid, FT_UID);
            if (!$header || !isset($header[0])) continue;
            $h = $header[0];
            $messages[] = [
                'uid'         => intval($uid),
                'subject'     => decodeMime($h->subject ?? '(no subject)'),
                'from'        => decodeMime($h->from ?? ''),
                'from_email'  => $h->from ?? '',
                'to'          => decodeMime($h->to ?? ''),
                'date'        => $h->date ?? '',
                'timestamp'   => isset($h->udate) ? intval($h->udate) : 0,
                'seen'        => !empty($h->seen),
                'flagged'     => !empty($h->flagged),
                'answered'    => !empty($h->answered),
                'size'        => intval($h->size ?? 0),
            ];
        }
        imap_close($imap);

        echo json_encode([
            'success'    => true,
            'data'       => $messages,
            'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $totalCount, 'pages' => (int)ceil($totalCount / $limit)],
        ]);
        break;
    }

    // ==================== READ ONE MESSAGE ====================
    case 'message': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $folder = $_GET['folder'] ?? 'INBOX';
        $uid    = intval($_GET['uid'] ?? 0);
        $markSeen = ($_GET['mark_seen'] ?? '1') === '1';

        $imap = openImap($s, $folder);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Cannot open folder: ' . imap_last_error()]); break; }

        $overview = imap_fetch_overview($imap, $uid, FT_UID);
        if (!$overview || !isset($overview[0])) {
            imap_close($imap);
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Message not found']);
            break;
        }
        $h = $overview[0];
        $structure = imap_fetchstructure($imap, $uid, FT_UID);

        $result = ['html' => '', 'plain' => '', 'attachments' => []];
        walkParts($imap, $uid, $structure, '', $result);

        if ($markSeen) imap_setflag_full($imap, $uid, "\\Seen", ST_UID);

        $body = $result['html'] ?: nl2br(htmlspecialchars($result['plain']));

        imap_close($imap);

        echo json_encode([
            'success' => true,
            'data'    => [
                'uid'         => $uid,
                'subject'     => decodeMime($h->subject ?? '(no subject)'),
                'from'        => decodeMime($h->from ?? ''),
                'to'          => decodeMime($h->to ?? ''),
                'date'        => $h->date ?? '',
                'timestamp'   => isset($h->udate) ? intval($h->udate) : 0,
                'html'        => $body,
                'plain'       => $result['plain'],
                'attachments' => $result['attachments'],
            ],
        ]);
        break;
    }

    // ==================== DOWNLOAD ATTACHMENT (raw bytes) ====================
    case 'attachment': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { http_response_code(404); exit; }
        $folder = $_GET['folder'] ?? 'INBOX';
        $uid    = intval($_GET['uid'] ?? 0);
        $part   = preg_replace('/[^0-9.]/', '', $_GET['part'] ?? '');
        $name   = $_GET['name'] ?? 'attachment';

        $imap = openImap($s, $folder);
        if (!$imap) { http_response_code(502); exit; }

        $structure = imap_fetchstructure($imap, $uid, FT_UID);
        // Walk to find the encoding of the requested part
        $encoding = 0;
        $finder = function ($st, $prefix) use (&$finder, $part, &$encoding) {
            if (!isset($st->parts)) { if ($prefix === $part || ($prefix === '1' && $part === '1')) $encoding = $st->encoding ?? 0; return; }
            foreach ($st->parts as $i => $sub) {
                $pn = $prefix === '' ? (string)($i + 1) : $prefix . '.' . ($i + 1);
                if ($pn === $part) { $encoding = $sub->encoding ?? 0; return; }
                if (isset($sub->parts)) $finder($sub, $pn);
            }
        };
        $finder($structure, '');

        $raw = imap_fetchbody($imap, $uid, $part, FT_UID);
        $data = decodePart($raw, $encoding);
        imap_close($imap);

        header_remove('Content-Type');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . preg_replace('/["\r\n]/', '', $name) . '"');
        header('Content-Length: ' . strlen($data));
        echo $data;
        exit;
    }

    // ==================== FLAGS ====================
    case 'mark': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $folder = $data['folder'] ?? 'INBOX';
        $uid    = intval($data['uid'] ?? 0);
        $seen   = !empty($data['seen']);

        $imap = openImap($s, $folder);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Connection failed']); break; }
        if ($seen) imap_setflag_full($imap, (string)$uid, "\\Seen", ST_UID);
        else       imap_clearflag_full($imap, (string)$uid, "\\Seen", ST_UID);
        imap_close($imap);
        echo json_encode(['success' => true]);
        break;
    }

    case 'flag': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $folder  = $data['folder'] ?? 'INBOX';
        $uid     = intval($data['uid'] ?? 0);
        $flagged = !empty($data['flagged']);

        $imap = openImap($s, $folder);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Connection failed']); break; }
        if ($flagged) imap_setflag_full($imap, (string)$uid, "\\Flagged", ST_UID);
        else          imap_clearflag_full($imap, (string)$uid, "\\Flagged", ST_UID);
        imap_close($imap);
        echo json_encode(['success' => true]);
        break;
    }

    // ==================== MOVE (spam / trash / any folder) ====================
    case 'move': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $from = $data['folder'] ?? 'INBOX';
        $to   = $data['to'] ?? '';
        $uid  = intval($data['uid'] ?? 0);
        if (empty($to)) { echo json_encode(['success' => false, 'message' => 'Target folder required']); break; }

        $imap = openImap($s, $from);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Connection failed']); break; }
        $ok = imap_mail_move($imap, (string)$uid, $to, CP_UID);
        if ($ok) imap_expunge($imap);
        imap_close($imap);
        echo json_encode(['success' => (bool)$ok, 'message' => $ok ? 'Moved' : 'Move failed: ' . imap_last_error()]);
        break;
    }

    // ==================== DELETE ====================
    case 'delete': {
        requireImapExtension();
        $s = getImapSettings($conn, $mailbox);
        if (!$s) { echo json_encode(['success' => false, 'message' => 'IMAP not configured']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $folder = $data['folder'] ?? 'INBOX';
        $uid    = intval($data['uid'] ?? 0);

        $imap = openImap($s, $folder);
        if (!$imap) { echo json_encode(['success' => false, 'message' => 'Connection failed']); break; }
        imap_delete($imap, (string)$uid, FT_UID);
        imap_expunge($imap);
        imap_close($imap);
        echo json_encode(['success' => true]);
        break;
    }

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
