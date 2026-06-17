<?php
/**
 * Flowentra Backend File Manager
 * ------------------------------------------------------------
 * A single-file, login-protected file manager for the backend.
 * Browse, edit, rename, delete, upload, download, create.
 *
 * Access (with the default Nginx /api/ alias):
 *   https://backend.flowentra.io/api/filemanager.php
 *
 * SECURITY:
 *   - HTTPS only. Change credentials. Delete when not needed.
 *   - If Delete/Save/Upload fail with "permissions", the PHP
 *     user (www-data) cannot write the files — fix ownership
 *     on the server (see the note printed at the bottom).
 * ------------------------------------------------------------
 */

// ---- Configuration ---------------------------------------------------------
const FM_USER = 'FlowentraLanding';
const FM_PASS = 'Zaleyo2026';

// Root directory the manager is allowed to operate in.
$FM_ROOT = realpath(__DIR__ . '/..');

// ---- Session & hardening ---------------------------------------------------
session_name('FLOW_FM');
session_start();
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if ($FM_ROOT === false) { http_response_code(500); exit('Root directory not found.'); }

// ---- Helpers ---------------------------------------------------------------
function csrf_token(): string {
    if (empty($_SESSION['fm_csrf'])) $_SESSION['fm_csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['fm_csrf'];
}
function csrf_check(): void {
    $t = $_POST['csrf'] ?? '';
    if (!is_string($t) || !hash_equals($_SESSION['fm_csrf'] ?? '', $t)) {
        http_response_code(403); exit('Invalid CSRF token. Reload the page.');
    }
}
function is_logged_in(): bool { return !empty($_SESSION['fm_auth']); }
function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

function safe_path(string $rel): string {
    global $FM_ROOT;
    $rel = ltrim(str_replace('\\', '/', $rel), '/');
    $target = $FM_ROOT . ($rel === '' ? '' : '/' . $rel);
    $real = realpath($target);
    if ($real === false) {
        $parent = realpath(dirname($target));
        if ($parent === false || !within_root($parent)) return '';
        return $parent . '/' . basename($target);
    }
    return within_root($real) ? $real : '';
}
function within_root(string $path): bool {
    global $FM_ROOT;
    $root = rtrim($FM_ROOT, '/');
    return $path === $root || strpos($path, $root . '/') === 0;
}
function rel_of(string $abs): string { global $FM_ROOT; return ltrim(substr($abs, strlen($FM_ROOT)), '/'); }
function flash(string $type, string $msg): void { $_SESSION['fm_flash'] = ['type' => $type, 'msg' => $msg]; }
function take_flash(): ?array { $f = $_SESSION['fm_flash'] ?? null; unset($_SESSION['fm_flash']); return $f; }
function human_size(int $bytes): string {
    $u = ['B','KB','MB','GB','TB']; $i = 0; $n = (float)$bytes;
    while ($n >= 1024 && $i < count($u) - 1) { $n /= 1024; $i++; }
    return ($i === 0 ? $bytes : round($n, 1)) . ' ' . $u[$i];
}
function file_icon(string $name, bool $isDir = false): string {
    if ($isDir) return '📁';
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    return [
        'php'=>'🐘','js'=>'🟨','ts'=>'🟦','tsx'=>'⚛️','jsx'=>'⚛️','json'=>'🗂️',
        'html'=>'🌐','css'=>'🎨','scss'=>'🎨','md'=>'📝','txt'=>'📄','log'=>'📈',
        'sql'=>'🗄️','sh'=>'⚙️','env'=>'🔑','yml'=>'🧾','yaml'=>'🧾','xml'=>'🧾',
        'png'=>'🖼️','jpg'=>'🖼️','jpeg'=>'🖼️','gif'=>'🖼️','svg'=>'🖼️','webp'=>'🖼️','ico'=>'🖼️',
        'zip'=>'📦','gz'=>'📦','tar'=>'📦','pdf'=>'📕',
    ][$ext] ?? '📄';
}
/** Is this a write/permission related failure for nicer messaging. */
function perm_hint(string $path): string {
    $dir = is_dir($path) ? $path : dirname($path);
    return is_writable($dir) ? '' : ' The folder is not writable by the web server (www-data). See the permissions note at the bottom of the file list.';
}

// ---- Auth actions ----------------------------------------------------------
$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = $_POST['username'] ?? ''; $p = $_POST['password'] ?? '';
    if (hash_equals(FM_USER, (string)$u) && hash_equals(FM_PASS, (string)$p)) {
        session_regenerate_id(true); $_SESSION['fm_auth'] = true;
        flash('ok', 'Welcome back, ' . FM_USER . '.');
    } else { flash('err', 'Invalid username or password.'); }
    header('Location: ?'); exit;
}
if ($action === 'logout') { $_SESSION = []; session_destroy(); header('Location: ?'); exit; }

