import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { resetEventsCache } from './hooks/useEvents';
import { makeEvent } from './testEvent';

function mockEvents(events) {
  resetEventsCache();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ events }) })
  );
}

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
});

test('with an open event, the card and Register button replace the "announced soon" copy', async () => {
  mockEvents([makeEvent()]);
  render(<App />);

  // The (closed) dialog repeats the date, so look for at least one match.
  expect((await screen.findAllByText('1–2 January 2099')).length).toBeGreaterThan(0);
  expect(screen.getAllByText('Test City').length).toBeGreaterThan(0);
  // One Register button in the hero card, one in the Upcoming Session section.
  expect(screen.getAllByRole('button', { name: /register/i })).toHaveLength(2);
  expect(screen.queryByRole('heading', { name: /new session to be announced soon/i })).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/events.php', expect.any(Object));
});

test('Register opens the registration dialog for that event', async () => {
  const user = userEvent.setup();
  mockEvents([makeEvent()]);
  render(<App />);

  await user.click((await screen.findAllByRole('button', { name: /register/i }))[0]);
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveAccessibleName('Register for SynCHRO');
  expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
});

test('closed registration shows the event without a Register button', async () => {
  const past = new Date(Date.now() - 1000).toISOString();
  mockEvents([makeEvent({ closesAt: past })]);
  render(<App />);

  expect(await screen.findByText('1–2 January 2099')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument();
});

test('with no events the page keeps the "announced soon" copy', async () => {
  mockEvents([]);
  render(<App />);

  expect(await screen.findByRole('heading', { name: /new session to be announced soon/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument();
});

test('the Upcoming Session section shows the event details and its Register button opens the same dialog', async () => {
  const user = userEvent.setup();
  mockEvents([makeEvent()]);
  render(<App />);

  const section = await screen.findByRole('region', { name: 'Upcoming session' });
  expect(within(section).getByText('From noon')).toBeInTheDocument();
  expect(within(section).getByText('Until noon')).toBeInTheDocument();
  expect(within(section).getByText('Test Venue')).toBeInTheDocument();
  expect(within(section).getByText('Test details note.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Join SynCHRO' })).toHaveAttribute('href', '#upcoming-session');

  await user.click(within(section).getByRole('button', { name: /register/i }));
  expect(await screen.findByRole('dialog')).toHaveAccessibleName('Register for SynCHRO');
  expect(screen.getAllByLabelText(/work email/i)).toHaveLength(1);
});

test('without an event there is no Upcoming Session section or nav link', async () => {
  mockEvents([]);
  render(<App />);

  await screen.findByRole('heading', { name: /new session to be announced soon/i });
  expect(screen.queryByRole('heading', { name: 'Upcoming session' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Join SynCHRO' })).not.toBeInTheDocument();
});
