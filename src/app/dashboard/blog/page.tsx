import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { BlogPostsPage } from '@/features/blog/components/blog-posts-page';

export const metadata: Metadata = { title: 'Blog posts' };

export default function Page() {
  return (
    <RequirePermission any={['posts.read', 'posts.create']}>
      <BlogPostsPage />
    </RequirePermission>
  );
}
