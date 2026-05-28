<?php
/**
 * Flowentra Error Logger API
 * Stores frontend JS errors, API failures, and PHP server errors.
 * Auto-creates the table on first use.
 */

require_once __DIR__ . '/../config.php';

$db   = new Database();
$conn = $db->getConnection();

// Auto-create table
$conn->exec("CREATE TABLE IF NOT EXISTS flowentra_errors (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    type        ENUM('javascript','api','php','network') NOT NULL DEFAULT 'javascript',
    severity    ENUM('error','warning','info') NOT NULL DEFAULT 'error',
    message     TEXT NOT NULL,
    stack       TEXT,
    url         VARCHAR(1000),
    user_agent  VARCHAR(500),
    ip          VARCHAR(100),
    context     TEXT,
    is_resolved TINYINT(1) NOT NULL DEFAULT 0,
    occurred_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_resolved (is_resolved),
    INDEX idx_occurred (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// Register PHP error handler so uncaught PHP exceptions also get stored
function logPhpError($conn, $errno, $message, $file = '', $line = 0, $trace = '') {
    try {
        $severity = in_array($errno, [E_WARNING, E_USER_WARNING, E_NOTICE, E_USER_NOTICE]) ? 'warning' : 'error';
        $url      = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http')
                  . '://' . ($_SERVER['HTTP_HOST'] ?? 'server')
                  . ($_SERVER['REQUEST_URI'] ?? '');
        $ctx      = json_encode(['file' => $file, 'line' => $line, 'errno' => $errno]);
        $stmt     = $conn->prepare("INSERT INTO flowentra_errors
            (type, severity, message, stack, url, ip, context)
            VALUES ('php', ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $severity,
            $message,
            $trace,
            $url,
            $_SERVER['REMOTE_ADDR'] ?? '',
            $ctx,
        ]);
    } catch (Exception $e) { /* silently fail — avoid infinite loop */ }
}

set_error_handler(function($errno, $errstr, $errfile, $errline) use ($conn) {
    logPhpError($conn, $errno, $errstr, $errfile, $errline);
    return false; // let PHP handle it too
});

set_exception_handler(function($e) use ($conn) {
    logPhpError($conn, E_ERROR, $e->getMessage(), $e->getFile(), $e->getLine(), $e->getTraceAsString());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal server error']);
    exit;
});

$action = $_GET['action'] ?? '';

switch ($action) {

    // ── Receive a frontend error report ─────────────────────────────
    case 'report':
        $data     = json_decode(file_get_contents('php://input'), true) ?? [];
        $type     = in_array($data['type'] ?? '', ['javascript','api','network']) ? $data['type'] : 'javascript';
        $severity = in_array($data['severity'] ?? '', ['error','warning','info']) ? $data['severity'] : 'error';
        $message  = substr(trim($data['message'] ?? ''), 0, 2000);
        $stack    = substr(trim($data['stack']   ?? ''), 0, 5000);
        $url      = substr(trim($data['url']     ?? ''), 0, 1000);
        $ua       = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500);
        $ip       = $_SERVER['REMOTE_ADDR'] ?? '';
        $context  = isset($data['context']) ? json_encode($data['context']) : null;

        if (!$message) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'message required']);
            exit;
        }

        // Deduplicate: if the same message + url occurred in the last 60 seconds, skip
        $stmt = $conn->prepare("SELECT id FROM flowentra_errors
            WHERE message = ? AND url = ? AND occurred_at > DATE_SUB(NOW(), INTERVAL 60 SECOND)
            LIMIT 1");
        $stmt->execute([$message, $url]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'duplicate' => true]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO flowentra_errors
            (type, severity, message, stack, url, user_agent, ip, context)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$type, $severity, $message, $stack ?: null, $url, $ua, $ip, $context]);

        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        break;

    // ── List errors for the admin panel ─────────────────────────────
    case 'list':
        $type       = $_GET['type']     ?? '';
        $resolved   = $_GET['resolved'] ?? '';   // '0' unresolved, '1' resolved, '' all
        $severity   = $_GET['severity'] ?? '';
        $page       = max(1, intval($_GET['page']  ?? 1));
        $limit      = min(100, max(10, intval($_GET['limit'] ?? 50)));
        $offset     = ($page - 1) * $limit;

        $where  = [];
        $params = [];

        if (in_array($type, ['javascript','api','php','network'])) {
            $where[]  = "type = ?";
            $params[] = $type;
        }
        if ($resolved === '0') { $where[] = "is_resolved = 0"; }
        if ($resolved === '1') { $where[] = "is_resolved = 1"; }
        if (in_array($severity, ['error','warning','info'])) {
            $where[]  = "severity = ?";
            $params[] = $severity;
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $conn->prepare("SELECT COUNT(*) FROM flowentra_errors $wc");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $conn->prepare("SELECT * FROM flowentra_errors $wc ORDER BY occurred_at DESC LIMIT ? OFFSET ?");
        $stmt->execute(array_merge($params, [$limit, $offset]));
        $rows = $stmt->fetchAll();

        // Summary counts for badges
        $summaryStmt = $conn->query("SELECT type, severity, SUM(is_resolved=0) as unresolved, COUNT(*) as total FROM flowentra_errors GROUP BY type, severity");
        $summary = [];
        foreach ($summaryStmt->fetchAll() as $r) {
            $summary[] = $r;
        }

        $unresolvedTotal = (int)$conn->query("SELECT COUNT(*) FROM flowentra_errors WHERE is_resolved=0")->fetchColumn();

        echo json_encode([
            'success'          => true,
            'data'             => $rows,
            'summary'          => $summary,
            'unresolved_total' => $unresolvedTotal,
            'pagination'       => ['page' => $page, 'limit' => $limit, 'total' => $total, 'pages' => (int)ceil($total / $limit)],
        ]);
        break;

    // ── Mark resolved / unresolved ───────────────────────────────────
    case 'resolve':
        $data  = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids   = array_map('intval', (array)($data['ids'] ?? []));
        $value = ($data['resolved'] ?? true) ? 1 : 0;
        if (!$ids) { echo json_encode(['success' => true]); break; }
        $ph   = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $conn->prepare("UPDATE flowentra_errors SET is_resolved = ? WHERE id IN ($ph)");
        $stmt->execute(array_merge([$value], $ids));
        echo json_encode(['success' => true]);
        break;

    // ── Delete one error ─────────────────────────────────────────────
    case 'delete':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = intval($data['id'] ?? 0);
        $conn->prepare("DELETE FROM flowentra_errors WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ── Clear all resolved ───────────────────────────────────────────
    case 'clear_resolved':
        $conn->exec("DELETE FROM flowentra_errors WHERE is_resolved = 1");
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
