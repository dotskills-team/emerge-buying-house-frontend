import { Skeleton } from '@/components/ui/skeleton';

export interface Segment {
  label: string;
  value: number;
  /** A series token class, in fixed order: bg-series-1, bg-series-2, bg-series-3. */
  colorClass: string;
}

const percent = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

/**
 * Part-to-whole as a single stacked bar (dataviz: categorical, fixed order, 2px surface gaps,
 * rounded ends). Identity never relies on color alone: the legend repeats every label with its
 * count and share, and each segment has a tooltip and an accessible name.
 */
export function StackedBar({
  segments,
  loading,
  emptyText,
}: {
  segments: Segment[];
  loading: boolean;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div role="status" aria-label="Loading chart" className="space-y-4">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return <p className="text-fg-muted py-6 text-center text-sm">{emptyText}</p>;

  return (
    <figure>
      <div
        role="img"
        aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}
        className="bg-surface flex h-4 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              title={`${s.label}: ${s.value} (${percent(s.value, total)}%)`}
              className={`${s.colorClass} h-full min-w-1.5 first:rounded-l-full last:rounded-r-full`}
              style={{ flexGrow: s.value }}
            />
          ))}
      </div>
      <figcaption className="mt-5">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {segments.map((s) => (
            <li
              key={s.label}
              className="border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <span aria-hidden className={`${s.colorClass} size-3 shrink-0 rounded-sm`} />
              <span className="text-fg-muted min-w-0 flex-1 truncate text-sm">{s.label}</span>
              <span className="text-fg text-sm font-semibold tabular-nums">{s.value}</span>
              <span className="text-fg-subtle w-10 text-right text-xs tabular-nums">
                {percent(s.value, total)}%
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

/** Magnitude per category: one hue, a lighter track of the same ramp, values as text. */
export function MagnitudeBars({
  rows,
  loading,
}: {
  rows: Array<{ label: string; value: number }>;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div role="status" aria-label="Loading chart" className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-fg-muted truncate">{r.label}</span>
            <span className="text-fg font-semibold tabular-nums">{r.value}</span>
          </div>
          <div className="bg-primary-soft h-2 overflow-hidden rounded-full" aria-hidden>
            <div
              className="bg-series-1 h-full rounded-full transition-[width] duration-(--duration-base)"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
