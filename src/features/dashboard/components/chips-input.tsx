'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A list of short values typed one by one (Enter or comma adds, Backspace removes the last).
 * Optional suggestions appear as one-click buttons. Duplicates are ignored (case-insensitive).
 */
export function ChipsInput({
  value,
  onChange,
  label,
  placeholder = 'Type and press Enter',
  suggestions = [],
  max = 20,
  maxLength = 40,
  id,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  /** Accessible name of the text box, e.g. "Add a size". */
  label: string;
  placeholder?: string;
  suggestions?: string[];
  max?: number;
  maxLength?: number;
  id?: string;
}) {
  const [draft, setDraft] = useState('');
  const has = (v: string) => value.some((x) => x.toLowerCase() === v.toLowerCase());

  function add(raw: string) {
    const v = raw.replace(/,/g, '').trim().slice(0, maxLength);
    if (!v || has(v) || value.length >= max) return;
    onChange([...value, v]);
    setDraft('');
  }

  const open = suggestions.filter((s) => !has(s));

  return (
    <div className="space-y-2">
      <div className="border-border-strong bg-surface focus-within:border-primary flex flex-wrap gap-1.5 rounded-lg border p-1.5">
        {value.map((v) => (
          <span
            key={v}
            className="bg-primary-soft text-primary inline-flex items-center gap-1 rounded-md py-1 pr-1 pl-2.5 text-xs font-medium"
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(value.filter((x) => x !== v))}
              className="hover:bg-primary rounded-sm p-0.5 hover:text-white"
            >
              <X size={12} aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add(draft);
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          disabled={value.length >= max}
          placeholder={value.length >= max ? 'Limit reached' : placeholder}
          aria-label={label}
          className="text-fg placeholder:text-fg-subtle min-h-8 min-w-28 flex-1 bg-transparent px-1.5 text-base outline-none sm:text-sm"
        />
      </div>
      {open.length > 0 && value.length < max && (
        <div className="flex flex-wrap gap-1.5">
          {open.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className={cn(
                'border-border text-fg-muted hover:border-primary/40 hover:text-primary inline-flex min-h-7 items-center gap-1 rounded-full border border-dashed px-2.5 text-xs transition-colors',
              )}
            >
              <Plus size={11} aria-hidden /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
