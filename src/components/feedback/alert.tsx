import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const STYLES: Record<Tone, { box: string; icon: LucideIcon }> = {
  info: { box: 'border-info/25 bg-info-soft text-info', icon: Info },
  success: { box: 'border-success/25 bg-success-soft text-success', icon: CheckCircle2 },
  warning: { box: 'border-warning/25 bg-warning-soft text-warning', icon: AlertTriangle },
  danger: { box: 'border-danger/25 bg-danger-soft text-danger', icon: XCircle },
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
  const { box, icon: Icon } = STYLES[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-md border px-4 py-3 text-sm', box, className)}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5', 'text-fg')}>{children}</div>}
      </div>
    </div>
  );
}
