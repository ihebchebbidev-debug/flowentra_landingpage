<?php
/**
 * Flowentra Backend File Manager
 * ------------------------------------------------------------
 * A single-file, login-protected file manager for the backend.
 * Lets you browse, edit, rename, delete, upload, download and
 * create files/folders under the backend directory.
 *
 * Access (with the default Nginx /api/ alias):
 *   https://backend.flowentra.io/api/filemanager.php
 *
 * SECURITY NOTES (read me):
 *   - Always serve this over HTTPS only (you already have it).
 *   - Change the credentials below before/after deploying.
 *   - Consider also putting HTTP Basic Auth / IP allow-list in
 *     front of it in Nginx for a second layer.
 *   - Delete this file when you no longer need it.
 * ------------------------------------------------------------
 */

// ---- Configuration ---------------------------------------------------------
const FM_USER = 'FlowentraLanding';
const FM_PASS = 'Zaleyo2026';

// Root directory the manager is allowed to operate in.
// Default: the backend folder (one level up from /api).
$FM_ROOT = realpath(__DIR__ . '/..');

// ---- Session & hardening ---------------------------------------------------
session_name('FLOW_FM');
session_start();
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if ($FM_ROOT === false) {
    http_response_code(500);
    exit('Root directory not found.');
}

// ---- Helpers ---------------------------------------------------------------
function csrf_token(): string {
    if (empty($_SESSION['fm_csrf'])) {
        $_SESSION['fm_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['fm_csrf'];
}
function csrf_check(): void {
    $t = $_POST['csrf'] ?? '';
    if (!is_string($t) || !hash_equals($_SESSION['fm_csrf'] ?? '', $t)) {
        http_response_code(403);
        exit('Invalid CSRF token. Reload the page.');
    }
}
function is_logged_in(): bool {
    return !empty($_SESSION['fm_auth']);
}
function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
/** Resolve a user-supplied relative path safely inside $FM_ROOT. */
function safe_path(string $rel): string {
    global $FM_ROOT;
    $rel = str_replace('\\', '/', $rel);
    $rel = ltrim($rel, '/');
    $target = $FM_ROOT . ($rel === '' ? '' : '/' . $rel);
    $real = realpath($target);
    if ($real === false) {
        // For not-yet-existing targets (new file / upload), resolve the parent.
        $parent = realpath(dirname($target));
        if ($parent === false || !within_root($parent)) {
            return '';
        }
        return $parent . '/' . basename($target);
    }
    return within_root($real) ? $real : '';
}
function within_root(string $path): bool {
    global $FM_ROOT;
    $root = rtrim($FM_ROOT, '/');
    return $path === $root || strpos($path, $root . '/') === 0;
}
/** Path relative to root, for display / links. */
function rel_of(string $abs): string {
    global $FM_ROOT;
    $r = ltrim(substr($abs, strlen($FM_ROOT)), '/');
    return $r;
}
function flash(string $type, string $msg): void {
    $_SESSION['fm_flash'] = ['type' => $type, 'msg' => $msg];
}
function take_flash(): ?array {
    $f = $_SESSION['fm_flash'] ?? null;
    unset($_SESSION['fm_flash']);
    return $f;
}
function human_size(int $bytes): string {
    $u = ['B', 'KB', 'MB', 'GB', 'TB'];
    $i = 0;
    $n = (float)$bytes;
    while ($n >= 1024 && $i < count($u) - 1) { $n /= 1024; $i++; }
    return ($i === 0 ? $bytes : round($n, 1)) . ' ' . $u[$i];
}

// ---- Auth actions ----------------------------------------------------------
$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = $_POST['username'] ?? '';
    $p = $_POST['password'] ?? '';
    if (hash_equals(FM_USER, (string)$u) && hash_equals(FM_PASS, (string)$p)) {
        session_regenerate_id(true);
        $_SESSION['fm_auth'] = true;
        flash('ok', 'Welcome, ' . FM_USER . '.');
    } else {
        flash('err', 'Invalid username or password.');
    }
    header('Location: ?');
    exit;
}
if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ?');
    exit;
}

