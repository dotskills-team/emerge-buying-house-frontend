'use client';

import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastTone } from '@/store/toast-store';
import { cn } from '@/lib/utils';

const ICONS: Record<ToastTone, { icon: typeof Info; badge: string; bar: string }> = {
  success: { icon: CheckCircle2, badge: 'bg-success/10 text-success', bar: 'bg-success' },
  error: { icon: XCircle, badge: 'bg-danger/10 text-danger', bar: 'bg-danger' },
  info: { icon: Info, badge: 'bg-info/10 text-info', bar: 'bg-info' },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-(--z-toast) flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end"
    >
      {toasts.map((t) => {
        const { icon: Icon, badge, bar } = ICONS[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className="border-border bg-surface text-fg pointer-events-auto relative flex w-full max-w-sm animate-[toast-in_260ms_cubic-bezier(0.22,1,0.36,1)] items-center gap-3 overflow-hidden rounded-xl border py-3 pr-3 pl-4 text-sm shadow-lg"
          >
            <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1', bar)} />
            <span
              className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', badge)}
            >
              <Icon size={17} aria-hidden />
            </span>
            <p className="min-w-0 flex-1 font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-fg-subtle hover:bg-surface-muted hover:text-fg rounded-md p-1.5 transition-colors"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
