import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const STYLES: Record<Tone, { box: string; badge: string; icon: LucideIcon }> = {
  info: { box: 'border-info/20 bg-info-soft/70', badge: 'bg-info/10 text-info', icon: Info },
  success: {
    box: 'border-success/20 bg-success-soft/70',
    badge: 'bg-success/10 text-success',
    icon: CheckCircle2,
  },
  warning: {
    box: 'border-warning/25 bg-warning-soft/70',
    badge: 'bg-warning/10 text-warning',
    icon: AlertTriangle,
  },
  danger: {
    box: 'border-danger/20 bg-danger-soft/70',
    badge: 'bg-danger/10 text-danger',
    icon: XCircle,
  },
};

/** Inline feedback next to the thing it is about. Errors interrupt screen readers; others do not. */
export function Alert({
  tone,
  title,
  children,
  className,
}: {
  tone: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { box, badge, icon: Icon } = STYLES[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex animate-[field-error_220ms_ease-out] gap-3 rounded-xl border p-3.5 text-sm',
        box,
        className,
      )}
    >
      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', badge)}>
        <Icon size={17} aria-hidden />
      </span>
      <div className="min-w-0 self-center">
        {title && <p className="text-fg font-semibold">{title}</p>}
        {children && (
          <div className={cn(title && 'mt-0.5', title ? 'text-fg-muted' : 'text-fg')}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
