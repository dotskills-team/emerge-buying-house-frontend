'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef, type Ref } from 'react';
import { cn } from '@/lib/utils';
import { inputClasses } from './field';

/** A password field with a button that shows or hides what was typed. Works inside <Field>. */
export function PasswordInput({
  className,
  ref,
  ...props
}: Omit<ComponentPropsWithoutRef<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        spellCheck={false}
        autoCapitalize="none"
        className={inputClasses(cn('pr-12', className))}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="text-fg-subtle hover:text-fg absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg"
      >
        {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  );
}
