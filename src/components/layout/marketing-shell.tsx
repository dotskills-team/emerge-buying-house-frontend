import type { ReactNode } from 'react';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { ScrollProgress } from '@/components/site/text-effects';

/** Public website frame. `overlayHeader` lets the header float over a full-screen hero. */
export function MarketingShell({
  children,
  overlayHeader = false,
}: {
  children: ReactNode;
  overlayHeader?: boolean;
}) {
  // One root element: Next scrolls the page segment's first node to the top on navigation.
  return (
    <div>
      <a
        href="#main"
        className="focus:bg-surface focus:text-fg sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-toast) focus:rounded-lg focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar overlay={overlayHeader} />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
    </div>
  );
}
