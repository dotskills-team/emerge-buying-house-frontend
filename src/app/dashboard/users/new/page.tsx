import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { CreateUserForm } from '@/features/users/components/create-user-form';

export const metadata: Metadata = { title: 'Add user' };

export default function Page() {
  return (
    <RequirePermission all={['users.create']}>
      <CreateUserForm />
    </RequirePermission>
  );
}
