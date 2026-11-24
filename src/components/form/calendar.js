// Builds calendar links and an .ics file from an event. All client side:
// nothing about the registrant is sent anywhere.
//
// By default the entry is all-day, covering startDate..endDate. If
// event.calendar.start / .end are ISO date-times (with offset) it is timed.

const pad = (n) => String(n).padStart(2, "0");

function ymd(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function ymdhmsZ(d) {
  return `${ymd(d)}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function dashed(compact) {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

/** Normalised calendar entry for an event. */
export function calendarEntry(event) {
  const cfg = event.calendar || {};
  const base = {
    title: cfg.title || event.name,
    description: cfg.description || "",
    location: cfg.location || event.location || "",
  };

  if (cfg.start && cfg.end) {
    return { ...base, allDay: false, start: new Date(cfg.start), end: new Date(cfg.end) };
  }

  const first = (event.startDate || "").slice(0, 10);
  const last = (event.endDate || event.startDate || "").slice(0, 10);
  const [y, m, d] = last.split("-").map(Number);
  const endExclusive = new Date(Date.UTC(y, m - 1, d + 1)); // all-day DTEND is exclusive
  const [fy, fm, fd] = first.split("-").map(Number);
  return { ...base, allDay: true, start: new Date(Date.UTC(fy, fm - 1, fd)), end: endExclusive };
}

function range(entry) {
  return entry.allDay
    ? [ymd(entry.start), ymd(entry.end)]
    : [ymdhmsZ(entry.start), ymdhmsZ(entry.end)];
}

export function googleCalendarUrl(event) {
  const entry = calendarEntry(event);
  const [start, end] = range(entry);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.title,
    dates: `${start}/${end}`,
    details: entry.description,
    location: entry.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(event) {
  const entry = calendarEntry(event);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: entry.title,
    body: entry.description,
    location: entry.location,
    allday: String(entry.allDay),
    startdt: entry.allDay ? dashed(ymd(entry.start)) : entry.start.toISOString(),
    enddt: entry.allDay ? dashed(ymd(entry.end)) : entry.end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

const escapeText = (s) =>
  String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** iCalendar (RFC 5545) text for the event, with CRLF line endings. */
export function buildIcs(event, now = new Date()) {
  const entry = calendarEntry(event);
  const [start, end] = range(entry);
  const dateProp = entry.allDay ? ";VALUE=DATE" : "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SynCHRO//Event registration//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@synchroforum.eu`,
    `DTSTAMP:${ymdhmsZ(now)}`,
    `DTSTART${dateProp}:${start}`,
    `DTEND${dateProp}:${end}`,
    `SUMMARY:${escapeText(entry.title)}`,
  ];
  if (entry.description) lines.push(`DESCRIPTION:${escapeText(entry.description)}`);
  if (entry.location) lines.push(`LOCATION:${escapeText(entry.location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** Triggers a browser download of the .ics file. */
export function downloadIcs(event) {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
