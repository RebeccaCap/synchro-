import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './RegistrationForm';
import AddToCalendar from './AddToCalendar';
import { ApiError } from '../../api';
import { makeEvent } from '../../testEvent';

async function fillIn(user, { attendance = 'yes' } = {}) {
  await user.type(screen.getByLabelText(/first name/i), 'Ada');
  await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
  await user.type(screen.getByLabelText(/work email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/organisation/i), 'Analytical Engines');
  await user.click(
    screen.getByRole('radio', { name: attendance === 'yes' ? /yes, i will attend/i : /no, i will not/i })
  );
  await user.type(screen.getByLabelText(/dietary requirements/i), 'Vegan');
  await user.click(screen.getByRole('checkbox', { name: /privacy policy/i }));
}

test('renders the event, the standard fields and the event-specific fields', () => {
  render(<RegistrationForm event={makeEvent()} />);
  expect(screen.getByRole('heading', { name: 'Test Forum Session' })).toBeInTheDocument();
  expect(screen.getByText('1–2 January 2099')).toBeInTheDocument();
  ['first name', 'last name', 'work email'].forEach((label) => {
    expect(screen.getByLabelText(new RegExp(label, 'i'))).toBeRequired();
  });
  expect(screen.getByLabelText(/organisation/i)).not.toBeRequired();
  expect(screen.getByRole('radio', { name: /yes, i will attend/i })).toBeRequired();
  expect(screen.getByLabelText(/dietary requirements/i)).not.toBeRequired();
  expect(screen.getByRole('checkbox', { name: /privacy policy/i })).toBeRequired();
});

test('submits the values with the event id and shows the confirmation', async () => {
  const user = userEvent.setup();
  const submit = jest.fn().mockResolvedValue({ success: true });
  render(<RegistrationForm event={makeEvent()} submit={submit} successActions={<AddToCalendar event={makeEvent()} />} />);

  await fillIn(user);
  await user.click(screen.getByRole('button', { name: /submit registration/i }));

  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({
      event_id: 'test-event',
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.com',
      organisation: 'Analytical Engines',
      attendance: 'yes',
      dietary: 'Vegan',
      privacy_policy: 'yes',
    })
  );
  expect(await screen.findByRole('heading', { name: /you're confirmed/i })).toBeInTheDocument();
  expect(screen.getByText('Test success message.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /google calendar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /download \.ics/i })).toBeInTheDocument();
});

test('without the attendance question, submitting confirms attendance', async () => {
  const user = userEvent.setup();
  const submit = jest.fn().mockResolvedValue({ success: true });
  const event = makeEvent({ collectAttendance: false });
  render(<RegistrationForm event={event} submit={submit} />);

  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  await user.type(screen.getByLabelText(/first name/i), 'Ada');
  await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
  await user.type(screen.getByLabelText(/work email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/organisation/i), 'Analytical Engines');
  await user.click(screen.getByRole('checkbox', { name: /privacy policy/i }));
  await user.click(screen.getByRole('button', { name: /submit registration/i }));

  expect(await screen.findByRole('heading', { name: /you're confirmed/i })).toBeInTheDocument();
  expect(submit.mock.calls[0][0]).not.toHaveProperty('attendance');
});

test('declining shows the thank-you message without calendar options', async () => {
  const user = userEvent.setup();
  const submit = jest.fn().mockResolvedValue({ success: true });
  render(<RegistrationForm event={makeEvent()} submit={submit} successActions={<AddToCalendar event={makeEvent()} />} />);

  await fillIn(user, { attendance: 'no' });
  await user.click(screen.getByRole('button', { name: /submit registration/i }));

  expect(await screen.findByRole('heading', { name: /thank you for letting us know/i })).toBeInTheDocument();
  expect(screen.getByText('Test declined message.')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /google calendar/i })).not.toBeInTheDocument();
});

test('the empty form is invalid, so the browser blocks submission', () => {
  render(<RegistrationForm event={makeEvent()} />);
  expect(screen.getByRole('form').checkValidity()).toBe(false);
});

test('shows the server error and keeps the form for another try', async () => {
  const user = userEvent.setup();
  const submit = jest.fn().mockRejectedValue(new ApiError('Registration is not open for this event.', 403));
  render(<RegistrationForm event={makeEvent()} submit={submit} />);

  await fillIn(user);
  await user.click(screen.getByRole('button', { name: /submit registration/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Registration is not open for this event.');
  expect(screen.getByRole('button', { name: /submit registration/i })).toBeEnabled();
});

test('a consent implied by another field is ticked and required while that field has a value', async () => {
  const user = userEvent.setup();
  const event = makeEvent({
    extraFields: [
      { name: 'dietary', type: 'textarea', label: 'Dietary requirements', optional: true },
      { name: 'dietary_consent', type: 'checkbox', label: 'I consent to my dietary data being used.', impliedBy: 'dietary' },
    ],
  });
  render(<RegistrationForm event={event} />);
  const consent = screen.getByRole('checkbox', { name: /dietary data/i });
  expect(consent).not.toBeChecked();
  expect(consent).not.toBeRequired();

  await user.type(screen.getByLabelText(/dietary requirements/i), 'Vegan');
  expect(consent).toBeChecked();
  expect(consent).toBeRequired();

  await user.clear(screen.getByLabelText(/dietary requirements/i));
  expect(consent).not.toBeChecked();
  expect(consent).not.toBeRequired();
});
