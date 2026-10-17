'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ErrorState, FullPageLoader } from '@/components/feedback/states';
import { useAuthStore } from '@/store/auth-store';
import { useAuthBootstrap } from '../hooks/use-auth-bootstrap';

/** Renders its children only for a signed-in user; everyone else is sent to the login page. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const signedOut = useAuthStore((s) => s.signedOut);
  const { status, error, retry } = useAuthBootstrap();

  useEffect(() => {
    if (status !== 'unauthenticated') return;
    router.replace(signedOut ? '/login' : `/login?next=${encodeURIComponent(pathname)}`);
  }, [status, signedOut, pathname, router]);

  if (status === 'authenticated') return <>{children}</>;

  if (status === 'error') {
    return (
      <div className="grid min-h-svh place-items-center">
        <ErrorState
          title="We could not verify your session"
          message={error}
          onRetry={() => void retry()}
        />
      </div>
    );
  }

  return (
    <FullPageLoader
      label={status === 'unauthenticated' ? 'Redirecting to sign in…' : 'Checking your session…'}
    />
  );
}
