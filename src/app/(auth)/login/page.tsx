import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    // useSearchParams needs a Suspense boundary for static rendering.
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
