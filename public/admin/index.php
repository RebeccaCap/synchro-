<?php
// ══════════════════════════════════════════════════════════════════════════
//  SynCHRO — Admin
//  Presentation materials (uploads + access passwords) and RSVP responses.
//  Lives at /admin/ — the old /admin.php address redirects here.
//
//  The admin password is NOT stored here. It's a hash in
//  synchro-private/config.php, next to public_html (see README).
// ══════════════════════════════════════════════════════════════════════════

define('SYNCHRO_HTML', true);
require dirname(__DIR__) . '/api/bootstrap.php';

// rsvp.php writes this next to the website's index.html.
define('CSV_FILE', dirname(__DIR__) . '/rsvp_responses.csv');
const VALIDITY_PRESETS = [24 => '24 hours', 72 => '72 hours', 168 => '7 days', 720 => '30 days'];

function h($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function admin_url(array $params = []): string
{
    return '/admin/' . ($params ? '?' . http_build_query($params) : '');
}

function redirect_to(array $params): void
{
    header('Location: ' . admin_url($params), true, 303);
    exit;
}

function is_xhr(): bool
{
    return ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'synchro';
}

// Ties every form to the current login cookie, on top of SameSite=Strict.
function csrf_token(): string
{
    return hash_hmac('sha256', 'csrf|' . ($_COOKIE[ADMIN_COOKIE] ?? ''), config()['secret']);
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . h(csrf_token()) . '">';
}

// One-off messages shown after a redirect (including a newly generated password).
function flash(array $data): void
{
    issue_token(FLASH_COOKIE, $data + ['exp' => time() + 120], ADMIN_COOKIE_PATH);
}

function take_flash(): array
{
    $flash = read_token(FLASH_COOKIE);
    if ($flash !== null) {
        clear_token(FLASH_COOKIE, ADMIN_COOKIE_PATH);
    }
    return $flash ?? [];
}

function format_time(int $timestamp): string
{
    $date = new DateTime('@' . $timestamp);
    $date->setTimezone(new DateTimeZone('Europe/Oslo'));
    return $date->format('j M Y, H:i T');
}

function format_bytes(int $bytes): string
{
    if ($bytes < 1024) {
        return $bytes . ' B';
    }
    if ($bytes < 1048576) {
        return round($bytes / 1024) . ' KB';
    }
    if ($bytes < 1073741824) {
        return number_format($bytes / 1048576, 1) . ' MB';
    }
    return number_format($bytes / 1073741824, 2) . ' GB';
}

function file_extension(string $name): string
{
    $extension = pathinfo($name, PATHINFO_EXTENSION);
    return $extension === '' ? 'FILE' : strtoupper(substr($extension, 0, 4));
}

function handle_upload(string $presentationId): array
{
    $upload = $_FILES['files'] ?? null;
    if (!$upload || !is_array($upload['name'])) {
        return [0, ['No files were received.']];
    }

    $maxBytes = (int) (config()['max_upload_mb'] ?? 512) * 1024 * 1024;
    $accepted = [];
    $errors = [];

    foreach ($upload['name'] as $i => $originalName) {
        if ($upload['error'][$i] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        $name = clean_text(basename((string) $originalName), 200);
        // Name chosen in the upload list before confirming (keeps the original file type).
        $requested = is_array($_POST['names'] ?? null) ? ($_POST['names'][$i] ?? '') : '';
        if (is_string($requested) && trim($requested) !== '') {
            $renamed = renamed_file_name($name, $requested);
            if ($renamed !== '') {
                $name = $renamed;
            }
        }
        $error = $upload['error'][$i];

        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            $errors[] = "$name is larger than the server allows (" . ini_get('upload_max_filesize') . ').';
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            $errors[] = "$name could not be uploaded (error $error).";
            continue;
        }
        if (!in_array(strtolower(pathinfo($name, PATHINFO_EXTENSION)), ALLOWED_EXTENSIONS, true)) {
            $errors[] = "$name is not an allowed file type.";
            continue;
        }
        if ($upload['size'][$i] > $maxBytes) {
            $errors[] = "$name is larger than " . ($maxBytes / 1048576) . ' MB.';
            continue;
        }

        $id = new_id();
        if (!move_uploaded_file($upload['tmp_name'][$i], stored_file_path($id))) {
            $errors[] = "$name could not be saved.";
            continue;
        }
        $accepted[] = [
            'id' => $id,
            'presentation_id' => $presentationId,
            'name' => $name,
            'size' => (int) $upload['size'][$i],
            'uploaded_at' => time(),
            // New uploads stay hidden from viewers until they're published.
            'published' => false,
        ];
    }

    if ($accepted) {
        store_update('files', function (array &$all) use ($accepted) {
            foreach ($accepted as $file) {
                $all[$file['id']] = $file;
            }
        });
    }
    if (!$accepted && !$errors) {
        $errors[] = 'Choose at least one file to upload.';
    }
    return [count($accepted), $errors];
}

// ---------------------------------------------------------------------------
// Requests

$loginError = '';
$isPost = $_SERVER['REQUEST_METHOD'] === 'POST';
$action = $_POST['action'] ?? '';

if ($isPost && $action === 'login') {
    guard_attempts('admin');
    if (verify_admin_password((string) ($_POST['password'] ?? ''))) {
        issue_token(ADMIN_COOKIE, ['typ' => 'admin', 'exp' => time() + ADMIN_SESSION_SECONDS], ADMIN_COOKIE_PATH);
        redirect_to([]);
    }
    record_failed_attempt('admin');
    $loginError = 'Incorrect password.';
}

$admin = is_admin();

if ($admin && $isPost) {
    $back = ['tab' => 'materials'];
    if (valid_id($_POST['presentation_id'] ?? '')) {
        $back['p'] = $_POST['presentation_id'];
    }

    // PHP drops the whole request body when it exceeds post_max_size.
    if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
        $message = 'The upload is larger than the server allows (' . ini_get('post_max_size') . ').';
        if (is_xhr()) {
            respond_upload_error($message);
        }
        flash(['error' => $message]);
        redirect_to($back);
    }

    if (!hash_equals(csrf_token(), (string) ($_POST['csrf'] ?? ''))) {
        fail(403, 'This page has expired. Please go back, reload it and try again.');
    }

    $presentations = store_read('presentations');
    $presentationId = $_POST['presentation_id'] ?? '';
    $presentationExists = valid_id($presentationId) && isset($presentations[$presentationId]);
    $fileId = $_POST['file_id'] ?? '';
    $file = valid_id($fileId) ? (store_read('files')[$fileId] ?? null) : null;

    switch ($action) {
        case 'logout':
            clear_token(ADMIN_COOKIE, ADMIN_COOKIE_PATH);
            redirect_to([]);

        case 'create_presentation':
            $title = clean_text($_POST['title'] ?? '', 120);
            if ($title === '') {
                flash(['error' => 'Please enter a title.']);
                redirect_to(['tab' => 'materials']);
            }
            $presentation = ['id' => new_id(), 'title' => $title, 'created_at' => time()];
            store_update('presentations', function (array &$all) use ($presentation) {
                $all[$presentation['id']] = $presentation;
            });
            redirect_to(['tab' => 'materials', 'p' => $presentation['id']]);

        case 'delete_presentation':
            if ($presentationExists) {
                store_update('presentations', function (array &$all) use ($presentationId) {
                    unset($all[$presentationId]);
                });
                store_update('codes', function (array &$all) use ($presentationId) {
                    $all = array_filter($all, function ($c) use ($presentationId) {
                        return $c['presentation_id'] !== $presentationId;
                    });
                });
                $removed = store_update('files', function (array &$all) use ($presentationId) {
                    $removed = array_keys(array_filter($all, function ($f) use ($presentationId) {
                        return $f['presentation_id'] === $presentationId;
                    }));
                    foreach ($removed as $id) {
                        unset($all[$id]);
                    }
                    return $removed;
                });
                foreach ($removed as $id) {
                    @unlink(stored_file_path($id));
                }
                flash(['notice' => 'Presentation deleted.']);
            }
            redirect_to(['tab' => 'materials']);

        case 'upload':
            if (!$presentationExists) {
                fail(404, 'Presentation not found.');
            }
            [$count, $errors] = handle_upload($presentationId);
            $flash = $errors ? ['error' => implode(' ', $errors)] : [];
            if ($count) {
                $flash['notice'] = $count . ($count === 1 ? ' file uploaded.' : ' files uploaded.')
                    . ' Rename if needed, then publish to make ' . ($count === 1 ? 'it' : 'them') . ' visible to viewers.';
            }
            flash($flash);
            if (is_xhr()) {
                respond(['ok' => true]);
            }
            redirect_to($back);

        case 'rename_file':
            if ($file) {
                $name = renamed_file_name($file['name'], $_POST['name'] ?? '');
                if ($name === '') {
                    flash(['error' => 'Please enter a file name.']);
                } else {
                    store_update('files', function (array &$all) use ($fileId, $name) {
                        if (isset($all[$fileId])) {
                            $all[$fileId]['name'] = $name;
                        }
                    });
                }
            }
            redirect_to($back);

        case 'publish_file':
        case 'unpublish_file':
            if ($file) {
                $published = $action === 'publish_file';
                store_update('files', function (array &$all) use ($fileId, $published) {
                    if (isset($all[$fileId])) {
                        $all[$fileId]['published'] = $published;
                    }
                });
            }
            redirect_to($back);

        case 'publish_all':
            if ($presentationExists) {
                store_update('files', function (array &$all) use ($presentationId) {
                    foreach ($all as $id => $f) {
                        if ($f['presentation_id'] === $presentationId) {
                            $all[$id]['published'] = true;
                        }
                    }
                });
            }
            redirect_to($back);

        case 'delete_file':
            if ($file) {
                store_update('files', function (array &$all) use ($fileId) {
                    unset($all[$fileId]);
                });
                @unlink(stored_file_path($fileId));
            }
            redirect_to($back);

        case 'create_code':
            if (!$presentationExists) {
                fail(404, 'Presentation not found.');
            }
            $validity = $_POST['validity'] ?? '24';
            $hours = $validity === 'custom'
                ? (int) ($_POST['custom_amount'] ?? 0) * (($_POST['custom_unit'] ?? 'hours') === 'days' ? 24 : 1)
                : (int) $validity;
            if ($hours < 1 || $hours > MAX_CODE_HOURS) {
                flash(['error' => 'Choose a validity between 1 hour and 365 days.']);
                redirect_to($back);
            }
            $plain = generate_code();
            $code = [
                'id' => new_id(),
                'presentation_id' => $presentationId,
                'hash' => code_hash($plain),
                'hint' => substr($plain, -4),
                'sealed' => seal_code($plain),
                'label' => clean_text($_POST['label'] ?? '', 80),
                'created_at' => time(),
                'expires_at' => time() + $hours * 3600,
                'revoked' => false,
            ];
            store_update('codes', function (array &$all) use ($code) {
                $all[$code['id']] = $code;
            });
            // Stored as a hash (for logins) and encrypted (so it can be copied again later).
            flash(['code' => $plain, 'code_expires' => $code['expires_at'], 'code_for' => $presentationId]);
            redirect_to($back);

        case 'revoke_code':
            $codeId = $_POST['code_id'] ?? '';
            if (valid_id($codeId)) {
                store_update('codes', function (array &$all) use ($codeId) {
                    if (isset($all[$codeId])) {
                        $all[$codeId]['revoked'] = true;
                    }
                });
            }
            redirect_to($back);

        default:
            fail(400, 'Unknown action.');
    }
}

