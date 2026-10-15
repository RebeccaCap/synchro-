// Serves build/ with PHP so admin.php and /presentation work locally.
// Usage: npm run serve   (or npm run preview to build first)
//
// Uses the portable PHP in .tools/php if present (npm run get-php), otherwise
// whatever `php` is on the PATH.
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const HOST = "127.0.0.1";
const PORT = process.env.PORT || 8765;

const portable = path.join(root, ".tools", "php", process.platform === "win32" ? "php.exe" : "php");
const php = fs.existsSync(portable) ? portable : "php";

if (!fs.existsSync(path.join(root, "build", "index.html"))) {
  console.error("No build found. Run `npm run preview` (builds, then serves) instead.");
  process.exit(1);
}

// The backend looks for synchro-private/ next to the web root, i.e. in the project folder.
const privateConfig = path.join(root, "synchro-private", "config.php");
const serverConfig = path.join(root, "server", "config.php");
if (!fs.existsSync(privateConfig)) {
  if (!fs.existsSync(serverConfig)) {
    console.error("No admin config yet. Run `npm run setup-admin` first.");
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(privateConfig), { recursive: true });
  fs.copyFileSync(serverConfig, privateConfig);
  console.log("Copied server/config.php to synchro-private/config.php");
}

const args = [
  // Portable PHP has no php.ini, so its default upload limit is only 2 MB.
  "-d", "upload_max_filesize=512M",
  "-d", "post_max_size=520M",
  "-d", "memory_limit=256M",
  "-S", `${HOST}:${PORT}`,
  "-t", path.join(root, "build"),
];

const server = spawn(php, args, { stdio: ["ignore", "ignore", "pipe"] });

server.on("error", (err) => {
  if (err.code === "ENOENT") {
    console.error("PHP not found. Run `npm run get-php` to download a portable copy into .tools/.");
  } else {
    console.error(err.message);
  }
  process.exit(1);
});

let started = false;
server.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  if (!started && /Development Server .* started/.test(text)) {
    started = true;
    console.log(`
  SynCHRO is running locally:

    Site           http://${HOST}:${PORT}/
    Admin          http://${HOST}:${PORT}/admin
    Presentation   http://${HOST}:${PORT}/presentation/

  Press Ctrl+C to stop.
`);
  } else if (/Failed to listen|Address already in use/i.test(text)) {
    console.error(`Port ${PORT} is already in use. Stop the other server, or run with another port, e.g. PORT=8766.`);
    process.exit(1);
  } else if (/(Fatal error|Warning|Parse error)/.test(text)) {
    process.stderr.write(text);
  }
});

server.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => server.kill());
