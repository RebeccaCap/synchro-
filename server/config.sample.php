<?php
// Copy of the server configuration, for reference only.
//
// Generate the real file with `npm run setup-admin`, which writes
// server/config.php (git-ignored). Upload it to:
//
//   public_html/synchro-private/config.php
//
// The .htaccess shipped in that folder blocks web access to it.

return [
    // Created by `npm run setup-admin`. Never store the plain password here.
    'admin_password_hash' => 'pbkdf2$sha256$210000$<salt hex>$<hash hex>',

    // Random 64-character hex string used to sign login cookies and hash
    // access codes. Changing it logs everyone out and invalidates all codes.
    'secret' => '<64 hex characters>',

    // Largest single file the admin may upload, in MB. PHP's own
    // upload_max_filesize / post_max_size limits also apply.
    'max_upload_mb' => 512,
];
