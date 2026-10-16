import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /accelerating european competitiveness/i })
  ).toBeInTheDocument();
});

test('announces the next session and links to downloads', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /new session to be announced soon/i })
  ).toBeInTheDocument();
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Downloads' })).toHaveAttribute('href', '/presentation');
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
