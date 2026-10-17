import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { EditPostPage } from '@/features/blog/components/edit-post-page';

export const metadata: Metadata = { title: 'Edit post' };

export default function Page() {
  return (
    <RequirePermission any={['posts.read', 'posts.create']}>
      <EditPostPage />
    </RequirePermission>
  );
}
