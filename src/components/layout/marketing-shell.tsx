import type { ReactNode } from 'react';
import { Footer } from './footer';
import { Navbar } from './navbar';

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
