import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { RolesPage } from '@/features/users/components/roles-page';

export const metadata: Metadata = { title: 'Roles & permissions' };

export default function Page() {
  return (
    <RequirePermission all={['roles.read', 'permissions.read']}>
      <RolesPage />
    </RequirePermission>
  );
}
