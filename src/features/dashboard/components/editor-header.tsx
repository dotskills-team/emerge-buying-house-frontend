import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CircleDot } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Top bar of the post and product editors: back link, title, status and whether the work
 * is saved. The editors keep their action buttons in the side panel.
 */
export function EditorHeader({
  title,
  subtitle,
  back,
  status,
  saveState,
}: {
  title: string;
  subtitle?: string;
  back: { href: string; label: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void };
  status?: ReactNode;
  saveState: 'new' | 'dirty' | 'saved';
}) {
  return (
    <header className="border-border bg-surface rounded-2xl border px-4 py-3 shadow-sm sm:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={back.href}
          onClick={back.onClick}
          aria-label={back.label}
          title={back.label}
          className="border-border text-fg-muted hover:text-fg hover:bg-surface-muted flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors"
        >
          <ArrowLeft size={17} aria-hidden />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-fg text-lg leading-tight font-semibold">{title}</h1>
          {subtitle && <p className="text-fg-subtle truncate text-sm">{subtitle}</p>}
        </div>
        {status}
        <p
          aria-live="polite"
          className={cn(
            'inline-flex items-center gap-1.5 text-sm',
            saveState === 'dirty' ? 'text-warning' : 'text-fg-subtle',
          )}
        >
          {saveState === 'dirty' && (
            <>
              <CircleDot size={14} aria-hidden /> Unsaved changes
            </>
          )}
          {saveState === 'saved' && (
            <>
              <CheckCircle2 size={14} aria-hidden className="text-success" /> All changes saved
            </>
          )}
        </p>
      </div>
    </header>
  );
}
