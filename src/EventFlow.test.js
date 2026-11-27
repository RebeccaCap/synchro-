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
  // The hero card has the Register button; the section holds the form itself.
  expect(screen.getAllByRole('button', { name: /^register/i })).toHaveLength(1);
  expect(screen.queryByRole('heading', { name: /new session to be announced soon/i })).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/events.php', expect.any(Object));
});

test('Register opens the registration dialog for that event', async () => {
  const user = userEvent.setup();
  mockEvents([makeEvent()]);
  render(<App />);

  await user.click(await screen.findByRole('button', { name: /^register/i }));
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveAccessibleName('Register for SynCHRO');
  expect(within(dialog).getByLabelText(/work email/i)).toBeInTheDocument();
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

test('the Join SynCHRO section shows the session details beside the registration form', async () => {
  mockEvents([makeEvent()]);
  render(<App />);

  const section = await screen.findByRole('region', { name: 'Upcoming session' });
  expect(within(section).getByLabelText(/work email/i)).toBeInTheDocument();
  expect(within(section).getByRole('button', { name: /submit registration/i })).toBeInTheDocument();
  expect(within(section).getByText('From noon')).toBeInTheDocument();
  expect(within(section).getByText('Until noon')).toBeInTheDocument();
  expect(within(section).getByText('Test Venue')).toBeInTheDocument();
  expect(within(section).getByText('Test details note.')).toBeInTheDocument();
  expect(within(section).queryByRole('button', { name: /^register/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Join SynCHRO' })).toHaveAttribute('href', '#upcoming-session');
});

test('the dialog and the inline form can both be on the page without sharing ids', async () => {
  const user = userEvent.setup();
  mockEvents([makeEvent()]);
  render(<App />);

  await user.click(await screen.findByRole('button', { name: /^register/i }));
  const emails = await screen.findAllByLabelText(/work email/i);
  expect(emails).toHaveLength(2);
  expect(emails[0].id).not.toBe(emails[1].id);
});

test('outside the registration window the section says registration is not open', async () => {
  const past = new Date(Date.now() - 1000).toISOString();
  mockEvents([makeEvent({ closesAt: past })]);
  render(<App />);

  const section = await screen.findByRole('region', { name: 'Upcoming session' });
  expect(within(section).getByText(/registration is not open/i)).toBeInTheDocument();
  expect(within(section).queryByLabelText(/work email/i)).not.toBeInTheDocument();
});

test('without an event there is no Upcoming Session section or nav link', async () => {
  mockEvents([]);
  render(<App />);

  await screen.findByRole('heading', { name: /new session to be announced soon/i });
  expect(screen.queryByRole('heading', { name: 'Upcoming session' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Join SynCHRO' })).not.toBeInTheDocument();
});
