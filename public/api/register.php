<?php
// Event registration. Validates against the event's definition (events.json),
// then stores one record per email address per event (a repeat submission
// updates the earlier one).

require __DIR__ . '/events_lib.php';

const STANDARD_TEXT_FIELDS = ['first_name' => 100, 'last_name' => 100, 'organisation' => 150];

require_method('POST');
require_ajax();
guard_attempts('register');
// Count every submission against the per-IP limit, not just failures.
record_failed_attempt('register');

$body = json_body();

// Honeypot: real visitors never fill this in. Pretend it worked.
if (clean_text($body['website'] ?? '', 200) !== '') {
    respond(['success' => true]);
}

$event = find_event($body['event_id'] ?? null);
if (!$event) {
    fail(404, 'This event is not available.');
}
if (!registration_open($event)) {
    fail(403, 'Registration is not open for this event.');
}

$values = [];
foreach (STANDARD_TEXT_FIELDS as $name => $max) {
    $values[$name] = clean_text($body[$name] ?? '', $max);
    if ($values[$name] === '') {
        fail(422, 'Please complete all required fields.');
    }
}

$email = strtolower(clean_text($body['email'] ?? '', 254));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Please enter a valid email address.');
}
$values['email'] = $email;

$attendance = $body['attendance'] ?? '';
if (!in_array($attendance, ['yes', 'no'], true)) {
    fail(422, 'Please tell us whether you will attend.');
}
$values['attendance'] = $attendance;

if (($body['privacy_policy'] ?? '') !== 'yes') {
    fail(422, 'Please confirm that you have read the privacy notice.');
}

// Event-specific fields: only those the event defines are accepted.
$standardNames = array_merge(array_keys(STANDARD_TEXT_FIELDS), ['email', 'attendance', 'privacy_policy']);
$extra = [];
foreach (($event['extraFields'] ?? []) as $field) {
    $name = $field['name'] ?? '';
    if (!is_string($name) || $name === '' || in_array($name, $standardNames, true)) {
        continue;
    }
    $type = $field['type'] ?? 'text';
    $default = $type === 'textarea' ? 1000 : 300;
    $max = is_int($field['maxLength'] ?? null) ? min($field['maxLength'], 2000) : $default;
    $value = clean_text($body[$name] ?? '', $max);

    if ($type === 'checkbox') {
        $value = ($body[$name] ?? '') === 'yes' ? 'yes' : '';
    } elseif ($type === 'select' || $type === 'radio') {
        $allowed = array_column($field['options'] ?? [], 'value');
        if ($value !== '' && !in_array($value, $allowed, true)) {
            fail(422, 'Please choose a valid option.');
        }
    }
    if (($field['required'] ?? false) === true && $value === '') {
        fail(422, 'Please complete all required fields.');
    }
    $extra[$name] = $value;
}

$now = gmdate('c');
$updated = store_update('registrations', function (array &$records) use ($event, $values, $extra, $now) {
    foreach ($records as $i => $record) {
        if (($record['event_id'] ?? '') === $event['id'] && ($record['email'] ?? '') === $values['email']) {
            $records[$i] = array_merge($record, $values, [
                'extra' => $extra,
                'privacy_accepted_at' => $now,
                'updated_at' => $now,
            ]);
            return true;
        }
    }
    $records[] = array_merge(['id' => new_id(), 'event_id' => $event['id']], $values, [
        'extra' => $extra,
        'privacy_accepted_at' => $now,
        'created_at' => $now,
        'updated_at' => $now,
    ]);
    return false;
});

respond(['success' => true, 'updated' => $updated]);
