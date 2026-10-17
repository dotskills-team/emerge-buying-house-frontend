import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn('border-border bg-surface rounded-lg border shadow-sm', className)}
      {...props}
    />
  );
}

/** A card with a titled header and padded body: the standard settings/form section. */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <header className="border-border flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-h3 text-fg">{title}</h2>
          {description && <p className="text-fg-muted mt-0.5 text-sm">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </Card>
  );
}
