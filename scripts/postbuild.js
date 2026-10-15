// The site is a single-page app, so /presentation/ needs its own copy of
// index.html to work on plain static hosting.
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
const index = fs.readFileSync(path.join(build, "index.html"));

for (const route of ["presentation"]) {
  fs.mkdirSync(path.join(build, route), { recursive: true });
  fs.writeFileSync(path.join(build, route, "index.html"), index);
}
