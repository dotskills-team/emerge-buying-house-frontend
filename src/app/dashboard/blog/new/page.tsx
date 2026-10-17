import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { PostForm } from '@/features/blog/components/post-form';

export const metadata: Metadata = { title: 'New post' };

export default function Page() {
  return (
    <RequirePermission all={['posts.create']}>
      <PostForm />
    </RequirePermission>
  );
}
