'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemePreference } from './theme';
import { useTheme } from './use-theme';

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: LucideIcon }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const ICON: Record<ThemePreference, LucideIcon> = { light: Sun, dark: Moon, system: Monitor };

/**
 * Icon button that opens a small Light / Dark / System menu. `onDark` styles it for dark
 * headers (website hero, top bar); otherwise it follows the theme.
 */
export function ThemeToggle({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const Icon = ICON[preference];

  useEffect(() => {
    if (!open) return;
    const selected = OPTIONS.findIndex((o) => o.value === preference);
    itemRefs.current[selected]?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
    // Focus moves only when the menu opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function choose(value: ThemePreference) {
    setPreference(value);
    setOpen(false);
    rootRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onKeyDown={(e) => {
        if (!open) return;
        const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === 'Escape') {
          e.stopPropagation();
          setOpen(false);
          rootRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const step = e.key === 'ArrowDown' ? 1 : -1;
          items[(index + step + items.length) % items.length]?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-label={`Theme: ${OPTIONS.find((o) => o.value === preference)?.label}. Change theme`}
        title="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-full transition-colors',
          onDark
            ? 'text-white/80 hover:bg-white/10 hover:text-white'
            : 'text-fg-muted hover:bg-surface-muted hover:text-fg',
        )}
      >
        <Icon size={18} aria-hidden />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Theme"
          className="border-border bg-surface absolute top-full right-0 z-(--z-modal) mt-2 w-40 rounded-xl border p-1 shadow-lg"
        >
          {OPTIONS.map(({ value, label, icon: ItemIcon }, i) => {
            const selected = value === preference;
            return (
              <button
                key={value}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(value)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  selected
                    ? 'bg-primary-soft text-primary font-medium'
                    : 'text-fg hover:bg-surface-muted',
                )}
              >
                <ItemIcon size={16} aria-hidden />
                <span className="flex-1 text-left">{label}</span>
                {selected && <Check size={15} aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Light / Dark / System as three side-by-side buttons, for menus with room (mobile drawer). */
export function ThemeSegmented({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        'border-border bg-surface-muted grid grid-cols-3 gap-1 rounded-xl border p-1',
        className,
      )}
    >
      {OPTIONS.map(({ value, label, icon: ItemIcon }) => {
        const selected = value === preference;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPreference(value)}
            className={cn(
              'flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-sm transition-colors',
              selected ? 'bg-surface text-fg font-medium shadow-sm' : 'text-fg-muted hover:text-fg',
            )}
          >
            <ItemIcon size={15} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
