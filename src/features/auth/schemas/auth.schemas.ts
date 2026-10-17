import { z } from 'zod';

// Mirrors the backend rules (core/auth/validators/auth.validator.ts) so users see problems before
// submitting. The backend still validates everything.
const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address.')
  .pipe(z.email('Enter a valid email address.'));

// Spaces before or after a password (easy to pick up when copying) are ignored everywhere, exactly
// as on the backend. Spaces inside a passphrase are kept.
const password = () => z.string().trim();

export const newPassword = password()
  .min(12, 'Use at least 12 characters.')
  .max(128, 'Use at most 128 characters.');

export const loginSchema = z.object({
  email,
  password: password().min(1, 'Enter your password.'),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password: newPassword, confirm: password() })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'The passwords do not match.',
  });

export const changePasswordSchema = z
  .object({
    currentPassword: password().min(1, 'Enter your current password.'),
    newPassword,
    confirm: password(),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ['confirm'],
    message: 'The passwords do not match.',
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
