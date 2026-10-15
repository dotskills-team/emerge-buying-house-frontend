import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { DashboardShell } from '@/features/auth/components/dashboard-shell';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | Dashboard' },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}



