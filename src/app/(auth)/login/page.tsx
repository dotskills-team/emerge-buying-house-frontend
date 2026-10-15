import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-stone-wash px-5 py-12">
      {/* useSearchParams needs a Suspense boundary for static rendering */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}