// ---- Login screen ----------------------------------------------------------
if (!is_logged_in()) {
    $f = take_flash(); ?>
    <!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Flowentra File Manager — Sign in</title>
    <style>
      :root{--bg:#070b18;--card:#121a33;--line:#26315a;--ink:#eef1fb;--muted:#8b96bd;--accent:#5b7cfa;--accent2:#8b5cf6}
      *{box-sizing:border-box}
      body{margin:0;font-family:system-ui,'Segoe UI',Roboto,sans-serif;background:
        radial-gradient(1200px 600px at 80% -10%,rgba(91,124,250,.25),transparent 60%),
        radial-gradient(900px 500px at -10% 110%,rgba(139,92,246,.22),transparent 55%),var(--bg);
        color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center}
      .card{background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,0));backdrop-filter:blur(8px);
        border:1px solid var(--line);padding:34px;border-radius:18px;width:368px;box-shadow:0 30px 80px rgba(0,0,0,.55)}
      .logo{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));
        display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}
      h1{font-size:19px;margin:0 0 4px} p.sub{margin:0 0 22px;color:var(--muted);font-size:13px}
      label{display:block;font-size:12px;margin:16px 0 6px;color:#aab2d8}
      .ipt{position:relative}
      input{width:100%;padding:12px 13px;border-radius:10px;border:1px solid var(--line);background:#0c1430;color:#fff;font-size:14px;transition:.15s}
      input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(91,124,250,.25)}
      button{width:100%;margin-top:24px;padding:13px;border:0;border-radius:10px;
        background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-size:14px;font-weight:650;cursor:pointer;transition:.15s}
      button:hover{filter:brightness(1.08);transform:translateY(-1px)}
      .msg{padding:11px 13px;border-radius:10px;font-size:13px;margin-bottom:10px;border:1px solid transparent}
      .err{background:rgba(244,63,94,.12);color:#ff9db0;border-color:rgba(244,63,94,.3)}
      .ok{background:rgba(34,197,94,.12);color:#86efac;border-color:rgba(34,197,94,.3)}
      .foot{margin-top:18px;text-align:center;color:var(--muted);font-size:11px}
    </style></head><body>
      <form class="card" method="post" action="?action=login">
        <div class="logo">⚡</div>
        <h1>Flowentra File Manager</h1>
        <p class="sub">Sign in to manage your backend files</p>
        <?php if ($f): ?><div class="msg <?= h($f['type']) ?>"><?= h($f['msg']) ?></div><?php endif; ?>
        <label>Username</label>
        <div class="ipt"><input name="username" autocomplete="username" autofocus required></div>
        <label>Password</label>
        <div class="ipt"><input name="password" type="password" autocomplete="current-password" required></div>
        <button type="submit">Sign in →</button>
        <div class="foot">Secured · HTTPS · CSRF protected</div>
      </form>
    </body></html>
    <?php exit;
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
        if ($target === '' || !is_file($target)) flash('err', 'Cannot save: invalid file path.');
        elseif (!is_writable($target)) flash('err', 'Cannot save: file is not writable.' . perm_hint($target));
        else { file_put_contents($target, $_POST['content'] ?? ''); flash('ok', 'Saved ' . rel_of($target) . '.'); }
        header('Location: ?action=edit&path=' . urlencode(rel_of($target))); exit;
    }
    if ($action === 'rename') {
        $target = safe_path($_POST['path'] ?? '');
        $newName = basename(str_replace('\\', '/', $_POST['newname'] ?? ''));
        if ($target === '' || !file_exists($target)) flash('err', 'Cannot rename: source not found.');
        elseif ($newName === '' || $newName === '.' || $newName === '..') flash('err', 'Invalid new name.');
        else {
            $dest = dirname($target) . '/' . $newName;
            if (!within_root($dest)) flash('err', 'Rename target is outside the allowed root.');
            elseif (file_exists($dest)) flash('err', 'A file with that name already exists.');
            elseif (@rename($target, $dest)) flash('ok', 'Renamed to ' . $newName . '.');
            else flash('err', 'Rename failed.' . perm_hint($target));
        }
        header('Location: ?dir=' . urlencode($dir)); exit;
    }
    if ($action === 'delete') {
        $target = safe_path($_POST['path'] ?? '');
        if ($target === '' || !file_exists($target)) flash('err', 'Cannot delete: not found.');
        elseif (is_dir($target)) {
            if (@rmdir($target)) flash('ok', 'Deleted folder.');
            else flash('err', 'Folder not empty or not deletable.' . perm_hint($target));
        } elseif (@unlink($target)) flash('ok', 'Deleted file.');
        else flash('err', 'Delete failed.' . perm_hint($target));
        header('Location: ?dir=' . urlencode($dir)); exit;
    }
    if ($action === 'upload') {
        $destDir = safe_path($dir);
        if ($destDir === '' || !is_dir($destDir)) flash('err', 'Upload target directory is invalid.');
        elseif (empty($_FILES['file']['name'])) flash('err', 'No file selected.');
        else {
            $name = basename($_FILES['file']['name']); $dest = $destDir . '/' . $name;
            if (!within_root($dest)) flash('err', 'Upload destination outside root.');
            elseif (!is_uploaded_file($_FILES['file']['tmp_name'])) flash('err', 'Upload error.');
            elseif (@move_uploaded_file($_FILES['file']['tmp_name'], $dest)) flash('ok', 'Uploaded ' . $name . '.');
            else flash('err', 'Could not move uploaded file.' . perm_hint($destDir));
        }
        header('Location: ?dir=' . urlencode($dir)); exit;
    }
    if ($action === 'newfile' || $action === 'newfolder') {
        $destDir = safe_path($dir);
        $name = basename(str_replace('\\', '/', $_POST['name'] ?? ''));
        if ($destDir === '' || !is_dir($destDir)) flash('err', 'Invalid directory.');
        elseif ($name === '' || $name === '.' || $name === '..') flash('err', 'Invalid name.');
        else {
            $dest = $destDir . '/' . $name;
            if (!within_root($dest)) flash('err', 'Target outside root.');
            elseif (file_exists($dest)) flash('err', 'Already exists.');
            elseif ($action === 'newfolder') flash(@mkdir($dest, 0755) ? 'ok':'err', is_dir($dest) ? 'Folder created.' : 'Could not create folder.' . perm_hint($destDir));
            else flash(@file_put_contents($dest, '') !== false ? 'ok':'err', file_exists($dest) ? 'File created.' : 'Could not create file.' . perm_hint($destDir));
        }
        header('Location: ?dir=' . urlencode($dir)); exit;
    }

    if ($action === 'reload') {
        // Clear the compiled PHP (OPcache) so edited files take effect immediately.
        if (function_exists('opcache_reset')) {
            $ok = @opcache_reset();
            flash($ok ? 'ok' : 'err', $ok
                ? 'Backend reloaded — PHP OPcache cleared.'
                : 'OPcache reset returned false (it may be disabled for CLI/this pool).');
        } else {
            flash('ok', 'OPcache is not enabled, so PHP already serves the latest file edits.');
        }
        header('Location: ?dir=' . urlencode($dir)); exit;
    }

    http_response_code(400); exit('Unknown action.');
}

// ---- Download --------------------------------------------------------------
if ($action === 'download') {
    $target = safe_path($_GET['path'] ?? '');
    if ($target === '' || !is_file($target)) { http_response_code(404); exit('Not found.'); }
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($target) . '"');
    header('Content-Length: ' . filesize($target)); readfile($target); exit;
}

