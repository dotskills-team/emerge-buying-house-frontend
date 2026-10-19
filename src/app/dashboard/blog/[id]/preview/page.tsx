import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { PostPreviewPage } from '@/features/blog/components/post-preview-page';

export const metadata: Metadata = { title: 'Preview post', robots: { index: false } };

export default function Page() {
  return (
    <RequirePermission any={['posts.read', 'posts.create']}>
      <PostPreviewPage />
    </RequirePermission>
  );
}
