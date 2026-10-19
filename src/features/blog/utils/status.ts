import type { DisplayStatus, PostSummary } from '@/types/blog';

/** A published post whose date is still ahead is waiting to go live: "scheduled". */
export function displayStatus(
  post: Pick<PostSummary, 'status' | 'publishedAt'>,
  now = Date.now(),
): DisplayStatus {
  if (post.status !== 'published') return post.status;
  return post.publishedAt && new Date(post.publishedAt).getTime() > now ? 'scheduled' : 'published';
}

/** `<input type="datetime-local">` value (local time, minutes) for an ISO date, or ''. */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Counts words in editor HTML. */
export function wordCount(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text ? text.split(/\s+/).length : 0;
}
