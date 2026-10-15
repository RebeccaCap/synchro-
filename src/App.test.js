import { render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => {
  jest.useRealTimers();
});

test('renders the hero heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /accelerating european competitiveness/i })
  ).toBeInTheDocument();
});

test('counts down to 15 October 2026, 11:00 CEST', () => {
  jest.useFakeTimers();
  // 1 day, 2 hours, 3 minutes before the start (09:00 UTC)
  jest.setSystemTime(new Date('2026-10-14T06:57:00Z'));
  render(<App />);
  expect(screen.getByRole('timer')).toHaveAccessibleName(
    '1 days, 2 hours, 3 minutes until the forum starts'
  );
});

test('shows a started message once the forum begins', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-15T09:00:00Z'));
  render(<App />);
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  expect(screen.getByText(/the forum has started/i)).toBeInTheDocument();
});

describe('protected pages', () => {
  const realFetch = global.fetch;

  function mockFetch(responses) {
    global.fetch = jest.fn((url) => {
      const key = Object.keys(responses).find((k) => url.includes(k));
      return Promise.resolve({ ok: true, json: () => Promise.resolve(responses[key]) });
    });
  }

  afterEach(() => {
    global.fetch = realFetch;
    window.history.pushState({}, '', '/');
  });

  test('/presentation asks for an access password', async () => {
    window.history.pushState({}, '', '/presentation/');
    mockFetch({ 'viewer.php?action=session': { authenticated: false } });
    render(<App />);
    expect(await screen.findByLabelText(/access password/i)).toBeInTheDocument();
  });

  test('/presentation lists materials for a logged-in viewer', async () => {
    window.history.pushState({}, '', '/presentation/');
    mockFetch({
      'viewer.php?action=session': {
        authenticated: true,
        presentation: { title: 'Founders Edition' },
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        files: [{ id: 'abcdef0123456789', name: 'deck.pdf', size: 2048, uploaded_at: 0 }],
      },
    });
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Founders Edition' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /download deck\.pdf/i })).toHaveAttribute(
      'href',
      '/api/download.php?id=abcdef0123456789'
    );
  });

});
