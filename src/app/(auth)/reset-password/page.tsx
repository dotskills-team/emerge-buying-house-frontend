import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Choose a new password',
  // The page URL carries a secret in its fragment; never leak it through a Referer header.
  referrer: 'no-referrer',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
