'use client';

import { useMemo, useState } from 'react';
import type { NewsItem, NewsKind } from '@/content/news';
import { cn } from '@/lib/utils';
import { NewsCard } from './news-card';

type Filter = 'All' | NewsKind;
const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'All', label: 'All' },
  { key: 'News', label: 'News' },
  { key: 'Event', label: 'Events' },
];

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = useMemo(
    () => (filter === 'All' ? items : items.filter((n) => n.kind === filter)),
    [items, filter],
  );

  return (
    <>
      <div role="toolbar" aria-label="Filter stories" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-transparent bg-(image:--gradient-brand) text-white shadow-md'
                : 'border-border bg-surface text-fg-muted hover:text-fg hover:border-primary/30',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((n) => (
          <li key={n.slug}>
            <NewsCard item={n} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="text-fg-muted py-12 text-center">Nothing here yet. Check back soon.</p>
      )}
    </>
  );
}
