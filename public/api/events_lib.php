<?php
// Event definitions and the rules for them. Used by events.php (public list)
// and register.php (validation).
//
// Events live in synchro-private/data/events.json on the server. That file is
// NOT part of the repository, so unannounced event details never reach git.
// See server/events.sample.json for the shape.

require_once __DIR__ . '/bootstrap.php';

// Keys that may be sent to the browser. Anything else in events.json stays private.
const PUBLIC_EVENT_KEYS = [
    'id', 'name', 'dateLabel', 'location', 'startDate', 'endDate', 'opensAt', 'closesAt',
    'attendanceQuestion', 'attendYesLabel', 'attendNoLabel', 'successMessage', 'declinedMessage',
    'extraFields', 'calendar',
];

function load_events(): array
{
    $events = [];
    foreach (store_read('events') as $event) {
        if (is_array($event) && is_string($event['id'] ?? null) && ($event['published'] ?? false) === true) {
            $events[] = $event;
        }
    }
    return $events;
}

function find_event($id): ?array
{
    foreach (load_events() as $event) {
        if ($event['id'] === $id) {
            return $event;
        }
    }
    return null;
}

function public_event(array $event): array
{
    return array_intersect_key($event, array_flip(PUBLIC_EVENT_KEYS));
}

// Open from opensAt (inclusive) until closesAt (exclusive). Missing bounds are open-ended.
function registration_open(array $event, ?int $now = null): bool
{
    $now = $now ?? time();
    $opens = isset($event['opensAt']) ? strtotime((string) $event['opensAt']) : false;
    $closes = isset($event['closesAt']) ? strtotime((string) $event['closesAt']) : false;
    if ($opens !== false && $now < $opens) {
        return false;
    }
    if ($closes !== false && $now >= $closes) {
        return false;
    }
    return true;
}
