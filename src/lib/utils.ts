import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the design tokens from globals.css, so `text-h1` is understood as a font
// size (not a color) and a component's defaults can be overridden by a className prop.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['h1', 'h2', 'h3', 'display', 'kpi'],
      color: [
        'primary',
        'primary-hover',
        'primary-soft',
        'secondary',
        'secondary-soft',
        'cyan',
        'cyan-soft',
        'emerald',
        'emerald-soft',
        'series-1',
        'series-2',
        'series-3',
        'nav-active',
        'gold',
        'gold-light',
        'ink-deep',
        'accent',
        'accent-soft',
        'focus',
        'bg',
        'surface',
        'surface-muted',
        'surface-inverse',
        'fg',
        'fg-muted',
        'fg-subtle',
        'fg-inverse',
        'fg-inverse-muted',
        'border',
        'border-strong',
        'success',
        'success-soft',
        'warning',
        'warning-soft',
        'danger',
        'danger-hover',
        'danger-soft',
        'info',
        'info-soft',
      ],
    },
  },
});

/** Joins class names; later classes win over conflicting earlier ones (e.g. px-0 over px-4). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(' '));
}

/** Builds "?a=1&b=x" from defined, non-empty values (false is treated as "not set"). */
export function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '' || value === false) continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDate = (iso: string | null | undefined) =>
  iso ? dateFormat.format(new Date(iso)) : '—';
export const formatDateTime = (iso: string | null | undefined) =>
  iso ? dateTimeFormat.format(new Date(iso)) : '—';

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "just now", "5 minutes ago", "3 hours ago", "yesterday"; older than a week: the date. */
export function formatRelative(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return '—';
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  if (abs < 3600) return relativeFormat.format(Math.round(seconds / 60), 'minute');
  if (abs < 86_400) return relativeFormat.format(Math.round(seconds / 3600), 'hour');
  if (abs < 7 * 86_400) return relativeFormat.format(Math.round(seconds / 86_400), 'day');
  return formatDate(iso);
}
