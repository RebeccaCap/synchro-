// Fictional event used by tests. Real event data never lives in the repo.
const DAY = 24 * 60 * 60 * 1000;

export function makeEvent(overrides = {}) {
  const now = Date.now();
  return {
    id: 'test-event',
    name: 'Test Forum Session',
    dateLabel: '1–2 January 2099',
    location: 'Test City',
    startDate: '2099-01-01',
    endDate: '2099-01-02T23:59:59+00:00',
    opensAt: new Date(now - DAY).toISOString(),
    closesAt: new Date(now + DAY).toISOString(),
    successMessage: 'Test success message.',
    declinedMessage: 'Test declined message.',
    extraFields: [{ name: 'dietary', type: 'textarea', label: 'Dietary requirements', optional: true }],
    calendar: { title: 'Test Forum Session', description: 'A, B; C', location: 'Test City' },
    ...overrides,
  };
}
