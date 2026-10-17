import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type StatTone = 'blue' | 'violet' | 'teal' | 'emerald' | 'amber' | 'red' | 'slate';

const TONES: Record<StatTone, { icon: string; bar: string }> = {
  blue: { icon: 'bg-primary-soft text-primary', bar: 'bg-primary' },
  violet: { icon: 'bg-secondary-soft text-secondary', bar: 'bg-secondary' },
  teal: { icon: 'bg-accent-soft text-accent', bar: 'bg-accent' },
  emerald: { icon: 'bg-emerald-soft text-emerald', bar: 'bg-emerald' },
  amber: { icon: 'bg-warning-soft text-warning', bar: 'bg-warning' },
  red: { icon: 'bg-danger-soft text-danger', bar: 'bg-danger' },
  slate: { icon: 'bg-surface-muted text-fg-muted', bar: 'bg-fg-subtle' },
};

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/**
 * A KPI tile: label, value and a link to the underlying list. It shows only real values; there
 * is no historical data to compare against, so no trend or percentage change is displayed.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
  hint,
  loading = false,
  failed = false,
}: {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  tone: StatTone;
  href?: string;
  hint?: string;
  loading?: boolean;
  failed?: boolean;
}) {
  const { icon, bar } = TONES[tone];
  const body = (
    <>
      <span aria-hidden className={cn('absolute inset-x-0 top-0 h-1 opacity-80', bar)} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-fg-muted text-sm font-medium">{label}</p>
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 sm:rounded-xl',
            icon,
          )}
        >
          <Icon size={18} aria-hidden />
        </span>
      </div>
      <div className="mt-2 min-h-10">
        {loading ? (
          <Skeleton className="h-9 w-20" />
        ) : failed ? (
          <p className="text-fg-subtle text-sm">Could not load</p>
        ) : (
          <p className="text-kpi text-fg font-semibold tracking-tight">
            {value === undefined ? '—' : compact.format(value)}
          </p>
        )}
      </div>
      {(hint || href) && (
        <p className="text-fg-subtle mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="truncate">{hint}</span>
          {href && (
            <ArrowRight
              size={14}
              aria-hidden
              className="group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          )}
        </p>
      )}
    </>
  );

  const className =
    'group border-border bg-surface relative block overflow-hidden rounded-xl border p-4 shadow-sm transition-[box-shadow,border-color] duration-(--duration-fast) sm:p-5';
  return href ? (
    <Link href={href} className={cn(className, 'hover:border-primary/30 hover:shadow-md')}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
