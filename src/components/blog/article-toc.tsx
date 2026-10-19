'use client';

import { useEffect, useState } from 'react';
import { ListTree } from 'lucide-react';
import type { TocEntry } from '@/features/blog/utils/article';
import { cn } from '@/lib/utils';

/** Highlights the heading the reader is currently in. Ids come space-separated (stable deps). */
function useActiveHeading(idList: string) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = idList
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A heading counts once it reaches the upper third of the screen.
      { rootMargin: '-96px 0px -66% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idList]);
  return active;
}

function Links({ toc, active }: { toc: TocEntry[]; active: string | null }) {
  return (
    <ol className="border-border space-y-1 border-l">
      {toc.map((t) => (
        <li key={t.id}>
          <a
            href={`#${t.id}`}
            aria-current={active === t.id ? 'location' : undefined}
            className={cn(
              '-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors',
              t.level === 3 ? 'pl-7' : 'pl-4',
              active === t.id
                ? 'border-gold text-fg font-medium'
                : 'text-fg-muted hover:text-fg border-transparent',
            )}
          >
            {t.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Sticky outline on wide screens; a collapsible "In this article" box on smaller ones. */
export function ArticleToc({ toc, variant }: { toc: TocEntry[]; variant: 'sidebar' | 'inline' }) {
  const active = useActiveHeading(toc.map((t) => t.id).join(' '));
  if (toc.length < 2) return null;

  if (variant === 'inline') {
    return (
      <details className="border-border bg-surface group mb-8 rounded-2xl border p-4 xl:hidden">
        <summary className="text-fg flex cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <ListTree size={16} aria-hidden className="text-secondary" />
          In this article
          <span className="text-fg-subtle ml-auto text-xs font-normal group-open:hidden">
            {toc.length} sections
          </span>
        </summary>
        <div className="mt-3">
          <Links toc={toc} active={active} />
        </div>
      </details>
    );
  }

  return (
    <nav aria-label="In this article" className="hidden xl:block">
      <p className="text-secondary mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
        In this article
      </p>
      <Links toc={toc} active={active} />
    </nav>
  );
}
