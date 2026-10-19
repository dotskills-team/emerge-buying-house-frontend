'use client';

import { useParams } from 'next/navigation';
import { ErrorState, EmptyState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/blog';
import { usePost } from '../hooks/use-blog';
import { PROSE } from '../prose';
import { PostForm } from './post-form';
import { displayStatus } from '../utils/status';
import { PostStatusBadge } from './post-status-badge';

/** For people who may see a post but not edit it (viewers, authors once it is published). */
function PostPreview({ post, reason }: { post: Post; reason: string }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={post.title}
        description={reason}
        back={{ href: '/dashboard/blog', label: 'Back to posts' }}
        actions={<PostStatusBadge status={displayStatus(post)} />}
      />
      <Card className="p-5 sm:p-8">
        <p className="text-fg-subtle text-sm">
          {post.author?.name ?? 'Unknown author'} · updated {formatDate(post.updatedAt)} ·{' '}
          {post.readingTime} min read
        </p>
        {post.content ? (
          // Sanitized by the backend on save (allow-listed tags and attributes only).
          <div
            className={`mt-4 max-w-(--container-prose) ${PROSE}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-fg-muted mt-4">This post has no content yet.</p>
        )}
      </Card>
    </div>
  );
}

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { user, can } = usePermissions();
  const { data, isPending, isError, error, refetch } = usePost(id);

  if (isPending) {
    return (
      <div role="status" aria-label="Loading post" className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState
          title="Could not load this post"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Card>
    );
  }

  if (data.deletedAt) {
    return (
      <Card>
        <EmptyState
          title="This post is in the trash"
          message="Restore it from the Trash tab if you want to edit it."
          action={
            <ButtonLink href="/dashboard/blog" variant="secondary">
              Back to posts
            </ButtonLink>
          }
        />
      </Card>
    );
  }

  const ownDraft = data.status === 'draft' && data.author?._id === user?.id;
  if (can('posts.update') || (can('posts.create') && ownDraft)) {
    return <PostForm key={data.id} post={data} />;
  }
  return (
    <PostPreview
      post={data}
      reason={
        can('posts.create')
          ? 'Published posts can only be changed by an editor.'
          : 'You can read this post but not change it.'
      }
    />
  );
}
