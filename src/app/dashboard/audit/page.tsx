import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { AuditPage } from '@/features/users/components/audit-page';

export const metadata: Metadata = { title: 'Audit log' };

export default function Page() {
  return (
    <RequirePermission all={['audit.read']}>
      <AuditPage />
    </RequirePermission>
  );
}
