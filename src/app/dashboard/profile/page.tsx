import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { ProfilePage } from '@/features/profile/components/profile-page';

export const metadata: Metadata = { title: 'Profile' };

export default function Page() {
  return (
    <RequirePermission all={['profile.read']}>
      <ProfilePage />
    </RequirePermission>
  );
}
