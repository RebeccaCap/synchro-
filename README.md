# SynCHRO

Website for the SynCHRO CHRO forum (synchroforum.eu). React (Create React App) +
Tailwind, with a small PHP backend for presentation materials. Hosted on Hostinger.

## Pages

| URL               | What it is                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| `/`               | Public landing page                                                        |
| `/admin`          | Admin: presentation materials (upload, rename, publish, access passwords) and RSVP responses. `/admin.php` redirects here. |
| `/presentation/`  | Viewers enter an access password and download that presentation's files    |

New uploads are hidden from viewers until the admin publishes them, so they can
be renamed first. Renaming keeps the file type (`.pdf` stays `.pdf`).

Access passwords look like `ZMEL-82B7-CN92`. The admin chooses how long each one
is valid (24 h, 72 h, 7 days, 30 days or a custom number of hours/days, up to a
year) and can revoke one early. Expired or revoked passwords stop working
immediately, including for viewers who are already logged in.

## Development

```
npm install
npm start          # http://localhost:3000
npm test
npm run build      # production build in build/
```

`npm start` doesn't run PHP, so `/admin` and `/presentation` only work locally
through PHP. No installation is needed:

```
npm run get-php       # once: downloads portable PHP into .tools/ (Windows)
npm run setup-admin   # once: creates server/config.php with the admin password
npm run preview       # builds, then serves http://127.0.0.1:8765
```

`npm run serve` serves the existing build without rebuilding. If PHP is already
installed and on your PATH, `get-php` isn't needed.

Local uploads and passwords are stored in `synchro-private/` (git-ignored).

## Deploying to Hostinger

1. `npm run build`
2. Upload **everything inside `build/`** to `public_html/`, keeping the folder
   structure (including the `synchro-private/` folder and its `.htaccess`). That includes `admin.php`, `admin/`, `static/`, `api/` and `presentation/`.
   `index.html` and `static/` must always be uploaded together, or the site
   shows a blank page.

## One-time server setup for the admin page

The backend keeps its settings and uploaded files in a folder called
`synchro-private`. On Hostinger it lives inside `public_html`, and the
`.htaccess` file that comes with the build blocks all web access to it:

```
public_html/
├── index.html, static/, admin/, api/, presentation/ …   ← contents of build/
└── synchro-private/
    ├── .htaccess     ← included in the build (blocks web access)
    ├── config.php    ← upload this once
    └── data/         ← created automatically (uploads, passwords)
```

1. On your computer run `npm run setup-admin` and choose the admin password
   (at least 12 characters). It writes `server/config.php`, which contains only
   a hash of the password plus a random secret. The file is git-ignored.
2. Deploy as above, which creates `public_html/synchro-private/` with its
   `.htaccess`.
3. In Hostinger's File Manager, upload `server/config.php` into
   `public_html/synchro-private/`.
4. Go to `https://synchroforum.eu/admin` and log in.
5. Check that the folder is locked: opening
   `https://synchroforum.eu/synchro-private/data/files.json` must show
   **403 Forbidden**.

If your hosting lets you create folders next to `public_html`, you can put
`synchro-private` (with `config.php`) there instead; it's used automatically
when it exists.

Until `config.php` is uploaded, the admin page shows "The server is not
configured yet" instead of the login form. Never delete `synchro-private/`
when redeploying: it holds the uploaded materials and passwords.

To change the admin password, repeat steps 1–2. A new config also has a new
secret, which logs everyone out and invalidates all existing access passwords.

### Upload size

The largest upload is limited by PHP. Raise `upload_max_filesize` and
`post_max_size` in hPanel → Advanced → PHP Configuration if needed, and
`max_upload_mb` in `config.php` (default 512 MB).

### Security notes

- The admin password is stored as a salted hash. Access passwords are stored as
  a keyed hash (for logging in) and encrypted with the secret in `config.php`,
  so the admin can show and copy them again from the admin page.
- Logins are throttled to 10 failed attempts per 15 minutes per IP address.
- Login cookies are HttpOnly, Secure and SameSite=Strict.
- Allowed upload types: PDF, Office, Keynote, CSV/TXT, ZIP, images, MP4/MOV,
  MP3/M4A. Files are always sent as downloads, never shown inline.
