import { buildIcs, calendarEntry, googleCalendarUrl, outlookCalendarUrl } from './calendar';
import { makeEvent } from '../../testEvent';

test('all-day entries end the day after the last day (DTEND is exclusive)', () => {
  const entry = calendarEntry(makeEvent());
  expect(entry.allDay).toBe(true);
  expect(entry.start.toISOString().slice(0, 10)).toBe('2099-01-01');
  expect(entry.end.toISOString().slice(0, 10)).toBe('2099-01-03');
});

test('an entry with calendar.start/end is timed', () => {
  const event = makeEvent({
    calendar: { start: '2099-01-01T09:00:00+00:00', end: '2099-01-01T17:30:00+00:00' },
  });
  const ics = buildIcs(event, new Date('2026-01-01T00:00:00Z'));
  expect(ics).toContain('DTSTART:20990101T090000Z');
  expect(ics).toContain('DTEND:20990101T173000Z');
  expect(googleCalendarUrl(event)).toContain('dates=20990101T090000Z%2F20990101T173000Z');
});

test('the .ics file is well formed and escapes text', () => {
  const ics = buildIcs(makeEvent(), new Date('2026-01-01T00:00:00Z'));
  expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
  expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  expect(ics).toContain('UID:test-event@synchroforum.eu');
  expect(ics).toContain('DTSTART;VALUE=DATE:20990101');
  expect(ics).toContain('DTEND;VALUE=DATE:20990103');
  expect(ics).toContain(String.raw`DESCRIPTION:A\, B\; C`);
});

test('web calendar links carry the title, dates and location', () => {
  const google = googleCalendarUrl(makeEvent());
  expect(google).toContain('calendar.google.com');
  expect(google).toContain('text=Test+Forum+Session');
  expect(google).toContain('dates=20990101%2F20990103');
  const outlook = outlookCalendarUrl(makeEvent());
  expect(outlook).toContain('allday=true');
  expect(outlook).toContain('startdt=2099-01-01');
  expect(outlook).toContain('enddt=2099-01-03');
  expect(outlook).toContain('location=Test+City');
});
