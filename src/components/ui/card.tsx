import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn('border-border bg-surface rounded-xl border shadow-sm', className)}
      {...props}
    />
  );
}

/** A card with a titled header and padded body: the standard settings/form/panel section. */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card className={className}>
      <header className="border-border flex flex-wrap items-start justify-between gap-3 border-b px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-fg text-base font-semibold">{title}</h2>
          {description && <p className="text-fg-muted mt-0.5 text-sm">{description}</p>}
        </div>
        {actions}
      </header>
      <div className={cn('p-4 sm:p-5', bodyClassName)}>{children}</div>
    </Card>
  );
}
