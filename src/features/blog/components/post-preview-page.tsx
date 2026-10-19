'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Eye, Pencil } from 'lucide-react';
import { ArticleView } from '@/components/blog/article-view';
import { ErrorState } from '@/components/feedback/states';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';
import { usePost } from '../hooks/use-blog';
import { displayStatus } from '../utils/status';
import { PostStatusBadge } from './post-status-badge';

/** The saved post rendered exactly as the website will show it, drafts included. */
export function PostPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = usePost(id);

  if (isPending) {
    return (
      <div role="status" aria-label="Loading preview" className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-[70svh]" />
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

  const status = displayStatus(data);
  return (
    <div className="space-y-4">
      <div className="border-border bg-surface flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm">
        <Eye size={18} aria-hidden className="text-primary" />
        <p className="text-fg text-sm font-medium">Preview</p>
        <PostStatusBadge status={status} />
        <p className="text-fg-muted text-sm">
          {status === 'draft'
            ? 'Not visible on the website yet.'
            : status === 'scheduled'
              ? `Goes live ${formatDateTime(data.publishedAt)}.`
              : 'Live on the website.'}
        </p>
        <Link
          href={`/dashboard/blog/${data.id}`}
          className="text-primary ml-auto inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <Pencil size={15} aria-hidden /> Back to editor
        </Link>
      </div>
      <div className="border-border bg-bg overflow-hidden rounded-3xl border shadow-sm">
        <ArticleView post={data} preview />
      </div>
    </div>
  );
}
