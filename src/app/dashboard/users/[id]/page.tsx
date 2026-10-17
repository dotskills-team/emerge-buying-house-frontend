import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { UserDetailPage } from '@/features/users/components/user-detail-page';

export const metadata: Metadata = { title: 'User' };

export default function Page() {
  return (
    <RequirePermission all={['users.read']}>
      <UserDetailPage />
    </RequirePermission>
  );
}
