'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center px-(--page-gutter) py-12">
      <div role="alert" className="max-w-md text-center">
        <span className="bg-danger-soft text-danger mx-auto flex size-12 items-center justify-center rounded-full">
          <AlertTriangle size={22} aria-hidden />
        </span>
        <h1 className="text-h2 text-fg mt-4">This page could not be loaded</h1>
        <p className="text-fg-muted mt-2">
          Something went wrong on our side. Try again, and if it keeps happening, come back a little
          later.
        </p>
        {error.digest && <p className="text-fg-subtle mt-2 text-xs">Reference: {error.digest}</p>}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go to the homepage
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
