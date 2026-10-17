import type { PageMeta } from '@/types/api';
import { Button } from './button';

export function Pagination({
  meta,
  noun,
  onPage,
}: {
  meta: PageMeta;
  /** Singular and plural, e.g. ['post', 'posts']. */
  noun: [string, string];
  onPage: (page: number) => void;
}) {
  if (meta.total === 0) return null;
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-fg-muted">
        Page {meta.page} of {meta.totalPages} · {meta.total} {meta.total === 1 ? noun[0] : noun[1]}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPage(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPage(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