function respond_upload_error(string $message): void
{
    respond(['error' => $message], 413);
}

// CSV download
if ($admin && isset($_GET['download']) && file_exists(CSV_FILE)) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="synchro-rsvp-' . date('Y-m-d') . '.csv"');
    readfile(CSV_FILE);
    exit;
}

// ---------------------------------------------------------------------------
// Page data

$tab = ($_GET['tab'] ?? 'materials') === 'rsvp' ? 'rsvp' : 'materials';
$flash = $admin ? take_flash() : [];

$rows = [];
if ($admin && $tab === 'rsvp' && file_exists(CSV_FILE)) {
    $fp = fopen(CSV_FILE, 'r');
    $first = true;
    while (($row = fgetcsv($fp, 0, ',', '"', '\\')) !== false) {
        if ($first) {
            $first = false;
            continue;
        }
        $rows[] = $row;
    }
    fclose($fp);
}
// Column 7 is "Attending" (0 timestamp, 1-2 name, 3 title, 4 company, 5 email, 6 phone).
$attending = count(array_filter($rows, function ($r) {
    return ($r[7] ?? '') === 'Yes';
}));
$notAttending = count(array_filter($rows, function ($r) {
    return ($r[7] ?? '') === 'No';
}));
$total = count($rows);

$presentations = [];
$selected = null;
$files = [];
$codes = [];
if ($admin && $tab === 'materials') {
    $allFiles = store_read('files');
    $allCodes = store_read('codes');
    foreach (store_read('presentations') as $p) {
        $id = $p['id'];
        $p['file_count'] = count(array_filter($allFiles, function ($f) use ($id) {
            return $f['presentation_id'] === $id;
        }));
        $p['active_codes'] = count(array_filter($allCodes, function ($c) use ($id) {
            return $c['presentation_id'] === $id && code_status($c) === 'active';
        }));
        $presentations[] = $p;
    }
    usort($presentations, function ($a, $b) {
        return $b['created_at'] <=> $a['created_at'];
    });

    $selectedId = $_GET['p'] ?? ($presentations[0]['id'] ?? '');
    foreach ($presentations as $p) {
        if ($p['id'] === $selectedId) {
            $selected = $p;
        }
    }
    if ($selected) {
        $files = files_for($selected['id'], false);
        $codes = array_values(array_filter($allCodes, function ($c) use ($selected) {
            return $c['presentation_id'] === $selected['id'];
        }));
        usort($codes, function ($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });
    }
}
$hiddenCount = count(array_filter($files, function ($f) {
    return !$f['published'];
}));
$viewerLink = (is_https() ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'synchroforum.eu') . '/presentation/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>SynCHRO — Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;1,800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --black: #0b0c11; --dark: #101220; --card: #161825;
      --blue: #1061E8; --orange: #F5611A; --green: #22c55e; --red: #f87171;
      --white: #fff; --border: rgba(255,255,255,0.08);
      --muted: rgba(255,255,255,.5); --soft: rgba(255,255,255,.7);
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:var(--black); color:var(--white); font-family:'Barlow',Arial,sans-serif; min-height:100vh; }
    a { color:inherit; }

    /* ── Login ── */
    .login-wrap { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; }
    .login-card { background:var(--card); border:1px solid var(--border); border-radius:4px; padding:48px 40px; width:100%; max-width:380px; }
    .login-logo { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-bottom:32px; display:block; }
    .login-logo em, .admin-logo em { font-style:italic; }
    label.field-label { display:block; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
    .input {
      width:100%; background:var(--dark); border:1px solid var(--border); border-radius:2px;
      color:var(--white); font-family:'Barlow',sans-serif; font-size:14px; padding:10px 14px; outline:none; transition:border-color .18s;
    }
    .input:focus { border-color:rgba(255,255,255,0.3); }
    .login-card .input { margin-bottom:16px; }
    .btn { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; background:var(--orange); color:#fff;
      font-size:13px; font-weight:600; font-family:'Barlow',sans-serif; letter-spacing:0.02em; white-space:nowrap;
      border:1px solid transparent; border-radius:2px; cursor:pointer; text-decoration:none; transition:opacity .18s, border-color .18s, color .18s; }
    .btn:hover { opacity:.88; }
    .btn-outline { background:transparent; border-color:var(--border); color:var(--soft); }
    .btn-outline:hover { opacity:1; border-color:rgba(255,255,255,.3); color:var(--white); }
    .btn-small { padding:6px 12px; font-size:12px; }
    .link-btn { background:none; border:none; color:var(--muted); font:inherit; font-size:13px; cursor:pointer; padding:4px 0; }
    .link-btn:hover { color:var(--white); }
    .link-btn.danger:hover { color:var(--red); }
    .error { font-size:13px; color:var(--red); margin-bottom:16px; }

    /* ── Layout ── */
    .admin-header { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:20px 40px; background:var(--dark); border-bottom:1px solid var(--border); }
    .admin-logo { font-family:'Barlow Condensed',sans-serif; font-size:20px; font-weight:800; letter-spacing:-0.02em; }
    .header-actions { display:flex; gap:12px; align-items:center; }
    .tabs { display:flex; gap:4px; padding:0 40px; background:var(--dark); border-bottom:1px solid var(--border); overflow-x:auto; }
    .tab { padding:14px 18px; font-size:14px; font-weight:600; color:var(--muted); text-decoration:none; border-bottom:2px solid transparent; white-space:nowrap; }
    .tab:hover { color:var(--white); }
    .tab.active { color:var(--white); border-bottom-color:var(--orange); }
    .main { padding:40px; max-width:1180px; margin:0 auto; }
    .section-title { font-family:'Barlow Condensed',sans-serif; font-size:28px; font-weight:700; margin-bottom:20px; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:4px; }
    .card-title { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; }
    .muted { color:var(--muted); }
    .small { font-size:12.5px; }

    /* ── Flash messages ── */
    .flash { padding:12px 16px; border-radius:2px; font-size:14px; margin-bottom:24px; border:1px solid; }
    .flash-notice { border-color:rgba(34,197,94,.35); background:rgba(34,197,94,.08); }
    .flash-error { border-color:rgba(248,113,113,.4); background:rgba(248,113,113,.08); color:#fecaca; }

    /* ── RSVP ── */
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:36px; }
    .stat-card { background:var(--card); border:1px solid var(--border); border-radius:4px; padding:24px 28px; }
    .stat-num { font-family:'Barlow Condensed',sans-serif; font-size:52px; font-weight:800; line-height:1; margin-bottom:4px; }
    .stat-num.green { color:var(--green); }
    .stat-num.orange { color:var(--orange); }
    .stat-label { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:rgba(255,255,255,.45); }
    .rsvp-head { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:20px; }
    .rsvp-head .section-title { margin-bottom:0; }
    .table-wrap { overflow-x:auto; border:1px solid var(--border); border-radius:4px; }
    table { width:100%; border-collapse:collapse; font-size:13.5px; }
    th { background:var(--dark); font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,.45); padding:12px 16px; text-align:left; white-space:nowrap; }
    td { padding:13px 16px; border-top:1px solid var(--border); vertical-align:top; }
    tr:hover td { background:rgba(255,255,255,.02); }
    .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
    .badge-yes, .badge-active, .badge-published { background:rgba(34,197,94,.15); color:var(--green); }
    .badge-no, .badge-hidden { background:rgba(245,97,26,.12); color:var(--orange); }
    .badge-expired { background:rgba(255,255,255,.08); color:var(--muted); }
    .badge-revoked { background:rgba(248,113,113,.12); color:var(--red); }
    .empty { padding:60px; text-align:center; color:rgba(255,255,255,.3); font-size:15px; }

    /* ── Materials ── */
    .materials { display:grid; grid-template-columns:280px minmax(0,1fr); gap:28px; align-items:start; }
    .sidebar { display:flex; flex-direction:column; gap:12px; }
    .new-form { padding:18px; display:flex; flex-direction:column; gap:10px; }
    .p-link { display:block; padding:14px 16px; text-decoration:none; border:1px solid var(--border); border-radius:4px; background:var(--card); }
    .p-link:hover { border-color:rgba(255,255,255,.2); }
    .p-link.active { border-color:var(--orange); }
    .p-link strong { display:block; font-weight:600; font-size:15px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .detail { display:flex; flex-direction:column; gap:20px; min-width:0; }
    .detail-head { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap; }
    .detail-head h2 { font-family:'Barlow Condensed',sans-serif; font-size:40px; font-weight:800; line-height:1; letter-spacing:-0.01em; }
    .eyebrow { font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--orange); margin-bottom:8px; }
    .panel { padding:24px 28px; }
    .panel-head { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; flex-wrap:wrap; }

    .chips { display:flex; flex-wrap:wrap; gap:8px; }
    .chips input { position:absolute; opacity:0; pointer-events:none; }
    .chip { padding:8px 14px; font-size:13px; font-weight:600; border:1px solid var(--border); border-radius:2px; color:var(--soft); cursor:pointer; user-select:none; }
    .chip:hover { border-color:rgba(255,255,255,.3); }
    .chips input:checked + .chip { border-color:var(--orange); color:var(--white); background:rgba(245,97,26,.1); }
    .chips input:focus-visible + .chip { outline:2px solid var(--orange); outline-offset:2px; }
    .custom { display:none; gap:8px; margin-top:10px; max-width:260px; }
    .code-form:has(#v-custom:checked) .custom { display:flex; }
    .form-row { margin-top:16px; }

    .new-code { margin-top:20px; padding:20px 22px; border:1px solid rgba(245,97,26,.5); background:rgba(245,97,26,.07); border-radius:2px; }
    .new-code .code { font-family:ui-monospace,Consolas,monospace; font-size:30px; font-weight:700; letter-spacing:.12em; margin:8px 0 6px; word-break:break-all; }
    .new-code .actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }

    .codes { margin-top:22px; }
    .codes th { background:transparent; padding:8px 12px 8px 0; }
    .codes td { padding:12px 12px 12px 0; }
    .mono { font-family:ui-monospace,Consolas,monospace; }
    .code-value.revealed { letter-spacing:.06em; }
    .code-actions { display:flex; flex-wrap:wrap; gap:4px 14px; margin-top:4px; }
    .code-actions .link-btn { font-size:12.5px; padding:2px 0; }

    .dropzone { display:flex; flex-direction:column; align-items:center; gap:10px; padding:26px; text-align:center; border:1px dashed rgba(255,255,255,.2); border-radius:2px; transition:border-color .18s, background .18s; }
    .dropzone.dragging { border-color:var(--orange); background:rgba(245,97,26,.06); }
    .file-pick { position:relative; cursor:pointer; }
    .file-pick:focus-within { outline:2px solid var(--orange); outline-offset:2px; }
    .file-input { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; }
    .dropzone [hidden] { display:none !important; }
    .dropzone.has-files { align-items:stretch; text-align:left; }
    .dropzone.has-files .file-pick { align-self:flex-start; }
    .pending { list-style:none; width:100%; border-top:1px solid var(--border); }
    .pending li { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
    .pending .file-badge { width:40px; height:40px; font-size:10px; }
    .pending-main { flex:1; min-width:0; }
    .pending-name { display:flex; align-items:flex-start; gap:6px; }
    .pending-name textarea {
      flex:1; min-width:0; resize:none; overflow:hidden; line-height:1.4; padding:7px 10px; font-size:14px;
      font-family:'Barlow',sans-serif; background:var(--dark); color:var(--white); border:1px solid var(--border); border-radius:2px; outline:none;
    }
    .pending-name textarea:focus { border-color:rgba(255,255,255,.3); }
    .pending-name .ext { padding-top:8px; }
    .pending-meta { margin-top:4px; }
    .pending-meta .bad { color:var(--red); }
    .pending .remove { font-size:20px; line-height:1; padding:6px 4px; }
    .pending-actions { display:flex; justify-content:flex-end; align-items:center; gap:16px; width:100%; }
    .progress { width:100%; max-width:340px; height:6px; background:rgba(255,255,255,.1); display:none; }
    .progress div { height:100%; width:0; background:linear-gradient(90deg,#7a78ee,var(--orange)); transition:width .2s; }
    .file-list { list-style:none; margin-top:18px; border-top:1px solid var(--border); }
    .file { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--border); }
    .file-badge { flex-shrink:0; width:46px; height:46px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); background:var(--dark); color:#9593f1; font-size:10.5px; font-weight:700; letter-spacing:.08em; }
    .file-main { flex:1; min-width:0; }
    .file-name { display:block; font-weight:600; overflow-wrap:anywhere; text-decoration:none; }
    .file-name:hover { text-decoration:underline; }
    .file-actions { display:flex; align-items:center; gap:14px; flex-shrink:0; }
    .file-actions form { display:inline; }
    details.rename summary { list-style:none; cursor:pointer; color:var(--muted); font-size:13px; }
    details.rename summary::-webkit-details-marker { display:none; }
    details.rename summary:hover { color:var(--white); }
    .rename-form { display:flex; align-items:center; gap:8px; margin-top:10px; }
    .rename-form .input { padding:7px 10px; font-size:13px; }
    .ext { color:var(--muted); font-size:13px; }

    @media(max-width:860px) {
      .materials { grid-template-columns:minmax(0,1fr); }
    }
    @media(max-width:700px) {
      .admin-header { padding:16px 20px; }
      .tabs { padding:0 12px; }
      .main { padding:20px; }
      .stats { grid-template-columns:1fr; }
      .panel { padding:20px; }
      .detail-head h2 { font-size:32px; }
      .file { flex-wrap:wrap; }
      .file-actions { width:100%; padding-left:60px; }
      .hide-mobile { display:none; }
    }
  </style>
</head>
<body>

<?php if (!$admin): ?>

  <!-- ── LOGIN ── -->
  <div class="login-wrap">
    <div class="login-card">
      <span class="login-logo"><em>SYN</em>CHRO &mdash; Admin</span>
      <?php if ($loginError): ?><p class="error"><?= h($loginError) ?></p><?php endif; ?>
      <form method="POST">
        <input type="hidden" name="action" value="login">
        <label class="field-label" for="password">Password</label>
        <input class="input" type="password" id="password" name="password" autocomplete="current-password" autofocus required>
        <button type="submit" class="btn">Sign in</button>
      </form>
    </div>
  </div>

<?php else: ?>

  <header class="admin-header">
    <span class="admin-logo"><em>SYN</em>CHRO &mdash; Admin</span>
    <div class="header-actions">
      <form method="POST">
        <?= csrf_field() ?>
        <button type="submit" name="action" value="logout" class="btn btn-outline">Sign out</button>
      </form>
    </div>
  </header>

  <nav class="tabs">
    <a class="tab <?= $tab === 'materials' ? 'active' : '' ?>" href="<?= h(admin_url(['tab' => 'materials'])) ?>">Presentation materials</a>
    <a class="tab <?= $tab === 'rsvp' ? 'active' : '' ?>" href="<?= h(admin_url(['tab' => 'rsvp'])) ?>">RSVP responses</a>
  </nav>

  <main class="main">

    <?php if (!empty($flash['notice'])): ?><div class="flash flash-notice"><?= h($flash['notice']) ?></div><?php endif; ?>
    <?php if (!empty($flash['error'])): ?><div class="flash flash-error"><?= h($flash['error']) ?></div><?php endif; ?>

  <?php if ($tab === 'rsvp'): ?>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-num"><?= $total ?></div>
        <div class="stat-label">Total responses</div>
      </div>
      <div class="stat-card">
        <div class="stat-num green"><?= $attending ?></div>
        <div class="stat-label">Attending</div>
      </div>
      <div class="stat-card">
        <div class="stat-num orange"><?= $notAttending ?></div>
        <div class="stat-label">Unable to attend</div>
      </div>
    </div>

    <div class="rsvp-head">
      <h2 class="section-title">All responses</h2>
      <?php if ($total > 0): ?>
        <a href="<?= h(admin_url(['download' => 1])) ?>" class="btn">Download CSV</a>
      <?php endif; ?>
    </div>

    <div class="table-wrap">
      <?php if (empty($rows)): ?>
        <p class="empty">No responses yet.</p>
      <?php else: ?>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Name</th>
              <th>Title</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Attending</th>
              <th>Dietary</th>
              <th>Contact Sharing</th>
              <th>Dietary Consent</th>
              <th>Marketing Consent</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach (array_reverse($rows) as $row): ?>
            <tr>
              <td style="color:rgba(255,255,255,.45);white-space:nowrap"><?= h($row[0] ?? '') ?></td>
              <td><?= h(($row[1] ?? '') . ' ' . ($row[2] ?? '')) ?></td>
              <td><?= h($row[3] ?? '') ?></td>
              <td><?= h($row[4] ?? '') ?></td>
              <td><?= h($row[5] ?? '') ?></td>
              <td><?= h($row[6] ?? '') ?></td>
              <td>
                <?php $att = $row[7] ?? ''; ?>
                <span class="badge <?= $att === 'Yes' ? 'badge-yes' : 'badge-no' ?>"><?= h($att) ?></span>
              </td>
              <td style="color:rgba(255,255,255,.55)"><?= h(($row[8] ?? '') !== '' ? $row[8] : '—') ?></td>
              <?php foreach ([9, 10, 11] as $col): ?>
                <td>
                  <?php if (($row[$col] ?? '') === 'Yes'): ?>
                    <span class="badge badge-yes">Yes</span>
                  <?php else: ?>
                    <span class="badge badge-no">No</span>
                  <?php endif; ?>
                </td>
              <?php endforeach; ?>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>

  <?php else: ?>

    <div class="materials">

      <aside class="sidebar">
        <form method="POST" class="card new-form">
          <?= csrf_field() ?>
          <input type="hidden" name="action" value="create_presentation">
          <label class="field-label" for="new-title">New presentation</label>
          <input class="input" id="new-title" name="title" maxlength="120" placeholder="e.g. Founders Edition – 15 Oct" required>
          <button type="submit" class="btn" style="justify-content:center">Create presentation</button>
        </form>

        <?php if (!$presentations): ?>
          <p class="muted small" style="padding:4px 2px">No presentations yet.</p>
        <?php endif; ?>
        <?php foreach ($presentations as $p): ?>
          <a class="p-link <?= $selected && $selected['id'] === $p['id'] ? 'active' : '' ?>" href="<?= h(admin_url(['tab' => 'materials', 'p' => $p['id']])) ?>">
            <strong><?= h($p['title']) ?></strong>
            <span class="muted small">
              <?= $p['file_count'] ?> <?= $p['file_count'] === 1 ? 'file' : 'files' ?> ·
              <?= $p['active_codes'] ?> active <?= $p['active_codes'] === 1 ? 'password' : 'passwords' ?>
            </span>
          </a>
        <?php endforeach; ?>
      </aside>

      <?php if (!$selected): ?>
        <div class="card panel muted">
          Create a presentation to upload materials and generate access passwords. Viewers log in at
          <a href="/presentation/" style="color:var(--orange)"><?= h($viewerLink) ?></a>.
        </div>
      <?php else: ?>
        <section class="detail">
          <div class="detail-head">
            <div>
              <p class="eyebrow">Presentation</p>
              <h2><?= h($selected['title']) ?></h2>
            </div>
            <form method="POST" onsubmit="return confirm('Delete this presentation? All its files and passwords will be removed permanently.')">
              <?= csrf_field() ?>
              <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
              <button type="submit" name="action" value="delete_presentation" class="link-btn danger">Delete presentation</button>
            </form>
          </div>

          <!-- Materials -->
          <div class="card panel">
            <div class="panel-head">
              <div>
                <h3 class="card-title">Materials</h3>
                <p class="muted small" style="margin-top:4px">New uploads are hidden from viewers until you publish them.</p>
              </div>
              <?php if ($hiddenCount > 0): ?>
                <form method="POST">
                  <?= csrf_field() ?>
                  <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
                  <button type="submit" name="action" value="publish_all" class="btn btn-small">Publish all (<?= $hiddenCount ?>)</button>
                </form>
              <?php endif; ?>
            </div>

            <form method="POST" enctype="multipart/form-data" id="upload-form" class="dropzone">
              <?= csrf_field() ?>
              <input type="hidden" name="action" value="upload">
              <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
              <p class="muted small" data-hint>Drag files here, or</p>
              <label class="btn btn-outline btn-small file-pick">
                <span data-pick-label>Choose files</span>
                <input type="file" name="files[]" class="file-input" multiple required>
              </label>
              <p class="muted small" data-hint>PDF, Office, Keynote, images, video, audio or ZIP</p>
              <ul class="pending" hidden></ul>
              <div class="progress"><div></div></div>
              <div class="pending-actions">
                <button type="button" class="link-btn" data-clear hidden>Clear</button>
                <button type="submit" class="btn btn-small">Upload</button>
              </div>
            </form>

            <?php if ($files): ?>
              <ul class="file-list">
                <?php foreach ($files as $f):
                    $extension = pathinfo($f['name'], PATHINFO_EXTENSION);
                    $base = $extension === '' ? $f['name'] : substr($f['name'], 0, -strlen($extension) - 1); ?>
                  <li class="file">
                    <span class="file-badge"><?= h(file_extension($f['name'])) ?></span>
                    <div class="file-main">
                      <a class="file-name" href="/api/download.php?id=<?= h($f['id']) ?>" title="<?= h($f['name']) ?>"><?= h($f['name']) ?></a>
                      <span class="muted small">
                        <span class="badge <?= $f['published'] ? 'badge-published' : 'badge-hidden' ?>"><?= $f['published'] ? 'Published' : 'Hidden' ?></span>
                        <?= h(format_bytes($f['size'])) ?><span class="hide-mobile"> · uploaded <?= h(format_time($f['uploaded_at'])) ?></span>
                      </span>
                      <details class="rename">
                        <summary>Rename</summary>
                        <form method="POST" class="rename-form">
                          <?= csrf_field() ?>
                          <input type="hidden" name="action" value="rename_file">
                          <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
                          <input type="hidden" name="file_id" value="<?= h($f['id']) ?>">
                          <input class="input" name="name" value="<?= h($base) ?>" maxlength="190" aria-label="New file name" required>
                          <?php if ($extension !== ''): ?><span class="ext">.<?= h($extension) ?></span><?php endif; ?>
                          <button type="submit" class="btn btn-small">Save</button>
                        </form>
                      </details>
                    </div>
                    <div class="file-actions">
                      <form method="POST">
                        <?= csrf_field() ?>
                        <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
                        <input type="hidden" name="file_id" value="<?= h($f['id']) ?>">
                        <?php if ($f['published']): ?>
                          <button type="submit" name="action" value="unpublish_file" class="btn btn-outline btn-small">Unpublish</button>
                        <?php else: ?>
                          <button type="submit" name="action" value="publish_file" class="btn btn-small">Publish</button>
                        <?php endif; ?>
                      </form>
                      <form method="POST" onsubmit="return confirm('Delete this file? Viewers will no longer be able to download it.')">
                        <?= csrf_field() ?>
                        <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
                        <input type="hidden" name="file_id" value="<?= h($f['id']) ?>">
                        <button type="submit" name="action" value="delete_file" class="link-btn danger">Delete</button>
                      </form>
                    </div>
                  </li>
                <?php endforeach; ?>
              </ul>
            <?php endif; ?>
          </div>

          <!-- Access passwords -->
          <div class="card panel">
            <div class="panel-head">
              <div>
                <h3 class="card-title">Access passwords</h3>
                <p class="muted small" style="margin-top:4px">Viewers log in at <a href="/presentation/" style="color:var(--orange)"><?= h($viewerLink) ?></a></p>
              </div>
            </div>

            <form method="POST" class="code-form">
              <?= csrf_field() ?>
              <input type="hidden" name="action" value="create_code">
              <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
              <span class="field-label" style="display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Valid for</span>
              <div class="chips">
                <?php $first = true; foreach (VALIDITY_PRESETS as $hours => $label): ?>
                  <input type="radio" name="validity" id="v-<?= $hours ?>" value="<?= $hours ?>" <?= $first ? 'checked' : '' ?>>
                  <label class="chip" for="v-<?= $hours ?>"><?= h($label) ?></label>
                <?php $first = false; endforeach; ?>
                <input type="radio" name="validity" id="v-custom" value="custom">
                <label class="chip" for="v-custom">Custom</label>
              </div>
              <div class="custom">
                <input class="input" type="number" name="custom_amount" min="1" max="8760" value="48" aria-label="Amount">
                <select class="input" name="custom_unit" aria-label="Unit" style="width:auto">
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                </select>
              </div>
              <div class="form-row">
                <label class="field-label" for="code-label">Note (optional, only you see this)</label>
                <input class="input" id="code-label" name="label" maxlength="80" placeholder="e.g. Attendees of 15 Oct session">
              </div>
              <div class="form-row">
                <button type="submit" class="btn">Generate password</button>
              </div>
            </form>

            <?php if (!empty($flash['code']) && ($flash['code_for'] ?? '') === $selected['id']): ?>
              <div class="new-code">
                <p class="eyebrow" style="margin:0">New password &mdash; copy it now</p>
                <p class="code" id="new-code"><?= h($flash['code']) ?></p>
                <p class="muted small">Valid until <?= h(format_time((int) $flash['code_expires'])) ?>. You can copy it again later from the list below.</p>
                <div class="actions">
                  <button type="button" class="btn btn-outline btn-small" data-copy="<?= h($flash['code']) ?>">Copy password</button>
                  <button type="button" class="btn btn-outline btn-small"
                    data-copy="<?= h("Presentation materials: $viewerLink\nPassword: {$flash['code']}\nValid until " . format_time((int) $flash['code_expires'])) ?>">Copy link and password</button>
                </div>
              </div>
            <?php endif; ?>

            <?php if ($codes): ?>
              <div class="codes table-wrap" style="border:none">
                <table>
                  <thead>
                    <tr><th>Password</th><th class="hide-mobile">Expires</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    <?php foreach ($codes as $c): $status = code_status($c); ?>
                      <tr>
                        <td>
                          <?php $plain = ($status === 'active' && !empty($c['sealed'])) ? unseal_code($c['sealed']) : null; ?>
                          <span class="mono code-value" <?php if ($plain): ?>data-full="<?= h($plain) ?>"<?php endif; ?>>…<?= h($c['hint']) ?></span>
                          <?php if ($c['label'] !== ''): ?><br><span class="muted small"><?= h($c['label']) ?></span><?php endif; ?>
                          <?php if ($plain): ?>
                            <span class="code-actions">
                              <button type="button" class="link-btn" data-reveal>Show</button>
                              <button type="button" class="link-btn" data-copy="<?= h($plain) ?>">Copy</button>
                              <button type="button" class="link-btn"
                                data-copy="<?= h("Presentation materials: $viewerLink\nPassword: $plain\nValid until " . format_time((int) $c['expires_at'])) ?>">Copy with link</button>
                            </span>
                          <?php elseif ($status === 'active'): ?>
                            <span class="code-actions muted small">Created before copying was possible. Generate a new one to copy it.</span>
                          <?php endif; ?>
                        </td>
                        <td class="hide-mobile" style="white-space:nowrap"><?= h(format_time($c['expires_at'])) ?></td>
                        <td><span class="badge badge-<?= $status ?>"><?= ucfirst($status) ?></span></td>
                        <td style="text-align:right">
                          <?php if ($status === 'active'): ?>
                            <form method="POST" onsubmit="return confirm('Revoke this password? Anyone using it will lose access immediately.')">
                              <?= csrf_field() ?>
                              <input type="hidden" name="presentation_id" value="<?= h($selected['id']) ?>">
                              <input type="hidden" name="code_id" value="<?= h($c['id']) ?>">
                              <button type="submit" name="action" value="revoke_code" class="link-btn danger">Revoke</button>
                            </form>
                          <?php endif; ?>
                        </td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div>
            <?php endif; ?>
          </div>
        </section>
      <?php endif; ?>
    </div>

  <?php endif; ?>

  </main>

  <script>
    // Show / hide a stored access password
    document.querySelectorAll('[data-reveal]').forEach(function (button) {
      var value = button.closest('td').querySelector('.code-value');
      var masked = value.textContent;
      button.addEventListener('click', function () {
        var showing = value.classList.toggle('revealed');
        value.textContent = showing ? value.getAttribute('data-full') : masked;
        button.textContent = showing ? 'Hide' : 'Show';
      });
    });

    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var text = button.getAttribute('data-copy');
        var done = function () {
          var label = button.textContent;
          button.textContent = 'Copied';
          setTimeout(function () { button.textContent = label; }, 2000);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(done);
        } else {
          var area = document.createElement('textarea');
          area.value = text;
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          area.remove();
          done();
        }
      });
    });

    // Upload: pick or drop files, rename them in the list, then confirm.
    var form = document.getElementById('upload-form');
    if (form && window.FormData) {
      form.classList.add('js');
      var input = form.querySelector('.file-input');
      var list = form.querySelector('.pending');
      var actions = form.querySelector('.pending-actions');
      var clearButton = form.querySelector('[data-clear]');
      var submit = form.querySelector('button[type=submit]');
      var pickLabel = form.querySelector('[data-pick-label]');
      var bar = form.querySelector('.progress');
      var allowed = <?= json_encode(ALLOWED_EXTENSIONS) ?>;
      var pending = [];

      var splitName = function (name) {
        var dot = name.lastIndexOf('.');
        return dot > 0 ? { base: name.slice(0, dot), ext: name.slice(dot + 1) } : { base: name, ext: '' };
      };
      var formatBytes = function (bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / 1073741824).toFixed(2) + ' GB';
      };
      // Grow the name box so the whole name is always visible.
      var fit = function (area) {
        area.style.height = 'auto';
        area.style.height = area.scrollHeight + (area.offsetHeight - area.clientHeight) + 'px';
      };
      var el = function (tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
      };

      var render = function () {
        list.innerHTML = '';
        pending.forEach(function (item, index) {
          var row = el('li');
          row.appendChild(el('span', 'file-badge', (item.ext || 'file').slice(0, 4).toUpperCase()));

          var main = el('div', 'pending-main');
          var nameRow = el('div', 'pending-name');
          var area = el('textarea');
          area.rows = 1;
          area.value = item.base;
          area.maxLength = 190;
          area.setAttribute('aria-label', 'File name for ' + item.file.name);
          area.addEventListener('input', function () {
            item.base = area.value.replace(/[\r\n]+/g, ' ');
            fit(area);
          });
          area.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') e.preventDefault();
          });
          nameRow.appendChild(area);
          if (item.ext) nameRow.appendChild(el('span', 'ext', '.' + item.ext));
          main.appendChild(nameRow);

          var meta = el('div', 'pending-meta muted small', formatBytes(item.file.size));
          if (allowed.indexOf(item.ext.toLowerCase()) === -1) {
            meta.appendChild(el('span', 'bad', ' · Not an allowed file type, it will be skipped'));
          }
          main.appendChild(meta);
          row.appendChild(main);

          var remove = el('button', 'link-btn danger remove', '×');
          remove.type = 'button';
          remove.setAttribute('aria-label', 'Remove ' + item.file.name);
          remove.addEventListener('click', function () {
            pending.splice(index, 1);
            render();
          });
          row.appendChild(remove);

          list.appendChild(row);
        });

        var count = pending.length;
        list.hidden = !count;
        actions.hidden = !count;
        clearButton.hidden = !count;
        form.classList.toggle('has-files', count > 0);
        form.querySelectorAll('[data-hint]').forEach(function (hint) { hint.hidden = count > 0; });
        pickLabel.textContent = count ? 'Add more files' : 'Choose files';
        submit.textContent = count === 1 ? 'Upload 1 file' : 'Upload ' + count + ' files';
        input.required = !count;
        // Size the name boxes only once the list is visible, or they measure as 0.
        list.querySelectorAll('textarea').forEach(fit);
      };

      var add = function (files) {
        Array.prototype.forEach.call(files, function (file) {
          var parts = splitName(file.name);
          pending.push({ file: file, base: parts.base, ext: parts.ext });
        });
        input.value = '';
        render();
      };

      input.addEventListener('change', function () { add(input.files); });
      clearButton.addEventListener('click', function () { pending = []; render(); });
      ['dragenter', 'dragover'].forEach(function (type) {
        form.addEventListener(type, function (e) { e.preventDefault(); form.classList.add('dragging'); });
      });
      ['dragleave', 'drop'].forEach(function (type) {
        form.addEventListener(type, function () { form.classList.remove('dragging'); });
      });
      form.addEventListener('drop', function (e) {
        e.preventDefault();
        add(e.dataTransfer.files);
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!pending.length) return;
        var data = new FormData();
        form.querySelectorAll('input[type=hidden]').forEach(function (field) { data.append(field.name, field.value); });
        pending.forEach(function (item) {
          data.append('files[]', item.file);
          data.append('names[]', item.base.trim() || splitName(item.file.name).base);
        });

        var xhr = new XMLHttpRequest();
        // form.action would return the hidden <input name="action">, so read the attribute.
        xhr.open('POST', form.getAttribute('action') || window.location.href);
        xhr.setRequestHeader('X-Requested-With', 'synchro');
        bar.style.display = 'block';
        submit.disabled = true;
        submit.textContent = 'Uploading…';
        xhr.upload.onprogress = function (ev) {
          if (ev.lengthComputable) bar.firstElementChild.style.width = (ev.loaded / ev.total * 100) + '%';
        };
        xhr.onloadend = function () {
          if (xhr.status === 413) {
            try { alert(JSON.parse(xhr.responseText).error); } catch (err) { alert('The upload is too large.'); }
          }
          window.location.reload();
        };
        xhr.send(data);
      });

      render();
    }
  </script>

<?php endif; ?>
</body>
</html>
