'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { Toaster } from '@/components/feedback/toaster';
import { getPreference, resolve } from '@/features/theme/theme';
import { ApiError } from '@/lib/http';

export function Providers({ children }: { children: ReactNode }) {
  // The head script already set the theme; this restores it if React ever re-created <html>
  // (e.g. after an error while the page loaded).
  useEffect(() => {
    document.documentElement.dataset.theme = resolve(getPreference());
  }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // Client errors (4xx) will not fix themselves, so only retry network/server failures.
            retry: (failures, error) =>
              !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
              failures < 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster />
      </MotionConfig>
    </QueryClientProvider>
  );
}
