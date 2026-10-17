import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

/** Shared table styling: tinted header, roomy rows, hover highlight. Data cells use tabular figures. */
export function Table({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return <table className={cn('w-full text-left text-sm', className)} {...props} />;
}

export function THead({ className, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead
      className={cn('bg-surface-muted/70 text-fg-subtle border-border border-b', className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap uppercase first:pl-5 last:pr-5',
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={cn('divide-border divide-y', className)} {...props} />;
}

export function Tr({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={cn(
        'hover:bg-primary-soft/40 transition-colors duration-(--duration-fast)',
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td className={cn('px-4 py-3.5 first:pl-5 last:pr-5', className)} {...props} />;
}
