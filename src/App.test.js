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
