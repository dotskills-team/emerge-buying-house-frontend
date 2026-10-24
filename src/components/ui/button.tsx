import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'glass' | 'gold';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-on-fill shadow-sm hover:bg-primary-hover hover:shadow-glow active:translate-y-px',
  secondary:
    'border border-border-strong bg-surface text-fg shadow-sm hover:border-fg-subtle/40 hover:bg-surface-muted active:translate-y-px',
  ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
  danger: 'bg-danger text-on-fill shadow-sm hover:bg-danger-hover active:translate-y-px',
  inverse: 'bg-surface text-fg shadow-sm hover:bg-primary-soft active:translate-y-px',
  /** Secondary action on dark or gradient backgrounds. */
  glass:
    'border border-white/30 bg-white/10 text-fg-inverse hover:bg-white/20 active:translate-y-px',
  /** Premium call to action (gold on dark panels). */
  gold: 'bg-(image:--gradient-gold) text-ink-deep shadow-gold hover:brightness-105 active:translate-y-px',
};

// Every size keeps at least a 40px touch target; `md` and up meet the 44px guideline.
const SIZES: Record<Size, string> = {
  sm: 'min-h-10 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-sm gap-2',
  lg: 'min-h-12 px-6 text-base gap-2',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-(--duration-fast) select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

/** Square icon-only button. `label` is required so screen readers announce it. */
export function IconButton({
  label,
  tone = 'default',
  className,
  type = 'button',
  ...props
}: ComponentPropsWithoutRef<'button'> & { label: string; tone?: 'default' | 'danger' }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-md transition-colors duration-(--duration-fast)',
        'disabled:pointer-events-none disabled:opacity-40',
        tone === 'danger'
          ? 'text-danger hover:bg-danger-soft'
          : 'text-fg-muted hover:bg-surface-muted hover:text-fg',
        className,
      )}
      {...props}
    />
  );
}