// ---- Login screen ----------------------------------------------------------
if (!is_logged_in()) {
    $f = take_flash();
    ?>
    <!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Flowentra File Manager — Login</title>
    <style>
      *{box-sizing:border-box} body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;
        background:#0b1020;color:#e6e9f2;display:flex;min-height:100vh;align-items:center;justify-content:center}
      .card{background:#151b34;padding:32px;border-radius:14px;width:340px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      h1{font-size:18px;margin:0 0 4px} p.sub{margin:0 0 20px;color:#8b93b0;font-size:13px}
      label{display:block;font-size:12px;margin:14px 0 6px;color:#aab2d0}
      input{width:100%;padding:11px 12px;border-radius:8px;border:1px solid #2a3358;background:#0e1430;color:#fff;font-size:14px}
      button{width:100%;margin-top:20px;padding:12px;border:0;border-radius:8px;background:#4f6ef7;color:#fff;
        font-size:14px;font-weight:600;cursor:pointer} button:hover{background:#3f5ee0}
      .msg{padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:8px}
      .err{background:#3a1622;color:#ff9db0} .ok{background:#13311f;color:#86efac}
    </style></head><body>
      <form class="card" method="post" action="?action=login">
        <h1>Flowentra File Manager</h1>
        <p class="sub">Sign in to manage backend files</p>
        <?php if ($f): ?><div class="msg <?= h($f['type']) ?>"><?= h($f['msg']) ?></div><?php endif; ?>
        <label>Username</label>
        <input name="username" autocomplete="username" autofocus required>
        <label>Password</label>
        <input name="password" type="password" autocomplete="current-password" required>
        <button type="submit">Log in</button>
      </form>
    </body></html>
    <?php
    exit;
}

// ===========================================================================
//  Authenticated area
// ===========================================================================

// ---- Write/modify actions (POST + CSRF) ------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action !== 'login') {
    csrf_check();
    $dir = $_POST['dir'] ?? '';

    if ($action === 'save') {
        $target = safe_path($_POST['path'] ?? '');
        if ($target === '' || !is_file($target)) {
            flash('err', 'Cannot save: invalid file path.');
        } elseif (!is_writable($target)) {
            flash('err', 'Cannot save: file is not writable (check permissions).');
        } else {
            file_put_contents($target, $_POST['content'] ?? '');
            flash('ok', 'Saved ' . h(rel_of($target)) . '.');
        }
        header('Location: ?action=edit&path=' . urlencode(rel_of($target)));
        exit;
    }

    if ($action === 'rename') {
        $target = safe_path($_POST['path'] ?? '');
        $newName = basename(str_replace('\\', '/', $_POST['newname'] ?? ''));
        if ($target === '' || !file_exists($target)) {
            flash('err', 'Cannot rename: source not found.');
        } elseif ($newName === '' || $newName === '.' || $newName === '..') {
            flash('err', 'Invalid new name.');
        } else {
            $dest = dirname($target) . '/' . $newName;
            if (!within_root($dest)) {
                flash('err', 'Rename target is outside the allowed root.');
            } elseif (file_exists($dest)) {
                flash('err', 'A file with that name already exists.');
            } elseif (@rename($target, $dest)) {
                flash('ok', 'Renamed to ' . h($newName) . '.');
            } else {
                flash('err', 'Rename failed (permissions?).');
            }
        }
        header('Location: ?dir=' . urlencode($dir));
        exit;
    }

    if ($action === 'delete') {
        $target = safe_path($_POST['path'] ?? '');
        if ($target === '' || !file_exists($target)) {
            flash('err', 'Cannot delete: not found.');
        } elseif (is_dir($target)) {
            if (@rmdir($target)) {
                flash('ok', 'Deleted folder.');
            } else {
                flash('err', 'Folder not empty or not deletable.');
            }
        } elseif (@unlink($target)) {
            flash('ok', 'Deleted file.');
        } else {
            flash('err', 'Delete failed (permissions?).');
        }
        header('Location: ?dir=' . urlencode($dir));
        exit;
    }

    if ($action === 'upload') {
        $destDir = safe_path($dir);
        if ($destDir === '' || !is_dir($destDir)) {
            flash('err', 'Upload target directory is invalid.');
        } elseif (empty($_FILES['file']['name'])) {
            flash('err', 'No file selected.');
        } else {
            $name = basename($_FILES['file']['name']);
            $dest = $destDir . '/' . $name;
            if (!within_root($dest)) {
                flash('err', 'Upload destination outside root.');
            } elseif (!is_uploaded_file($_FILES['file']['tmp_name'])) {
                flash('err', 'Upload error.');
            } elseif (@move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
                flash('ok', 'Uploaded ' . h($name) . '.');
            } else {
                flash('err', 'Could not move uploaded file (permissions?).');
            }
        }
        header('Location: ?dir=' . urlencode($dir));
        exit;
    }

    if ($action === 'newfile' || $action === 'newfolder') {
        $destDir = safe_path($dir);
        $name = basename(str_replace('\\', '/', $_POST['name'] ?? ''));
        if ($destDir === '' || !is_dir($destDir)) {
            flash('err', 'Invalid directory.');
        } elseif ($name === '' || $name === '.' || $name === '..') {
            flash('err', 'Invalid name.');
        } else {
            $dest = $destDir . '/' . $name;
            if (!within_root($dest)) {
                flash('err', 'Target outside root.');
            } elseif (file_exists($dest)) {
                flash('err', 'Already exists.');
            } elseif ($action === 'newfolder') {
                flash(@mkdir($dest, 0755) ? 'ok' : 'err', @is_dir($dest) ? 'Folder created.' : 'Could not create folder.');
            } else {
                flash(@file_put_contents($dest, '') !== false ? 'ok' : 'err',
                      file_exists($dest) ? 'File created.' : 'Could not create file.');
            }
        }
        header('Location: ?dir=' . urlencode($dir));
        exit;
    }

    http_response_code(400);
    exit('Unknown action.');
}

// ---- Download --------------------------------------------------------------
if ($action === 'download') {
    $target = safe_path($_GET['path'] ?? '');
    if ($target === '' || !is_file($target)) { http_response_code(404); exit('Not found.'); }
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($target) . '"');
    header('Content-Length: ' . filesize($target));
    readfile($target);
    exit;
}

// ---- Edit view -------------------------------------------------------------
if ($action === 'edit') {
    $target = safe_path($_GET['path'] ?? '');
    if ($target === '' || !is_file($target)) { flash('err', 'File not found.'); header('Location: ?'); exit; }
    $content = file_get_contents($target);
    $rel = rel_of($target);
    $dir = dirname($rel) === '.' ? '' : dirname($rel);
    $f = take_flash();
    ?>
    <!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Edit <?= h($rel) ?></title>
    <?= page_styles() ?>
    </head><body>
    <?= top_bar() ?>
    <div class="wrap">
      <?php if ($f): ?><div class="msg <?= h($f['type']) ?>"><?= h($f['msg']) ?></div><?php endif; ?>
      <div class="bar">
        <div><a class="btn" href="?dir=<?= urlencode($dir) ?>">&larr; Back</a>
          <strong style="margin-left:10px"><?= h($rel) ?></strong>
          <?= is_writable($target) ? '' : '<span class="tag warn">read-only</span>' ?>
        </div>
        <a class="btn" href="?action=download&path=<?= urlencode($rel) ?>">Download</a>
      </div>
      <form method="post" action="?action=save">
        <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
        <input type="hidden" name="path" value="<?= h($rel) ?>">
        <textarea name="content" spellcheck="false"><?= h($content) ?></textarea>
        <div style="margin-top:12px"><button class="btn primary" type="submit">Save changes</button></div>
      </form>
    </div>
    </body></html>
    <?php
    exit;
}

// ---- Directory listing (default) -------------------------------------------
$dirRel = $_GET['dir'] ?? '';
$dirAbs = safe_path($dirRel);
if ($dirAbs === '' || !is_dir($dirAbs)) { $dirAbs = $FM_ROOT; $dirRel = ''; }
$dirRel = rel_of($dirAbs);

$entries = @scandir($dirAbs) ?: [];
$dirs = $files = [];
foreach ($entries as $e) {
    if ($e === '.' || $e === '..') continue;
    $p = $dirAbs . '/' . $e;
    if (is_dir($p)) $dirs[] = $e; else $files[] = $e;
}
natcasesort($dirs); natcasesort($files);
$parent = $dirRel === '' ? null : (dirname($dirRel) === '.' ? '' : dirname($dirRel));
$f = take_flash();

function page_styles(): string {
    return '<style>
      *{box-sizing:border-box} body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0b1020;color:#e6e9f2}
      .topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;background:#151b34;border-bottom:1px solid #232b4d}
      .topbar h1{font-size:15px;margin:0} .topbar .sp{color:#8b93b0;font-size:12px;margin-left:10px}
      .wrap{max-width:1000px;margin:22px auto;padding:0 16px}
      a{color:#9db4ff;text-decoration:none} a:hover{text-decoration:underline}
      .crumbs{font-size:13px;color:#8b93b0;margin-bottom:14px}
      table{width:100%;border-collapse:collapse;background:#121835;border-radius:10px;overflow:hidden}
      th,td{text-align:left;padding:10px 12px;font-size:13px;border-bottom:1px solid #1e2647}
      th{color:#8b93b0;font-weight:600} tr:last-child td{border-bottom:0}
      tr:hover td{background:#161d3e}
      .btn{display:inline-block;padding:6px 11px;border-radius:7px;background:#222b50;color:#cdd6ff;border:0;font-size:12px;cursor:pointer}
      .btn:hover{background:#2c376a;text-decoration:none} .btn.primary{background:#4f6ef7;color:#fff} .btn.primary:hover{background:#3f5ee0}
      .btn.danger{background:#3a1622;color:#ff9db0} .btn.danger:hover{background:#52203010}
      .actions{display:flex;gap:6px;flex-wrap:wrap}
      .msg{padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:14px}
      .err{background:#3a1622;color:#ff9db0} .ok{background:#13311f;color:#86efac}
      .tag{font-size:10px;padding:2px 6px;border-radius:5px;margin-left:8px} .tag.warn{background:#3a2f12;color:#ffd27a}
      .bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px}
      textarea{width:100%;height:62vh;background:#0e1430;color:#e6e9f2;border:1px solid #2a3358;border-radius:10px;
        padding:14px;font-family:ui-monospace,Consolas,Menlo,monospace;font-size:13px;line-height:1.5}
      .panel{background:#121835;border-radius:10px;padding:14px;margin-bottom:18px;display:flex;gap:18px;flex-wrap:wrap}
      .panel form{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .panel input[type=text]{padding:7px 10px;border-radius:7px;border:1px solid #2a3358;background:#0e1430;color:#fff;font-size:13px}
      .muted{color:#8b93b0;font-size:12px}
    </style>';
}
function top_bar(): string {
    return '<div class="topbar"><div><h1>Flowentra File Manager</h1>
      <span class="sp">' . h(FM_USER) . '</span></div>
      <a class="btn" href="?action=logout">Log out</a></div>';
}
?>
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Files — <?= h($dirRel === '' ? '/' : $dirRel) ?></title>
<?= page_styles() ?>
</head><body>
<?= top_bar() ?>
<div class="wrap">
  <?php if ($f): ?><div class="msg <?= h($f['type']) ?>"><?= h($f['msg']) ?></div><?php endif; ?>

  <div class="crumbs">Root: <code><?= h($FM_ROOT) ?></code> &nbsp;|&nbsp; /<?= h($dirRel) ?></div>

  <div class="panel">
    <form method="post" action="?" enctype="multipart/form-data">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
      <input type="hidden" name="action" value="upload">
      <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
      <span class="muted">Upload:</span>
      <input type="file" name="file" required>
      <button class="btn primary" type="submit">Upload here</button>
    </form>
    <form method="post" action="?">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
      <input type="hidden" name="action" value="newfile">
      <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
      <span class="muted">New file:</span>
      <input type="text" name="name" placeholder="example.php" required>
      <button class="btn" type="submit">Create</button>
    </form>
    <form method="post" action="?">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
      <input type="hidden" name="action" value="newfolder">
      <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
      <span class="muted">New folder:</span>
      <input type="text" name="name" placeholder="folder" required>
      <button class="btn" type="submit">Create</button>
    </form>
  </div>

  <table>
    <thead><tr><th>Name</th><th>Size</th><th>Modified</th><th>Actions</th></tr></thead>
    <tbody>
      <?php if ($parent !== null): ?>
        <tr><td colspan="4"><a href="?dir=<?= urlencode($parent) ?>">&#8617; ..</a></td></tr>
      <?php endif; ?>

      <?php foreach ($dirs as $d): $rel = ($dirRel === '' ? '' : $dirRel . '/') . $d; ?>
        <tr>
          <td>📁 <a href="?dir=<?= urlencode($rel) ?>"><?= h($d) ?></a></td>
          <td class="muted">—</td>
          <td class="muted"><?= h(date('Y-m-d H:i', filemtime($dirAbs . '/' . $d))) ?></td>
          <td class="actions">
            <?= rename_form($rel, $dirRel, $d) ?>
            <?= delete_form($rel, $dirRel, 'Delete folder "' . $d . '"? (must be empty)') ?>
          </td>
        </tr>
      <?php endforeach; ?>

      <?php foreach ($files as $file): $rel = ($dirRel === '' ? '' : $dirRel . '/') . $file; $abs = $dirAbs . '/' . $file; ?>
        <tr>
          <td>📄 <a href="?action=edit&path=<?= urlencode($rel) ?>"><?= h($file) ?></a></td>
          <td class="muted"><?= h(human_size((int)filesize($abs))) ?></td>
          <td class="muted"><?= h(date('Y-m-d H:i', filemtime($abs))) ?></td>
          <td class="actions">
            <a class="btn" href="?action=edit&path=<?= urlencode($rel) ?>">Edit</a>
            <a class="btn" href="?action=download&path=<?= urlencode($rel) ?>">Download</a>
            <?= rename_form($rel, $dirRel, $file) ?>
            <?= delete_form($rel, $dirRel, 'Delete file "' . $file . '"?') ?>
          </td>
        </tr>
      <?php endforeach; ?>

      <?php if (!$dirs && !$files): ?>
        <tr><td colspan="4" class="muted">Empty folder.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
  <p class="muted" style="margin-top:18px">Tip: delete this file from the server when you no longer need it.</p>
</div>

<?php
function rename_form(string $rel, string $dir, string $current): string {
    $csrf = h(csrf_token());
    return '<form method="post" action="?" style="display:inline" onsubmit="this.newname.value=prompt(\'New name:\',\'' . h($current) . '\');return !!this.newname.value;">
        <input type="hidden" name="csrf" value="' . $csrf . '">
        <input type="hidden" name="action" value="rename">
        <input type="hidden" name="dir" value="' . h($dir) . '">
        <input type="hidden" name="path" value="' . h($rel) . '">
        <input type="hidden" name="newname" value="">
        <button class="btn" type="submit">Rename</button></form>';
}
function delete_form(string $rel, string $dir, string $confirm): string {
    $csrf = h(csrf_token());
    return '<form method="post" action="?" style="display:inline" onsubmit="return confirm(\'' . h($confirm) . '\');">
        <input type="hidden" name="csrf" value="' . $csrf . '">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="dir" value="' . h($dir) . '">
        <input type="hidden" name="path" value="' . h($rel) . '">
        <button class="btn danger" type="submit">Delete</button></form>';
}
?>
</body></html>
