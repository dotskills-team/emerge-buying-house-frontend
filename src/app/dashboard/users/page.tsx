import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { UsersPage } from '@/features/users/components/users-page';

export const metadata: Metadata = { title: 'Users' };

export default function Page() {
  return (
    <RequirePermission all={['users.read']}>
      <UsersPage />
    </RequirePermission>
  );
}
