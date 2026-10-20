'use client';

import { motion } from 'motion/react';
import { ImageIcon, LayoutGrid, List, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface HeroStat {
  label: string;
  value: number | undefined;
  /** Accent dot colour. */
  tone?: 'gold' | 'emerald' | 'sky' | 'amber' | 'slate';
}

const DOT: Record<NonNullable<HeroStat['tone']>, string> = {
  gold: 'bg-gold-light',
  emerald: 'bg-emerald-300',
  sky: 'bg-sky-300',
  amber: 'bg-amber-300',
  slate: 'bg-white/50',
};

/**
 * Premium page header for content sections: deep emerald panel with grain, gold accents, the
 * page actions and live counts. Counts are real values only (a skeleton while loading).
 */
export function ContentHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  stats,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: HeroStat[];
}) {
  return (
    <header className="text-fg-inverse relative isolate overflow-hidden rounded-3xl bg-(image:--gradient-sidebar) p-5 shadow-lg sm:p-7 lg:p-8">
      <div aria-hidden className="bg-weave absolute inset-0 -z-10 opacity-40" />
      <div aria-hidden className="bg-grain absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="bg-gold/20 absolute -top-24 -right-16 -z-10 size-72 rounded-full blur-3xl"
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="text-ink-deep shadow-gold hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-(image:--gradient-gold) sm:flex">
            <Icon size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-gold-light text-xs font-semibold tracking-[0.22em] uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display mt-1.5 text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-fg-inverse-muted mt-2 max-w-2xl text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 sm:gap-3">{actions}</div>}
      </div>

      {stats && stats.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm"
            >
              <dt className="text-fg-inverse-muted flex items-center gap-2 text-xs font-medium">
                <span aria-hidden className={cn('size-1.5 rounded-full', DOT[s.tone ?? 'slate'])} />
                {s.label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {s.value === undefined ? (
                  <Skeleton className="h-7 w-10 bg-white/15" />
                ) : (
                  s.value.toLocaleString()
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}

export interface TabDef<K extends string> {
  key: K;
  label: string;
  count?: number;
}

/** Pill tabs with a sliding indicator; scrolls sideways on narrow screens. */
export function SegmentedTabs<K extends string>({
  tabs,
  value,
  onChange,
  label,
  id,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  /** Unique per page, so two tab bars never share an animated indicator. */
  id: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="border-border bg-surface -mx-1 flex gap-1 overflow-x-auto rounded-2xl border p-1 shadow-xs sm:mx-0 sm:inline-flex"
    >
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={cn(
              'relative inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors',
              active ? 'text-fg-inverse' : 'text-fg-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`tab-${id}`}
                aria-hidden
                className="bg-ink-deep absolute inset-0 rounded-xl shadow-sm"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{t.label}</span>
            {t.count !== undefined && (
              <span
                className={cn(
                  'relative rounded-full px-2 py-0.5 text-xs tabular-nums',
                  active ? 'bg-gold-light/20 text-gold-light' : 'bg-surface-muted text-fg-subtle',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type ViewMode = 'list' | 'grid';

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const options: { key: ViewMode; label: string; icon: LucideIcon }[] = [
    { key: 'list', label: 'List view', icon: List },
    { key: 'grid', label: 'Grid view', icon: LayoutGrid },
  ];
  return (
    <div
      role="group"
      aria-label="Layout"
      className="border-border bg-surface inline-flex rounded-xl border p-1 shadow-xs"
    >
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          aria-pressed={value === key}
          title={label}
          onClick={() => onChange(key)}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-lg transition-colors',
            value === key ? 'bg-primary-soft text-primary' : 'text-fg-subtle hover:text-fg',
          )}
        >
          <Icon size={17} aria-hidden />
        </button>
      ))}
    </div>
  );
}

/** Small cover image, or a branded placeholder. */
export function Thumb({
  src,
  alt = '',
  className,
  sizes = '96px',
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn('bg-surface-muted relative shrink-0 overflow-hidden', className)}>
      {src ? (
        <MediaImage src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="bg-brand-weave absolute inset-0 flex items-center justify-center">
          <ImageIcon aria-hidden className="text-gold-light/70 size-1/3 max-h-8 max-w-8" />
        </div>
      )}
    </div>
  );
}

/** Form section with an icon header, used by the post and product editors. */
export function FormPanel({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'border-border bg-surface relative overflow-hidden rounded-2xl border shadow-sm',
        className,
      )}
    >
      <header className="border-border flex items-start gap-3 border-b px-5 py-4">
        <span className="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
          <Icon size={17} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-fg text-[0.9375rem] font-semibold">{title}</h2>
          {description && <p className="text-fg-subtle mt-0.5 text-xs">{description}</p>}
        </div>
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

/** Card-shaped placeholder grid while a grid view loads. */
export function GridSkeleton({ count = 6, label }: { count?: number; label: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-border bg-surface overflow-hidden rounded-2xl border">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
