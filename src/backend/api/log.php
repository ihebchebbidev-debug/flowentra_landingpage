<?php
/**
 * Flowentra Action Log API
 * Stores action / event audit records for admin review.
 * Auto-creates the table on first use.
 */

require_once __DIR__ . '/../config.php';

$db   = new Database();
$conn = $db->getConnection();

$conn->exec("CREATE TABLE IF NOT EXISTS flowentra_action_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    action VARCHAR(100) NOT NULL DEFAULT 'event',
    level ENUM('info','warning','error') NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    url VARCHAR(1000),
    user_agent VARCHAR(500),
    ip VARCHAR(100),
    context TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_action (action),
    INDEX idx_level (level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'report':
        reportActionLog($conn);
        break;
    case 'list':
        listActionLogs($conn);
        break;
    case 'delete':
        deleteActionLog($conn);
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function reportActionLog($conn)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $category = substr(trim((string)($data['category'] ?? 'general')), 0, 100);
    $action   = substr(trim((string)($data['action'] ?? 'event')), 0, 100);
    $level    = in_array($data['level'] ?? '', ['info', 'warning', 'error']) ? $data['level'] : 'info';
    $message  = substr(trim((string)($data['message'] ?? '')), 0, 2000);
    $url      = substr(trim((string)($data['url'] ?? '')), 0, 1000);
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500);
    $ip        = $_SERVER['REMOTE_ADDR'] ?? '';
    $context   = isset($data['context']) ? json_encode($data['context']) : null;

    if (!$message) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'message required']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO flowentra_action_logs
        (category, action, level, message, url, user_agent, ip, context)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$category, $action, $level, $message, $url ?: null, $userAgent, $ip, $context]);

    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
}

function listActionLogs($conn)
{
    $category = trim((string)($_GET['category'] ?? ''));
    $action   = trim((string)($_GET['action'] ?? ''));
    $level    = trim((string)($_GET['level'] ?? ''));
    $page     = max(1, intval($_GET['page'] ?? 1));
    $limit    = min(100, max(10, intval($_GET['limit'] ?? 50)));
    $offset   = ($page - 1) * $limit;

    $where  = [];
    $params = [];

    if ($category !== '') {
        $where[]  = 'category = ?';
        $params[] = $category;
    }
    if ($action !== '') {
        $where[]  = 'action = ?';
        $params[] = $action;
    }
    if (in_array($level, ['info', 'warning', 'error'])) {
        $where[]  = 'level = ?';
        $params[] = $level;
    }

    $filterSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $conn->prepare("SELECT COUNT(*) FROM flowentra_action_logs $filterSql");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $conn->prepare("SELECT * FROM flowentra_action_logs $filterSql ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $stmt->execute(array_merge($params, [$limit, $offset]));
    $rows = $stmt->fetchAll();

    $summaryStmt = $conn->query("SELECT level, COUNT(*) AS total FROM flowentra_action_logs GROUP BY level");
    $summary = $summaryStmt->fetchAll();

    echo json_encode([
        'success'    => true,
        'data'       => $rows,
        'summary'    => $summary,
        'pagination' => [
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int)ceil($total / $limit),
        ],
    ]);
}

function deleteActionLog($conn)
{
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($data['id'] ?? 0);
    if (!$id) {
        echo json_encode(['success' => true]);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM flowentra_action_logs WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
