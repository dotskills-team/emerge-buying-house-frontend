import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/logo';
import { SITE } from '@/config/site';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-(--page-gutter) py-10">
      <Link href="/" aria-label={`${SITE.name} home`}>
        <Logo />
      </Link>
      <div className="border-border bg-surface mt-8 w-full max-w-md rounded-lg border p-6 shadow-sm sm:p-8">
        {children}
      </div>
      <Link
        href="/"
        className="text-fg-muted hover:text-fg mt-6 text-sm underline underline-offset-4"
      >
        Back to the website
      </Link>
    </main>
  );
}
