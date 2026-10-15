// Downloads a portable copy of PHP into .tools/php for local testing.
// Nothing is installed system-wide. Windows only (on macOS/Linux, install PHP
// with your package manager instead).
// Usage: npm run get-php
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const RELEASES = "https://downloads.php.net/~windows/releases/";
const target = path.join(__dirname, "..", ".tools", "php");
const system32 = path.join(process.env.SystemRoot || "C:\\Windows", "System32");

// Uses Windows' built-in curl rather than Node's fetch, because curl follows
// the system's proxy and certificate settings on locked-down machines.
function curl(args) {
  return execFileSync(path.join(system32, "curl.exe"), ["-sSfL", "--retry", "3", ...args], {
    maxBuffer: 64 * 1024 * 1024,
  });
}

try {
  if (process.platform !== "win32") {
    throw new Error("This script is for Windows. On macOS/Linux, install PHP with your package manager.");
  }
  if (fs.existsSync(path.join(target, "php.exe"))) {
    console.log("Portable PHP is already in .tools/php.");
    process.exit(0);
  }

  console.log("Looking up the latest PHP 8.4 release…");
  const listing = curl([RELEASES]).toString();
  const files = [...new Set(listing.match(/php-8\.4\.\d+-nts-Win32-vs17-x64\.zip/g) || [])];
  const latest = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
  if (!latest) {
    throw new Error(`Couldn't find a PHP 8.4 download at ${RELEASES}`);
  }

  console.log(`Downloading ${latest}…`);
  const zip = path.join(os.tmpdir(), latest);
  curl(["-o", zip, RELEASES + latest]);

  fs.mkdirSync(target, { recursive: true });
  // Windows' built-in tar can extract zip files.
  execFileSync(path.join(system32, "tar.exe"), ["-xf", zip, "-C", target]);
  fs.unlinkSync(zip);

  console.log("Done. PHP is in .tools/php. Run `npm run preview` to start the site.");
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
