import { getPublic } from '@/lib/server-api';
import type { PostListResult, PostSummary } from '@/types/blog';

const PAGE = 30; // the public API's page-size limit
const MAX_PAGES = 34; // ~1000 posts; plenty for a company blog

/** Every live post (newest first), for the sitemap and feeds. Server only. */
export async function allPublishedPosts(): Promise<PostSummary[]> {
  const first = await getPublic<PostListResult>(`/blog/posts?limit=${PAGE}&page=1`, 600);
  if (!first) return [];
  const pages = Math.min(first.meta.totalPages, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      getPublic<PostListResult>(`/blog/posts?limit=${PAGE}&page=${i + 2}`, 600),
    ),
  );
  return [first, ...rest].flatMap((r) => r?.items ?? []);
}
