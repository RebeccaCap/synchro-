<?php
// Shared helpers for the admin page (admin/index.php) and the viewer/download endpoints.
//
// Configuration and uploaded files live in a folder called "synchro-private".
// It's used next to public_html if it exists there, otherwise inside
// public_html, where an .htaccess file blocks all web access (see README).

declare(strict_types=1);

// The admin page (admin/index.php) defines SYNCHRO_HTML before including this file.
header(defined('SYNCHRO_HTML') ? 'Content-Type: text/html; charset=utf-8' : 'Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

const ADMIN_COOKIE = 'synchro_admin';
const VIEWER_COOKIE = 'synchro_viewer';
const FLASH_COOKIE = 'synchro_flash';
const ADMIN_COOKIE_PATH = '/';
const VIEWER_COOKIE_PATH = '/api/';
const ADMIN_SESSION_SECONDS = 8 * 3600;
const RATE_WINDOW_SECONDS = 900;
const RATE_MAX_FAILURES = 10;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_CODE_HOURS = 24 * 365;
const ALLOWED_EXTENSIONS = [
    'pdf', 'ppt', 'pptx', 'key', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt',
    'zip', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'mp3', 'm4a',
];

// ---------------------------------------------------------------------------
// Responses and requests

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function fail(int $status, string $message): void
{
    if (defined('SYNCHRO_HTML')) {
        http_response_code($status);
        echo '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            . '<title>SynCHRO Admin</title><body style="font-family:Arial,sans-serif;background:#0b0c11;color:#fff;padding:48px">'
            . '<p>' . htmlspecialchars($message) . '</p><p><a style="color:#F5611A" href="/admin/">Back to admin</a></p>';
        exit;
    }
    respond(['error' => $message], $status);
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        fail(405, 'Method not allowed.');
    }
}

// Every state-changing request must carry this header. Browsers will not let
// another site send a custom header without a CORS preflight, which we never
// approve, so this (together with SameSite cookies) blocks CSRF.
function require_ajax(): void
{
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'synchro') {
        fail(403, 'Forbidden.');
    }
}

function json_body(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '[]', true);
    return is_array($data) ? $data : [];
}

function clean_text($value, int $maxLength): string
{
    $text = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) $value) ?? '');
    return function_exists('mb_substr') ? mb_substr($text, 0, $maxLength) : substr($text, 0, $maxLength);
}

function valid_id($id): bool
{
    return is_string($id) && preg_match('/^[a-f0-9]{16}$/', $id) === 1;
}

function new_id(): string
{
    return bin2hex(random_bytes(8));
}

// ---------------------------------------------------------------------------
// Configuration and storage

const DENY_ALL_HTACCESS = "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n"
    . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n";

function private_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }

    $override = getenv('SYNCHRO_PRIVATE_DIR');
    if ($override) {
        return $dir = rtrim($override, '/\\');
    }

    // The website folder (public_html); api/ sits directly inside it.
    $webRoot = dirname(__DIR__);

    // Preferred: outside the website, next to public_html.
    $outside = dirname($webRoot) . '/synchro-private';
    if (is_file($outside . '/config.php')) {
        return $dir = $outside;
    }

    // Hosting that only allows public_html: keep it inside, locked by .htaccess.
    $dir = $webRoot . '/synchro-private';
    if (is_dir($dir) && !is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', DENY_ALL_HTACCESS);
    }
    return $dir;
}

function config(): array
{
    static $config = null;
    if ($config === null) {
        $file = private_dir() . '/config.php';
        if (!is_file($file)) {
            fail(500, 'The server is not configured yet.');
        }
        $config = require $file;
        if (!is_array($config) || empty($config['admin_password_hash']) || strlen($config['secret'] ?? '') < 32) {
            fail(500, 'The server configuration is incomplete.');
        }
    }
    return $config;
}

function data_dir(string $sub = ''): string
{
    $base = private_dir() . '/data';
    $dir = $sub === '' ? $base : $base . '/' . $sub;
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        fail(500, 'Storage is not writable.');
    }
    // Belt and braces: block web access to the data folder itself as well.
    if (!is_file($base . '/.htaccess')) {
        @file_put_contents($base . '/.htaccess', DENY_ALL_HTACCESS);
    }
    return $dir;
}

function store_path(string $name): string
{
    return data_dir() . '/' . $name . '.json';
}

