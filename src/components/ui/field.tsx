import {
  cloneElement,
  isValidElement,
  useId,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
} from 'react';
import { cn } from '@/lib/utils';

const controlBase =
  'block w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-fg sm:text-sm ' +
  'placeholder:text-fg-subtle transition-colors duration-(--duration-fast) ' +
  'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25 ' +
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-subtle ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:outline-danger/25';

// 16px text on phones stops iOS from zooming into the field; 14px from the `sm` breakpoint.
export const inputClasses = (className?: string) => cn(controlBase, 'min-h-11 py-2', className);

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
  return <textarea ref={ref} className={cn(controlBase, 'py-2.5', className)} {...props} />;
}

export function Select({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<'select'> & { ref?: Ref<HTMLSelectElement> }) {
  return (
    <select ref={ref} className={cn(controlBase, 'min-h-11 py-2 pr-8', className)} {...props} />
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
    <div className={cn('space-y-1.5', className)}>
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
      {error && (
        <p id={errorId} className="text-danger text-sm">
          {error}
        </p>
      )}
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
