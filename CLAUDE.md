# SynCHRO conventions

## UI strings are constants

User-visible text lives in named constants at the top of the component file
(`const HEADING = "…";`) and is interpolated into the JSX (`{HEADING}`), not
written inline. Whenever you edit existing inline text in a file, move it into
a constant as part of that change. Short single-use UI labels such as a
"Close" button may stay inline.

## Every section has a nav item

Each page section gets an entry in `NAV_ITEMS` in `src/components/Header.jsx`
(label plus the section's `id`), in page order.

## UK English

All user-visible text uses UK English: organisation, prioritised, programme,
defence, centre, behaviour. Code identifiers and HTML/CSS attributes that
follow web standards stay as they are (`autoComplete="organization"`,
`text-center`, `color`). Proper nouns keep their official spelling.
