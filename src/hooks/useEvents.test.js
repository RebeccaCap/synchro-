import { getUpcomingEvent, isRegistrationOpen } from './useEvents';
import { makeEvent } from '../testEvent';

const NOW = new Date('2027-01-10T12:00:00Z');

test('registration is open from opensAt (inclusive) until closesAt (exclusive)', () => {
  const event = makeEvent({ opensAt: '2027-01-10T12:00:00Z', closesAt: '2027-01-20T00:00:00Z' });
  expect(isRegistrationOpen(event, new Date('2027-01-10T11:59:59Z'))).toBe(false);
  expect(isRegistrationOpen(event, NOW)).toBe(true);
  expect(isRegistrationOpen(event, new Date('2027-01-19T23:59:59Z'))).toBe(true);
  expect(isRegistrationOpen(event, new Date('2027-01-20T00:00:00Z'))).toBe(false);
});

test('missing bounds are open-ended, and no event is never open', () => {
  expect(isRegistrationOpen(makeEvent({ opensAt: undefined, closesAt: undefined }), NOW)).toBe(true);
  expect(isRegistrationOpen(null, NOW)).toBe(false);
});

test('the upcoming event is the earliest one that has not finished', () => {
  const past = makeEvent({ id: 'past', startDate: '2026-01-01', endDate: '2026-01-02' });
  const later = makeEvent({ id: 'later', startDate: '2027-06-01', endDate: '2027-06-02' });
  const sooner = makeEvent({ id: 'sooner', startDate: '2027-03-01', endDate: '2027-03-02' });
  expect(getUpcomingEvent([past, later, sooner], NOW).id).toBe('sooner');
  expect(getUpcomingEvent([past], NOW)).toBeNull();
  expect(getUpcomingEvent([], NOW)).toBeNull();
});
