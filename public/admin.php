<?php
// The admin page moved to /admin/. Keep old links and bookmarks working.
$query = $_SERVER['QUERY_STRING'] ?? '';
header('Location: /admin/' . ($query !== '' ? '?' . $query : ''), true, 301);
exit;
