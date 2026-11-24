import { buildFields, STANDARD_FIELD_NAMES } from './fields';
import { makeEvent } from '../../testEvent';

test('every event gets the standard fields in a fixed order, extras before the privacy confirmation', () => {
  const names = buildFields(makeEvent()).map((f) => f.name);
  expect(names).toEqual([
    'first_name', 'last_name', 'email', 'organisation', 'attendance', 'dietary', 'privacy_policy',
  ]);
});

test('standard fields are required and cannot be removed or overridden by an event', () => {
  const event = makeEvent({
    extraFields: [
      { name: 'email', type: 'text', label: 'Hijacked', required: false },
      { name: 'role', type: 'text', label: 'Role' },
    ],
  });
  const fields = buildFields(event);
  expect(fields.filter((f) => f.name === 'email')).toHaveLength(1);
  expect(fields.find((f) => f.name === 'email').label).toBe('Work email');
  STANDARD_FIELD_NAMES.forEach((name) => {
    expect(fields.find((f) => f.name === name).required).toBe(true);
  });
  expect(fields.some((f) => f.name === 'role')).toBe(true);
});

test('the attendance question uses the event name unless overridden', () => {
  const question = (event) => buildFields(event).find((f) => f.name === 'attendance').label;
  expect(question(makeEvent())).toBe('Will you attend Test Forum Session?');
  expect(question(makeEvent({ attendanceQuestion: 'Coming?' }))).toBe('Coming?');
});

test('an event without extra fields still builds', () => {
  expect(buildFields(makeEvent({ extraFields: undefined })).map((f) => f.name)).toEqual(STANDARD_FIELD_NAMES);
});