function store_read(string $name): array
{
    $path = store_path($name);
    if (!is_file($path)) {
        return [];
    }
    $handle = fopen($path, 'rb');
    if (!$handle) {
        fail(500, 'Storage is not readable.');
    }
    flock($handle, LOCK_SH);
    $raw = stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

// Runs $change(array &$data) while holding an exclusive lock, then saves.
function store_update(string $name, callable $change)
{
    $handle = fopen(store_path($name), 'c+b');
    if (!$handle) {
        fail(500, 'Storage is not writable.');
    }
    flock($handle, LOCK_EX);
    $data = json_decode(stream_get_contents($handle) ?: '[]', true);
    if (!is_array($data)) {
        $data = [];
    }
    $result = $change($data);
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $result;
}

// ---------------------------------------------------------------------------
// Signed cookies

function b64url_encode(string $bytes): string
{
    return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
}

function b64url_decode(string $text)
{
    return base64_decode(strtr($text, '-_', '+/'), true);
}

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'
        || (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
}

function set_cookie(string $name, string $value, int $expires, string $path): void
{
    setcookie($name, $value, [
        'expires' => $expires,
        'path' => $path,
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

function issue_token(string $cookie, array $payload, string $path): void
{
    $body = b64url_encode(json_encode($payload));
    $signature = b64url_encode(hash_hmac('sha256', $cookie . '.' . $body, config()['secret'], true));
    set_cookie($cookie, $body . '.' . $signature, (int) $payload['exp'], $path);
}

function read_token(string $cookie): ?array
{
    $parts = explode('.', (string) ($_COOKIE[$cookie] ?? ''));
    if (count($parts) !== 2) {
        return null;
    }
    $expected = b64url_encode(hash_hmac('sha256', $cookie . '.' . $parts[0], config()['secret'], true));
    if (!hash_equals($expected, $parts[1])) {
        return null;
    }
    $payload = json_decode((string) b64url_decode($parts[0]), true);
    if (!is_array($payload) || (int) ($payload['exp'] ?? 0) <= time()) {
        return null;
    }
    return $payload;
}

function clear_token(string $cookie, string $path): void
{
    set_cookie($cookie, '', time() - 3600, $path);
}

// ---------------------------------------------------------------------------
// Login throttling (per IP address)

function attempt_key(string $scope): string
{
    return $scope . ':' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
}

function guard_attempts(string $scope): void
{
    $now = time();
    $failures = store_read('attempts')[attempt_key($scope)] ?? [];
    $recent = array_filter($failures, function ($t) use ($now) {
        return $t > $now - RATE_WINDOW_SECONDS;
    });
    if (count($recent) >= RATE_MAX_FAILURES) {
        fail(429, 'Too many attempts. Please wait 15 minutes and try again.');
    }
}

function record_failed_attempt(string $scope): void
{
    store_update('attempts', function (array &$attempts) use ($scope) {
        $cutoff = time() - RATE_WINDOW_SECONDS;
        foreach ($attempts as $key => $times) {
            $attempts[$key] = array_values(array_filter($times, function ($t) use ($cutoff) {
                return $t > $cutoff;
            }));
            if (!$attempts[$key]) {
                unset($attempts[$key]);
            }
        }
        $attempts[attempt_key($scope)][] = time();
    });
}

// ---------------------------------------------------------------------------
// Admin

function verify_admin_password(string $password): bool
{
    $stored = (string) config()['admin_password_hash'];

    // Hashes made by `npm run setup-admin`: pbkdf2$sha256$<iterations>$<salt hex>$<hash hex>
    $parts = explode('$', $stored);
    if (count($parts) === 5 && $parts[0] === 'pbkdf2' && $parts[1] === 'sha256') {
        $expected = hex2bin($parts[4]);
        $actual = hash_pbkdf2('sha256', $password, (string) hex2bin($parts[3]), (int) $parts[2], strlen((string) $expected), true);
        return $expected !== false && hash_equals($expected, $actual);
    }

    // Also accept hashes made with PHP's password_hash().
    return password_verify($password, $stored);
}

function is_admin(): bool
{
    $token = read_token(ADMIN_COOKIE);
    return $token !== null && ($token['typ'] ?? '') === 'admin';
}

// ---------------------------------------------------------------------------
// Access codes and viewers

function generate_code(): string
{
    $code = '';
    for ($i = 0; $i < 12; $i++) {
        $code .= CODE_ALPHABET[random_int(0, strlen(CODE_ALPHABET) - 1)];
    }
    return implode('-', str_split($code, 4));
}

function normalize_code(string $code): string
{
    return preg_replace('/[^A-Z0-9]/', '', strtoupper($code)) ?? '';
}

function code_hash(string $code): string
{
    return hash_hmac('sha256', normalize_code($code), config()['secret']);
}

// Access codes are also stored encrypted, so the admin can copy them again
// later. Encrypt-then-MAC with HMAC-SHA256 as the keystream (codes are far
// shorter than one 32-byte block), using keys derived from the config secret.
// Only core hash functions are used, so no PHP extensions are needed.
function code_keys(): array
{
    $secret = config()['secret'];
    return [hash_hmac('sha256', 'code-encryption', $secret, true), hash_hmac('sha256', 'code-authentication', $secret, true)];
}

function seal_code(string $plain): string
{
    [$encryptionKey, $macKey] = code_keys();
    $nonce = random_bytes(16);
    $cipher = $plain ^ substr(hash_hmac('sha256', $nonce, $encryptionKey, true), 0, strlen($plain));
    $tag = hash_hmac('sha256', $nonce . $cipher, $macKey, true);
    return b64url_encode($nonce . $cipher . $tag);
}

function unseal_code(string $sealed): ?string
{
    [$encryptionKey, $macKey] = code_keys();
    $raw = b64url_decode($sealed);
    if ($raw === false || strlen($raw) < 16 + 1 + 32 || strlen($raw) > 16 + 32 + 32) {
        return null;
    }
    $nonce = substr($raw, 0, 16);
    $cipher = substr($raw, 16, -32);
    if (!hash_equals(hash_hmac('sha256', $nonce . $cipher, $macKey, true), substr($raw, -32))) {
        return null;
    }
    return $cipher ^ substr(hash_hmac('sha256', $nonce, $encryptionKey, true), 0, strlen($cipher));
}

function code_status(array $code): string
{
    if (!empty($code['revoked'])) {
        return 'revoked';
    }
    return $code['expires_at'] <= time() ? 'expired' : 'active';
}

// Returns ['code' => ..., 'presentation' => ...] for a logged-in viewer whose
// code is still valid, or null. Checked on every request, so revoking or
// expiring a code takes effect immediately.
function current_viewer(): ?array
{
    $token = read_token(VIEWER_COOKIE);
    if ($token === null || ($token['typ'] ?? '') !== 'viewer') {
        return null;
    }
    $code = store_read('codes')[$token['cid'] ?? ''] ?? null;
    if (!$code || code_status($code) !== 'active') {
        return null;
    }
    $presentation = store_read('presentations')[$code['presentation_id']] ?? null;
    if (!$presentation) {
        return null;
    }
    return ['code' => $code, 'presentation' => $presentation];
}

// ---------------------------------------------------------------------------
// Files

// Files uploaded before the publish step existed have no flag; treat them as published.
function is_published(array $file): bool
{
    return (bool) ($file['published'] ?? true);
}

function files_for(string $presentationId, bool $publishedOnly): array
{
    $files = array_values(array_filter(store_read('files'), function ($file) use ($presentationId, $publishedOnly) {
        return $file['presentation_id'] === $presentationId && (!$publishedOnly || is_published($file));
    }));
    usort($files, function ($a, $b) {
        return $a['uploaded_at'] <=> $b['uploaded_at'];
    });
    return array_map(function ($file) {
        return [
            'id' => $file['id'],
            'name' => $file['name'],
            'size' => $file['size'],
            'uploaded_at' => $file['uploaded_at'],
            'published' => is_published($file),
        ];
    }, $files);
}

// Renames a file but always keeps its original extension, so downloads open correctly.
function renamed_file_name(string $currentName, $requested): string
{
    $extension = pathinfo($currentName, PATHINFO_EXTENSION);
    $base = clean_text(basename(str_replace('\\', '/', (string) $requested)), 190);
    if ($extension !== '' && strcasecmp(pathinfo($base, PATHINFO_EXTENSION), $extension) === 0) {
        $base = pathinfo($base, PATHINFO_FILENAME);
    }
    $base = rtrim($base, ' .');
    if ($base === '') {
        return '';
    }
    return $extension === '' ? $base : $base . '.' . $extension;
}

function stored_file_path(string $id): string
{
    return data_dir('files') . '/' . $id;
}
