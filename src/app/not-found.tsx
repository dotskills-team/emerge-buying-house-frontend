import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-(--page-gutter) py-12">
      <div className="max-w-md text-center">
        <span className="bg-surface-muted text-fg-muted mx-auto flex size-12 items-center justify-center rounded-full">
          <Compass size={22} aria-hidden />
        </span>
        <p className="text-primary mt-4 text-sm font-medium">404</p>
        <h1 className="text-h2 text-fg mt-1">We could not find that page</h1>
        <p className="text-fg-muted mt-2">The link may be old, or the page may have moved.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/news-events" variant="secondary">
            News & events
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
