import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Field, Input } from './field';

afterEach(cleanup);

describe('Field', () => {
  it('connects label, hint and error to the control for assistive technology', () => {
    render(
      <Field label="Email" hint="Your work address." error="Enter a valid email address.">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    const texts = describedBy.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(['Enter a valid email address.', 'Your work address.']);
  });

  it('is not marked invalid without an error', () => {
    render(
      <Field label="Name">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText('Name').hasAttribute('aria-invalid')).toBe(false);
  });
});
