import { render, screen, within, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the hero heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /accelerating european competitiveness/i })
  ).toBeInTheDocument();
});

test('renders the Who we are section with logos in order', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /^the synchro community$/i })
  ).toBeInTheDocument();
  const names = ['DNB', 'Crédit Agricole', 'Kongsberg', 'Shell', 'Yara', 'Equinor', 'Capgemini'];
  const alts = screen
    .getAllByRole('img')
    .map((img) => img.getAttribute('alt'))
    .filter((alt) => names.includes(alt));
  expect(alts).toEqual([
    'DNB',
    'Crédit Agricole',
    'Kongsberg',
    'Shell',
    'Yara',
    'Equinor',
    'Capgemini',
  ]);
});

test('navbar links to the page sections and the logo links home', () => {
  render(<App />);
  const nav = screen.getByRole('navigation', { name: 'Main' });
  expect(within(nav).getByRole('link', { name: 'Who We Are' })).toHaveAttribute('href', '#who-we-are');
  expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  expect(within(nav).getByRole('link', { name: 'Co-Chairs' })).toHaveAttribute('href', '#co-chairs');
  expect(screen.getByRole('link', { name: /synchro home/i })).toHaveAttribute('href', '/');
  // The nav link targets this id, so check the section really carries it.
  // eslint-disable-next-line testing-library/no-node-access
  expect(screen.getByRole('heading', { name: /meet the co-chairs for april 2027/i }).closest('#co-chairs')).not.toBeNull();
});

test('hamburger opens and closes the mobile menu', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /open menu/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();

  fireEvent.click(button);
  const menu = screen.getByRole('navigation', { name: 'Mobile' });
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  expect(within(menu).getByRole('link', { name: 'Co-Chairs' })).toHaveAttribute('href', '#co-chairs');

  fireEvent.click(within(menu).getByRole('link', { name: 'About' }));
  expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
});

test('announces the next session and links to downloads', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /new session to be announced soon/i })
  ).toBeInTheDocument();
  expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Member Access' })).toHaveAttribute('href', '/presentation');
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
