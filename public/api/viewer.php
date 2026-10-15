<?php
// Viewer API: log in with an access code and list the presentation's files.

require __DIR__ . '/bootstrap.php';

function viewer_payload(array $viewer): array
{
    return [
        'authenticated' => true,
        'presentation' => ['title' => $viewer['presentation']['title']],
        'expires_at' => $viewer['code']['expires_at'],
        'files' => files_for($viewer['presentation']['id'], true),
    ];
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'session':
        require_method('GET');
        $viewer = current_viewer();
        if (!$viewer) {
            if (isset($_COOKIE[VIEWER_COOKIE])) {
                clear_token(VIEWER_COOKIE, VIEWER_COOKIE_PATH);
            }
            respond(['authenticated' => false]);
        }
        respond(viewer_payload($viewer));

    case 'login':
        require_method('POST');
        require_ajax();
        guard_attempts('viewer');

        $hash = code_hash((string) (json_body()['code'] ?? ''));
        $match = null;
        foreach (store_read('codes') as $code) {
            if (hash_equals($code['hash'], $hash)) {
                $match = $code;
                break;
            }
        }
        if (!$match) {
            record_failed_attempt('viewer');
            fail(401, 'That password is not valid.');
        }
        if (code_status($match) !== 'active') {
            fail(401, 'That password has expired.');
        }
        $presentation = store_read('presentations')[$match['presentation_id']] ?? null;
        if (!$presentation) {
            fail(401, 'That password has expired.');
        }

        issue_token(VIEWER_COOKIE, ['typ' => 'viewer', 'cid' => $match['id'], 'exp' => $match['expires_at']], VIEWER_COOKIE_PATH);
        respond(viewer_payload(['code' => $match, 'presentation' => $presentation]));

    case 'logout':
        require_method('POST');
        require_ajax();
        clear_token(VIEWER_COOKIE, VIEWER_COOKIE_PATH);
        respond(['authenticated' => false]);

    default:
        fail(404, 'Unknown action.');
}
