<?php
/**
 * Flowentra Inbox API
 * Stores inbound contact & support form submissions and exposes them to the admin.
 * Auto-creates the table on first use — no manual migration needed.
 */

require_once __DIR__ . '/../config.php';

$db = new Database();
$conn = $db->getConnection();

// Auto-create table if it doesn't exist
$conn->exec("CREATE TABLE IF NOT EXISTS flowentra_inbox (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    mailbox     ENUM('contact','support') NOT NULL DEFAULT 'contact',
    sender_name VARCHAR(200) NOT NULL DEFAULT '',
    sender_email VARCHAR(200) NOT NULL DEFAULT '',
    sender_phone VARCHAR(100) NOT NULL DEFAULT '',
    company     VARCHAR(200) NOT NULL DEFAULT '',
    category    VARCHAR(100) NOT NULL DEFAULT '',
    priority    VARCHAR(50)  NOT NULL DEFAULT '',
    subject     VARCHAR(500) NOT NULL DEFAULT '',
    message     TEXT         NOT NULL,
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    is_starred  TINYINT(1)   NOT NULL DEFAULT 0,
    received_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$action = $_GET['action'] ?? '';

switch ($action) {

    // ── Called by the contact / support forms to persist a submission ──
    case 'save':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $mailbox      = in_array($data['mailbox'] ?? '', ['contact','support']) ? $data['mailbox'] : 'contact';
        $senderName   = trim($data['sender_name']  ?? '');
        $senderEmail  = trim($data['sender_email'] ?? '');
        $senderPhone  = trim($data['sender_phone'] ?? '');
        $company      = trim($data['company']      ?? '');
        $category     = trim($data['category']     ?? '');
        $priority     = trim($data['priority']     ?? '');
        $subject      = trim($data['subject']      ?? '');
        $message      = trim($data['message']      ?? '');

        if (empty($senderEmail) && empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'email and message are required']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO flowentra_inbox
            (mailbox, sender_name, sender_email, sender_phone, company, category, priority, subject, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$mailbox, $senderName, $senderEmail, $senderPhone, $company, $category, $priority, $subject, $message]);

        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        break;

    // ── List messages for the admin panel ──
    case 'list':
        $mailbox  = $_GET['mailbox']  ?? '';          // '' = all
        $unread   = $_GET['unread']   ?? '';          // '1' = unread only
        $starred  = $_GET['starred']  ?? '';          // '1' = starred only
        $page     = max(1, intval($_GET['page']  ?? 1));
        $limit    = min(100, max(10, intval($_GET['limit'] ?? 25)));
        $offset   = ($page - 1) * $limit;

        $where  = [];
        $params = [];

        if ($mailbox === 'contact' || $mailbox === 'support') {
            $where[]  = "mailbox = ?";
            $params[] = $mailbox;
        }
        if ($unread === '1') {
            $where[] = "is_read = 0";
        }
        if ($starred === '1') {
            $where[] = "is_starred = 1";
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $conn->prepare("SELECT COUNT(*) FROM flowentra_inbox $whereClause");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $listParams = array_merge($params, [$limit, $offset]);
        $stmt = $conn->prepare("SELECT * FROM flowentra_inbox $whereClause ORDER BY received_at DESC LIMIT ? OFFSET ?");
        $stmt->execute($listParams);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Counts per mailbox for badges
        $cStmt = $conn->query("SELECT mailbox, SUM(is_read=0) as unread, COUNT(*) as total FROM flowentra_inbox GROUP BY mailbox");
        $counts = [];
        foreach ($cStmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
            $counts[$r['mailbox']] = ['total' => (int)$r['total'], 'unread' => (int)$r['unread']];
        }

        echo json_encode([
            'success' => true,
            'data'    => $rows,
            'counts'  => $counts,
            'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'pages' => (int)ceil($total / $limit)],
        ]);
        break;

    // ── Mark one or more messages as read ──
    case 'mark_read':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids  = array_map('intval', (array)($data['ids'] ?? []));
        if (!$ids) { echo json_encode(['success' => true]); break; }

        $ph   = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $conn->prepare("UPDATE flowentra_inbox SET is_read = 1 WHERE id IN ($ph)");
        $stmt->execute($ids);
        echo json_encode(['success' => true]);
        break;

    // ── Toggle starred ──
    case 'toggle_star':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = intval($data['id'] ?? 0);
        $stmt = $conn->prepare("UPDATE flowentra_inbox SET is_starred = 1 - is_starred WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ── Delete one message ──
    case 'delete':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = intval($data['id'] ?? 0);
        $stmt = $conn->prepare("DELETE FROM flowentra_inbox WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
