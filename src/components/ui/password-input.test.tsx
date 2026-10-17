import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { loginSchema } from '@/features/auth/schemas/auth.schemas';
import { Field } from './field';
import { PasswordInput } from './password-input';

afterEach(cleanup);

describe('PasswordInput', () => {
  it('hides the password until the eye button is pressed, and keeps the field labelled', () => {
    render(
      <Field label="Password">
        <PasswordInput />
      </Field>,
    );
    const input = screen.getByLabelText('Password', { selector: 'input' });
    expect(input.getAttribute('type')).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.getAttribute('type')).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.getAttribute('type')).toBe('password');
  });
});

describe('password trimming', () => {
  it('ignores spaces around a pasted password but keeps spaces inside it', () => {
    const parsed = loginSchema.parse({ email: ' a@b.co ', password: '  my pass phrase \t' });
    expect(parsed).toEqual({ email: 'a@b.co', password: 'my pass phrase' });
  });
});
