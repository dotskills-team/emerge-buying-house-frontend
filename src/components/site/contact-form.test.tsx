import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/http';
import { ContactForm } from './contact-form';

const submitContact = vi.fn();
vi.mock('@/features/inquiries/services/inquiries.service', () => ({
  submitContact: (input: unknown) => submitContact(input),
}));

afterEach(() => {
  cleanup();
  submitContact.mockReset();
});

const field = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement;

function fillValid() {
  fireEvent.change(field(/your name/i), { target: { value: 'Anna Berg' } });
  fireEvent.change(field(/^email/i), { target: { value: 'anna@example.com' } });
  fireEvent.change(field(/^message/i), {
    target: { value: 'We need 5,000 pcs of the jersey tee by March.' },
  });
}

const send = () => fireEvent.click(screen.getByRole('button', { name: /send message/i }));

describe('ContactForm', () => {
  it('shows what is missing and does not send', async () => {
    render(<ContactForm to="info@example.com" />);
    send();
    expect(await screen.findByText('Enter your name.')).toBeTruthy();
    expect(screen.getByText('Enter your email address.')).toBeTruthy();
    expect(screen.getByText(/at least 10 characters/)).toBeTruthy();
    expect(submitContact).not.toHaveBeenCalled();
  });

  it('sends the message and shows the reference', async () => {
    submitContact.mockResolvedValue({ reference: 'EBH-261020-7K3Q', confirmationSent: true });
    render(<ContactForm to="info@example.com" product="Organic jersey tee" />);
    expect(screen.getByText('Organic jersey tee')).toBeTruthy();
    fillValid();
    send();

    expect(await screen.findByText('EBH-261020-7K3Q')).toBeTruthy();
    expect(screen.getByText(/Thank you, Anna/)).toBeTruthy();
    expect(screen.getByText('anna@example.com')).toBeTruthy();
    expect(submitContact).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Anna Berg',
        email: 'anna@example.com',
        topic: 'quote',
        product: 'Organic jersey tee',
        website: '',
      }),
    );
  });

  it('puts server validation messages on the right fields', async () => {
    submitContact.mockRejectedValue(
      new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', [
        { path: 'email', message: 'Enter a valid email address' },
      ]),
    );
    render(<ContactForm to="info@example.com" />);
    fillValid();
    send();
    expect(await screen.findByText('Enter a valid email address')).toBeTruthy();
    expect(screen.queryByText(/was not sent/)).toBeNull();
  });

  it('explains a failure and offers the email address instead', async () => {
    submitContact.mockRejectedValue(
      new ApiError(429, 'You have sent several messages in a short time.', 'RATE_LIMITED'),
    );
    render(<ContactForm to="info@example.com" />);
    fillValid();
    send();
    expect(await screen.findByText('Your message was not sent')).toBeTruthy();
    expect(screen.getByText(/several messages in a short time/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'info@example.com' })).toBeTruthy();
  });

  it('starts over with an empty form after sending', async () => {
    submitContact.mockResolvedValue({ reference: 'EBH-261020-7K3Q', confirmationSent: false });
    render(<ContactForm to="info@example.com" />);
    fillValid();
    send();
    fireEvent.click(await screen.findByRole('button', { name: /send another message/i }));
    await waitFor(() => expect(field(/your name/i).value).toBe(''));
  });
});
