import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

/** Content width for the public website; sections themselves run edge to edge. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-(--container-site) px-(--page-gutter)', className)}
      {...props}
    />
  );
}
