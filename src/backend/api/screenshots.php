<?php
/**
 * Flowentra Screenshots Manager API
 * Manages hero-screenshots/ and screenshots/ folders.
 * Folders are one level above this api/ directory.
 */

require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? '';

// Resolve both managed folders (relative to this file's directory)
$FOLDERS = [
    'hero-screenshots' => realpath(__DIR__ . '/../hero-screenshots'),
    'screenshots'      => realpath(__DIR__ . '/../screenshots'),
];

// Allowed image MIME types
$ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];

// Public URL base — same origin as the API, one level up
$API_URL  = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http')
          . '://' . $_SERVER['HTTP_HOST'];
$BASE_PATH = rtrim(dirname(dirname(str_replace($_SERVER['DOCUMENT_ROOT'], '', __DIR__))), '/');

function folderUrl(string $folder, string $apiUrl, string $basePath): string {
    return $apiUrl . $basePath . '/' . $folder;
}

switch ($action) {

    // ── List all files in both folders ──────────────────────────────
    case 'list':
        $result = [];
        foreach ($FOLDERS as $folderName => $absPath) {
            if (!$absPath || !is_dir($absPath)) {
                $result[$folderName] = [];
                continue;
            }
            $files = [];
            foreach (glob($absPath . '/*.{png,jpg,jpeg,gif,webp,svg}', GLOB_BRACE) as $f) {
                $filename = basename($f);
                $files[] = [
                    'name'     => $filename,
                    'folder'   => $folderName,
                    'size'     => filesize($f),
                    'modified' => filemtime($f),
                    'url'      => folderUrl($folderName, $API_URL, $BASE_PATH) . '/' . $filename,
                ];
            }
            // newest first
            usort($files, fn($a, $b) => $b['modified'] - $a['modified']);
            $result[$folderName] = $files;
        }
        echo json_encode(['success' => true, 'data' => $result]);
        break;

    // ── Upload (replace or new) ──────────────────────────────────────
    case 'upload':
        $folderKey = $_POST['folder'] ?? '';
        if (!isset($FOLDERS[$folderKey])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid folder']);
            exit;
        }
        $absPath = $FOLDERS[$folderKey];
        if (!$absPath || !is_dir($absPath)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => "Folder not found: $folderKey"]);
            exit;
        }

        $file = $_FILES['file'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
            exit;
        }

        // Validate MIME
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']);
        if (!in_array($mime, $ALLOWED)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "File type not allowed: $mime"]);
            exit;
        }

        // Use the provided filename (replace) or the original upload name (new)
        $targetName = trim($_POST['filename'] ?? $file['name']);
        if (!$targetName) $targetName = $file['name'];

        // Security: strip directory traversal, keep only basename
        $targetName = basename($targetName);

        // Preserve extension from uploaded file if not in target name
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!pathinfo($targetName, PATHINFO_EXTENSION)) {
            $targetName .= '.' . $ext;
        }

        $dest = $absPath . DIRECTORY_SEPARATOR . $targetName;
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save file']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => "Uploaded $targetName",
            'data'    => [
                'name'   => $targetName,
                'folder' => $folderKey,
                'url'    => folderUrl($folderKey, $API_URL, $BASE_PATH) . '/' . $targetName,
            ],
        ]);
        break;

    // ── Delete ───────────────────────────────────────────────────────
    case 'delete':
        $data      = json_decode(file_get_contents('php://input'), true) ?? [];
        $folderKey = $data['folder']   ?? '';
        $filename  = basename($data['name'] ?? '');

        if (!isset($FOLDERS[$folderKey]) || !$filename) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'folder and name required']);
            exit;
        }

        $absPath = $FOLDERS[$folderKey];
        $target  = $absPath . DIRECTORY_SEPARATOR . $filename;

        // Ensure the file is inside the expected folder (prevent path traversal)
        if (!$absPath || strpos(realpath($target) ?: '', $absPath) !== 0) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit;
        }

        if (!file_exists($target)) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'File not found']);
            exit;
        }

        unlink($target);
        echo json_encode(['success' => true, 'message' => "Deleted $filename"]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