// ---- Shared chrome ---------------------------------------------------------
function page_styles(): string {
    return '<style>
      :root{--bg:#070b18;--panel:#0e1730;--panel2:#121b38;--line:#222d54;--ink:#eef1fb;--muted:#8b96bd;
        --accent:#5b7cfa;--accent2:#8b5cf6;--ok:#22c55e;--err:#f43f5e;--warn:#f59e0b}
      *{box-sizing:border-box}
      body{margin:0;font-family:system-ui,"Segoe UI",Roboto,sans-serif;color:var(--ink);
        background:radial-gradient(1100px 500px at 90% -15%,rgba(91,124,250,.16),transparent 60%),var(--bg)}
      a{color:#a9bcff;text-decoration:none} a:hover{color:#cdd8ff}
      .topbar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;
        padding:13px 22px;background:rgba(10,15,32,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
      .brand{display:flex;align-items:center;gap:11px}
      .brand .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--accent2));
        display:flex;align-items:center;justify-content:center;font-size:16px}
      .brand h1{font-size:15px;margin:0} .brand .u{color:var(--muted);font-size:12px}
      .wrap{max-width:1080px;margin:22px auto;padding:0 18px}
      .crumbs{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;margin-bottom:16px;color:var(--muted)}
      .crumbs a{padding:3px 9px;border-radius:7px;background:var(--panel)} .crumbs a:hover{background:var(--panel2)}
      .crumbs .sep{opacity:.5}
      .toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
      .toolbar .grow{flex:1}
      .search{display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);
        border-radius:10px;padding:8px 12px;min-width:180px}
      .search input{border:0;background:transparent;color:#fff;outline:none;font-size:13px;width:100%}
      .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 13px;border-radius:9px;background:var(--panel);
        color:#cdd6ff;border:1px solid var(--line);font-size:13px;cursor:pointer;transition:.13s;white-space:nowrap}
      .btn:hover{background:var(--panel2);border-color:#33407a;transform:translateY(-1px)}
      .btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;color:#fff}
      .btn.primary:hover{filter:brightness(1.08)}
      .btn.ghost{background:transparent}
      .btn.danger{background:rgba(244,63,94,.12);border-color:rgba(244,63,94,.3);color:#ff9db0}
      .btn.danger:hover{background:rgba(244,63,94,.2)}
      .btn.sm{padding:5px 9px;font-size:12px}
      .card{background:linear-gradient(180deg,rgba(255,255,255,.025),transparent);border:1px solid var(--line);
        border-radius:14px;overflow:hidden}
      table{width:100%;border-collapse:collapse}
      th,td{text-align:left;padding:11px 14px;font-size:13px;border-bottom:1px solid rgba(255,255,255,.05)}
      th{color:var(--muted);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em;background:rgba(255,255,255,.02)}
      tr:last-child td{border-bottom:0} tbody tr{transition:.1s} tbody tr:hover{background:rgba(91,124,250,.07)}
      .name{display:flex;align-items:center;gap:10px;font-weight:520}
      .name .ico{font-size:16px;width:20px;text-align:center}
      .ro{font-size:10px;padding:2px 7px;border-radius:6px;background:rgba(245,158,11,.15);color:#ffd27a;margin-left:8px}
      .rowact{display:flex;gap:6px;justify-content:flex-end;opacity:.55;transition:.13s}
      tr:hover .rowact{opacity:1}
      .muted{color:var(--muted)} .right{text-align:right}
      .empty{padding:40px;text-align:center;color:var(--muted)}
      /* toast */
      .toast{position:fixed;right:20px;bottom:20px;z-index:50;padding:13px 16px;border-radius:11px;font-size:13px;
        border:1px solid var(--line);background:var(--panel2);box-shadow:0 18px 50px rgba(0,0,0,.5);
        display:flex;align-items:center;gap:10px;animation:slidein .25s ease, fadeout .4s ease 3.6s forwards;max-width:380px}
      .toast.ok{border-color:rgba(34,197,94,.4)} .toast.ok .dot{background:var(--ok)}
      .toast.err{border-color:rgba(244,63,94,.4)} .toast.err .dot{background:var(--err)}
      .toast .dot{width:9px;height:9px;border-radius:50%;flex:none}
      @keyframes slidein{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}
      @keyframes fadeout{to{opacity:0;transform:translateY(8px)}}
      /* modal */
      .ov{position:fixed;inset:0;background:rgba(4,8,20,.7);backdrop-filter:blur(3px);z-index:60;display:none;
        align-items:center;justify-content:center}
      .ov.open{display:flex}
      .modal{background:var(--panel2);border:1px solid var(--line);border-radius:16px;width:380px;padding:24px;
        box-shadow:0 30px 80px rgba(0,0,0,.6);animation:slidein .2s ease}
      .modal h3{margin:0 0 6px;font-size:16px} .modal p{margin:0 0 16px;color:var(--muted);font-size:13px}
      .modal input{width:100%;padding:11px 12px;border-radius:9px;border:1px solid var(--line);background:#0c1430;color:#fff;font-size:14px}
      .modal input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(91,124,250,.25)}
      .modal .row{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
      /* editor */
      .edbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px}
      .edmeta{display:flex;align-items:center;gap:10px;font-size:13px}
      .edmeta .path{font-family:ui-monospace,Consolas,monospace;background:var(--panel);padding:5px 10px;border-radius:8px}
      .editor{position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#0a1228}
      textarea{width:100%;height:64vh;background:transparent;color:#e8ecfb;border:0;padding:16px 16px 16px 16px;
        font-family:ui-monospace,Consolas,Menlo,monospace;font-size:13px;line-height:1.6;resize:vertical;outline:none;tab-size:4}
      .edfoot{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:1px solid var(--line);
        font-size:12px;color:var(--muted);background:rgba(255,255,255,.02)}
      .kbd{font-family:ui-monospace,monospace;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:1px 6px;font-size:11px}
    </style>';
}
function top_bar(): string {
    return '<div class="topbar"><div class="brand"><div class="ic">⚡</div>
      <div><h1>Flowentra File Manager</h1><div class="u">Signed in as ' . h(FM_USER) . '</div></div></div>
      <a class="btn ghost" href="?action=logout">Log out</a></div>';
}
function toast(?array $f): string {
    if (!$f) return '';
    return '<div class="toast ' . h($f['type']) . '"><span class="dot"></span><span>' . h($f['msg']) . '</span></div>';
}
function crumbs(string $rel): string {
    $out = '<div class="crumbs"><a href="?dir=">🏠 backend</a>';
    if ($rel !== '') {
        $parts = explode('/', $rel); $acc = '';
        foreach ($parts as $p) {
            $acc = $acc === '' ? $p : $acc . '/' . $p;
            $out .= '<span class="sep">/</span><a href="?dir=' . urlencode($acc) . '">' . h($p) . '</a>';
        }
    }
    return $out . '</div>';
}
function modal_js(): string {
    return '<script>
      function openModal(id){document.getElementById(id).classList.add("open");
        const i=document.querySelector("#"+id+" input[autofocus],#"+id+" input");if(i)setTimeout(()=>i.focus(),50);}
      function closeModal(id){document.getElementById(id).classList.remove("open");}
      function doRename(path,dir,cur){var m=document.getElementById("m-rename");
        m.querySelector("[name=path]").value=path;m.querySelector("[name=dir]").value=dir;
        m.querySelector("[name=newname]").value=cur;openModal("m-rename");}
      function doDelete(path,dir,label){var m=document.getElementById("m-delete");
        m.querySelector("[name=path]").value=path;m.querySelector("[name=dir]").value=dir;
        document.getElementById("del-label").textContent=label;openModal("m-delete");}
      function doNew(kind){var m=document.getElementById("m-new");
        m.querySelector("[name=action]").value=kind==="folder"?"newfolder":"newfile";
        document.getElementById("new-title").textContent=kind==="folder"?"New folder":"New file";
        m.querySelector("[name=name]").value="";m.querySelector("[name=name]").placeholder=kind==="folder"?"folder-name":"example.php";
        openModal("m-new");}
      function filterRows(q){q=q.toLowerCase();document.querySelectorAll("tbody tr[data-name]").forEach(function(r){
        r.style.display=r.getAttribute("data-name").toLowerCase().includes(q)?"":"none";});}
      document.addEventListener("keydown",function(e){if(e.key==="Escape")document.querySelectorAll(".ov.open").forEach(o=>o.classList.remove("open"));});
    </script>';
}

// ---- Edit view -------------------------------------------------------------
if ($action === 'edit') {
    $target = safe_path($_GET['path'] ?? '');
    if ($target === '' || !is_file($target)) { flash('err', 'File not found.'); header('Location: ?'); exit; }
    $content = file_get_contents($target);
    $rel = rel_of($target);
    $dir = dirname($rel) === '.' ? '' : dirname($rel);
    $writable = is_writable($target);
    $lines = substr_count($content, "\n") + 1;
    $f = take_flash(); ?>
    <!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Edit · <?= h(basename($rel)) ?></title><?= page_styles() ?></head><body>
    <?= top_bar() ?>
    <div class="wrap">
      <?= crumbs($dir) ?>
      <form method="post" action="?action=save" id="edform">
        <div class="edbar">
          <div class="edmeta">
            <a class="btn sm" href="?dir=<?= urlencode($dir) ?>">← Back</a>
            <span class="ico"><?= file_icon($rel) ?></span>
            <span class="path"><?= h($rel) ?></span>
            <?= $writable ? '' : '<span class="ro">read-only</span>' ?>
          </div>
          <div style="display:flex;gap:8px">
            <a class="btn sm" href="?action=download&path=<?= urlencode($rel) ?>">⬇ Download</a>
            <button class="btn primary sm" type="submit" <?= $writable ? '' : 'disabled' ?>>💾 Save</button>
          </div>
        </div>
        <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
        <input type="hidden" name="path" value="<?= h($rel) ?>">
        <div class="editor">
          <textarea name="content" spellcheck="false" <?= $writable ? '' : 'readonly' ?>><?= h($content) ?></textarea>
          <div class="edfoot">
            <span><?= number_format($lines) ?> lines · <?= h(human_size(strlen($content))) ?></span>
            <span>Press <span class="kbd">Ctrl</span>+<span class="kbd">S</span> to save</span>
          </div>
        </div>
      </form>
    </div>
    <?= toast($f) ?>
    <script>
      document.addEventListener("keydown",function(e){
        if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();
          var b=document.querySelector("#edform button[type=submit]");if(b&&!b.disabled)document.getElementById("edform").submit();}});
      var ta=document.querySelector("textarea");
      if(ta)ta.addEventListener("keydown",function(e){if(e.key==="Tab"){e.preventDefault();
        var s=this.selectionStart,en=this.selectionEnd;this.value=this.value.slice(0,s)+"    "+this.value.slice(en);
        this.selectionStart=this.selectionEnd=s+4;}});
    </script>
    </body></html>
    <?php exit;
}

// ---- Directory listing (default) -------------------------------------------
$dirRel = $_GET['dir'] ?? '';
$dirAbs = safe_path($dirRel);
if ($dirAbs === '' || !is_dir($dirAbs)) { $dirAbs = $FM_ROOT; $dirRel = ''; }
$dirRel = rel_of($dirAbs);
$dirWritable = is_writable($dirAbs);

$entries = @scandir($dirAbs) ?: [];
$dirs = $files = [];
foreach ($entries as $e) {
    if ($e === '.' || $e === '..') continue;
    is_dir($dirAbs . '/' . $e) ? $dirs[] = $e : $files[] = $e;
}
natcasesort($dirs); natcasesort($files);
$f = take_flash();
?>
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Files · /<?= h($dirRel) ?></title><?= page_styles() ?></head><body>
<?= top_bar() ?>
<div class="wrap">
  <?= crumbs($dirRel) ?>

  <div class="toolbar">
    <div class="search">🔍 <input type="text" placeholder="Filter in this folder…" oninput="filterRows(this.value)"></div>
    <div class="grow"></div>
    <form method="post" action="?" enctype="multipart/form-data" style="display:inline" id="upform">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
      <input type="hidden" name="action" value="upload">
      <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
      <input type="file" name="file" id="upfile" style="display:none" onchange="document.getElementById('upform').submit()">
      <button class="btn" type="button" onclick="document.getElementById('upfile').click()" <?= $dirWritable ? '' : 'disabled title="Folder not writable"' ?>>⬆ Upload</button>
    </form>
    <button class="btn" onclick="doNew('file')" <?= $dirWritable ? '' : 'disabled' ?>>📄 New file</button>
    <button class="btn" onclick="doNew('folder')" <?= $dirWritable ? '' : 'disabled' ?>>📁 New folder</button>
    <form method="post" action="?" style="display:inline" title="Clear PHP OPcache so edited .php files take effect now">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
      <input type="hidden" name="action" value="reload">
      <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
      <button class="btn primary" type="submit">♻ Reload backend</button>
    </form>
  </div>

  <?php if (!$dirWritable): ?>
    <div class="toast err" style="position:static;margin-bottom:14px;max-width:none;animation:none">
      <span class="dot"></span>
      <span>This folder is <b>not writable</b> by the web server, so Save / Upload / Delete / Rename will fail here. See the fix at the bottom.</span>
    </div>
  <?php endif; ?>

  <div class="card">
    <table>
      <thead><tr><th>Name</th><th class="right">Size</th><th>Modified</th><th class="right">Actions</th></tr></thead>
      <tbody>
        <?php foreach ($dirs as $d): $rel = ($dirRel === '' ? '' : $dirRel . '/') . $d; ?>
          <tr data-name="<?= h($d) ?>">
            <td><div class="name"><span class="ico">📁</span><a href="?dir=<?= urlencode($rel) ?>"><?= h($d) ?></a></div></td>
            <td class="right muted">—</td>
            <td class="muted"><?= h(date('Y-m-d H:i', filemtime($dirAbs . '/' . $d))) ?></td>
            <td><div class="rowact">
              <button class="btn sm" onclick="doRename('<?= h($rel) ?>','<?= h($dirRel) ?>','<?= h($d) ?>')">Rename</button>
              <button class="btn danger sm" onclick="doDelete('<?= h($rel) ?>','<?= h($dirRel) ?>','folder &quot;<?= h($d) ?>&quot;')">Delete</button>
            </div></td>
          </tr>
        <?php endforeach; ?>

        <?php foreach ($files as $file): $rel = ($dirRel === '' ? '' : $dirRel . '/') . $file; $abs = $dirAbs . '/' . $file; ?>
          <tr data-name="<?= h($file) ?>">
            <td><div class="name"><span class="ico"><?= file_icon($file) ?></span>
              <a href="?action=edit&path=<?= urlencode($rel) ?>"><?= h($file) ?></a>
              <?= is_writable($abs) ? '' : '<span class="ro">ro</span>' ?></div></td>
            <td class="right muted"><?= h(human_size((int)filesize($abs))) ?></td>
            <td class="muted"><?= h(date('Y-m-d H:i', filemtime($abs))) ?></td>
            <td><div class="rowact">
              <a class="btn sm" href="?action=edit&path=<?= urlencode($rel) ?>">Edit</a>
              <a class="btn sm" href="?action=download&path=<?= urlencode($rel) ?>">⬇</a>
              <button class="btn sm" onclick="doRename('<?= h($rel) ?>','<?= h($dirRel) ?>','<?= h($file) ?>')">Rename</button>
              <button class="btn danger sm" onclick="doDelete('<?= h($rel) ?>','<?= h($dirRel) ?>','file &quot;<?= h($file) ?>&quot;')">Delete</button>
            </div></td>
          </tr>
        <?php endforeach; ?>

        <?php if (!$dirs && !$files): ?>
          <tr><td colspan="4"><div class="empty">This folder is empty.</div></td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>

  <p class="muted" style="margin-top:16px;font-size:12px">
    Root: <code><?= h($FM_ROOT) ?></code> · <?= count($dirs) ?> folders, <?= count($files) ?> files.
    Remember to delete this file when you're done.
  </p>
</div>

<!-- Modals -->
<div class="ov" id="m-rename"><div class="modal">
  <h3>Rename</h3><p>Enter a new name.</p>
  <form method="post" action="?">
    <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="rename">
    <input type="hidden" name="dir" value=""><input type="hidden" name="path" value="">
    <input type="text" name="newname" autofocus required>
    <div class="row"><button class="btn" type="button" onclick="closeModal('m-rename')">Cancel</button>
      <button class="btn primary" type="submit">Rename</button></div>
  </form>
</div></div>

<div class="ov" id="m-new"><div class="modal">
  <h3 id="new-title">New</h3><p>Created in the current folder.</p>
  <form method="post" action="?">
    <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="newfile">
    <input type="hidden" name="dir" value="<?= h($dirRel) ?>">
    <input type="text" name="name" autofocus required>
    <div class="row"><button class="btn" type="button" onclick="closeModal('m-new')">Cancel</button>
      <button class="btn primary" type="submit">Create</button></div>
  </form>
</div></div>

<div class="ov" id="m-delete"><div class="modal">
  <h3>Delete?</h3><p>This permanently deletes <span id="del-label"></span>. This cannot be undone.</p>
  <form method="post" action="?">
    <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
    <input type="hidden" name="action" value="delete">
    <input type="hidden" name="dir" value=""><input type="hidden" name="path" value="">
    <div class="row"><button class="btn" type="button" onclick="closeModal('m-delete')">Cancel</button>
      <button class="btn danger" type="submit">Delete</button></div>
  </form>
</div></div>

<?= toast($f) ?>
<?= modal_js() ?>
</body></html>
