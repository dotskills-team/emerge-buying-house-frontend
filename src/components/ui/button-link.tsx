import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'outline';

const styles: Record<Variant, string> = {
  solid: 'bg-navy-900 text-white hover:bg-navy-700',
  outline: 'border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white',
};

export function ButtonLink({
  variant = 'solid',
  className,
  ...props
}: ComponentPropsWithoutRef<'a'> & { variant?: Variant }) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium transition-colors',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
