import { describe, expect, it, vi } from 'vitest';
import { applyFieldErrors } from './forms';
import { ApiError } from './http';

describe('applyFieldErrors', () => {
  it('maps backend field errors onto matching form fields only', () => {
    const setError = vi.fn();
    const err = new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', [
      { path: 'email', message: 'Enter a valid email address.' },
      { path: 'role', message: 'Unknown role' },
    ]);
    expect(
      applyFieldErrors<{ email: string; name: string }>(err, setError, ['email', 'name']),
    ).toBe(true);
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Enter a valid email address.',
    });
  });

  it('reports false for errors without field details', () => {
    const setError = vi.fn();
    expect(applyFieldErrors(new Error('boom'), setError, [])).toBe(false);
    expect(applyFieldErrors(new ApiError(409, 'Taken', 'EMAIL_TAKEN'), setError, [])).toBe(false);
  });
});
