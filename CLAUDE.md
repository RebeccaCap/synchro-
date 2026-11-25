# SynCHRO conventions

## UI strings are constants

User-visible text lives in named constants at the top of the component file
(`const HEADING = "…";`) and is interpolated into the JSX (`{HEADING}`), not
written inline. Whenever you edit existing inline text in a file, move it into
a constant as part of that change. Short single-use UI labels such as a
"Close" button may stay inline.
