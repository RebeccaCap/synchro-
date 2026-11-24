import { render, screen } from '@testing-library/react';
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
  expect(screen.getByText('Test City')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /new session to be announced soon/i })).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/events.php', expect.any(Object));
});

test('Register opens the registration dialog for that event', async () => {
  const user = userEvent.setup();
  mockEvents([makeEvent()]);
  render(<App />);

  await user.click(await screen.findByRole('button', { name: /register/i }));
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveAccessibleName('Test Forum Session');
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
