'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function TagsInput({
  value,
  onChange,
  disabled = false,
  max = 10,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  max?: number;
}) {
  const [draft, setDraft] = useState('');

  function add(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/,/g, '').slice(0, 40);
    if (!tag || value.includes(tag) || value.length >= max) return;
    onChange([...value, tag]);
    setDraft('');
  }

  return (
    <div className="border-border-strong bg-surface focus-within:border-primary flex flex-wrap gap-2 rounded-md border p-2">
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-surface-muted text-fg inline-flex items-center gap-1 rounded-sm py-1 pr-1 pl-2.5 text-xs"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="hover:bg-fg hover:text-fg-inverse rounded-sm p-0.5"
            >
              <X size={12} aria-hidden />
            </button>
          )}
        </span>
      ))}
      <input
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
        disabled={disabled || value.length >= max}
        placeholder={value.length >= max ? 'Tag limit reached' : 'Add a tag and press Enter'}
        aria-label="Add a tag"
        className="text-fg placeholder:text-fg-subtle min-h-8 min-w-32 flex-1 bg-transparent px-1 text-base outline-none sm:text-sm"
      />
    </div>
  );
}
