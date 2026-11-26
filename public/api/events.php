<?php
// Public list of announced events for the website.

require __DIR__ . '/events_lib.php';

require_method('GET');
header('Cache-Control: no-store');
respond(['events' => array_map('public_event', load_events())]);
