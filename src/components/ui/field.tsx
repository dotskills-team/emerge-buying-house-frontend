import {
  cloneElement,
  isValidElement,
  useId,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
} from 'react';
import { ChevronDown, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'block w-full rounded-xl border border-border-strong bg-surface px-3.5 text-base text-fg shadow-xs sm:text-sm ' +
  'placeholder:text-fg-subtle transition-[border-color,box-shadow,background-color] duration-(--duration-fast) ' +
  'hover:border-fg-subtle/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 ' +
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-subtle disabled:shadow-none ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-soft/40 ' +
  'aria-[invalid=true]:focus:ring-danger/15';

// 16px text on phones stops iOS from zooming into the field; 14px from the `sm` breakpoint.
export const inputClasses = (className?: string) => cn(controlBase, 'min-h-12 py-2.5', className);

export function Input({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<'input'> & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} className={inputClasses(className)} {...props} />;
}

export function Textarea({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<'textarea'> & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <textarea ref={ref} className={cn(controlBase, 'py-3 leading-relaxed', className)} {...props} />
  );
}

export function Select({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<'select'> & { ref?: Ref<HTMLSelectElement> }) {
  // Native select (best on phones) with our own arrow in place of the browser's.
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          controlBase,
          'min-h-12 cursor-pointer appearance-none py-2.5 pr-10',
          className,
        )}
        {...props}
      />
      <ChevronDown
        size={16}
        aria-hidden
        className="text-fg-subtle pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
      />
    </div>
  );
}

/** A validation message with its icon, under the control it is about. */
export function FieldError({ id, children }: { id?: string; children: string }) {
  return (
    <p
      id={id}
      className="text-danger flex animate-[field-error_180ms_ease-out] items-start gap-1.5 text-sm font-medium"
    >
      <CircleAlert size={15} aria-hidden className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

interface FieldProps {
  label: string;
  /** A single form control. Field wires up its id, aria-invalid and aria-describedby. */
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>;
  hint?: string;
  error?: string;
  /** Shown at the right of the label, e.g. a character counter. */
  aside?: string;
  required?: boolean;
  className?: string;
}

/** Label, control, hint and error message, connected for assistive technology. */
export function Field({ label, children, hint, error, aside, required, className }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })
    : children;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-fg text-sm font-medium">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {' '}
              *
            </span>
          )}
        </label>
        {aside && <span className="text-fg-subtle text-xs">{aside}</span>}
      </div>
      {control}
      {error && <FieldError id={errorId}>{error}</FieldError>}
      {hint && (
        <p id={hintId} className="text-fg-subtle text-xs">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: ComponentPropsWithoutRef<'input'> & { label: string; description?: string }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 py-1', className)}>
      <input
        type="checkbox"
        className="accent-primary mt-0.5 size-4 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      <span className="min-w-0">
        <span className="text-fg block text-sm">{label}</span>
        {description && <span className="text-fg-subtle block text-xs">{description}</span>}
      </span>
    </label>
  );
}
