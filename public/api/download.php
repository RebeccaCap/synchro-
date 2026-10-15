<?php
// Streams an uploaded file to an admin, or to a viewer whose access code is
// valid for the file's presentation.

require __DIR__ . '/bootstrap.php';

require_method('GET');

$id = $_GET['id'] ?? '';
$file = valid_id($id) ? (store_read('files')[$id] ?? null) : null;

$allowed = false;
if ($file) {
    if (is_admin()) {
        $allowed = true;
    } else {
        $viewer = current_viewer();
        $allowed = $viewer
            && $viewer['presentation']['id'] === $file['presentation_id']
            && is_published($file);
    }
}

$path = $file ? stored_file_path($file['id']) : '';
if (!$allowed || !is_file($path)) {
    // This is opened as a normal link, so send people back to the login page
    // rather than showing a JSON error.
    header('Location: /presentation/?expired=1', true, 302);
    exit;
}

$asciiName = preg_replace('/[^A-Za-z0-9._ -]/', '_', $file['name']);

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $asciiName . '"; filename*=UTF-8\'\'' . rawurlencode($file['name']));
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, no-store');

while (ob_get_level() > 0) {
    ob_end_clean();
}
readfile($path);
