import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone =
  'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'secondary';

const TONES: Record<BadgeTone, { box: string; dot: string }> = {
  neutral: { box: 'bg-surface-muted text-fg-muted ring-border-strong', dot: 'bg-fg-subtle' },
  info: { box: 'bg-info-soft text-info ring-info/20', dot: 'bg-info' },
  success: { box: 'bg-success-soft text-success ring-success/20', dot: 'bg-success' },
  warning: { box: 'bg-warning-soft text-warning ring-warning/20', dot: 'bg-warning' },
  danger: { box: 'bg-danger-soft text-danger ring-danger/20', dot: 'bg-danger' },
  accent: { box: 'bg-accent-soft text-accent ring-accent/20', dot: 'bg-accent' },
  secondary: { box: 'bg-secondary-soft text-secondary ring-secondary/20', dot: 'bg-secondary' },
};

/** Compact label. `dot` adds a status dot; the text always carries the meaning, never color alone. */
export function Badge({
  tone = 'neutral',
  dot = false,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        TONES[tone].box,
      )}
    >
      {dot && <span aria-hidden className={cn('size-1.5 rounded-full', TONES[tone].dot)} />}
      {children}
    </span>
  );
}
