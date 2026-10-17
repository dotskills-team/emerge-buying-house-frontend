import { AlertTriangle, Inbox, Loader2, ShieldOff, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function StatePanel({
  icon: Icon,
  title,
  message,
  action,
  role,
  className,
}: {
  icon: LucideIcon;
  title: string;
  message?: ReactNode;
  action?: ReactNode;
  role?: 'alert' | 'status';
  className?: string;
}) {
  return (
    <div role={role} className={cn('mx-auto max-w-md px-4 py-12 text-center', className)}>
      <span className="bg-surface-muted text-fg-muted mx-auto flex size-12 items-center justify-center rounded-full">
        <Icon size={22} aria-hidden />
      </span>
      <h2 className="text-h3 text-fg mt-4">{title}</h2>
      {message && <p className="text-fg-muted mt-2 text-sm">{message}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function FullPageLoader({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-svh place-items-center px-4">
      <p className="text-fg-muted flex items-center gap-3 text-sm">
        <Loader2 size={18} className="text-primary animate-spin" aria-hidden />
        {label}
      </p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <StatePanel
      role="alert"
      icon={AlertTriangle}
      title={title}
      message={message}
      className={className}
      action={
        onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}

export function EmptyState({
  title,
  message,
  action,
  icon = Inbox,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return <StatePanel icon={icon} title={title} message={message} action={action} />;
}

/** Shown when the signed-in user lacks the permission a page needs. */
export function ForbiddenState({ message }: { message?: string }) {
  return (
    <StatePanel
      role="alert"
      icon={ShieldOff}
      title="You do not have access to this page"
      message={message ?? 'Ask an administrator if you need this permission.'}
      action={
        <ButtonLink href="/dashboard" variant="secondary">
          Go to overview
        </ButtonLink>
      }
    />
  );
}
