import { describe, expect, it } from 'vitest';
import { cn, toQuery } from './utils';

describe('cn', () => {
  it('lets later classes override conflicting earlier ones', () => {
    expect(cn('px-4 min-h-11', 'px-0')).toBe('min-h-11 px-0');
    expect(cn('bg-primary text-fg-inverse', 'bg-transparent')).toBe(
      'text-fg-inverse bg-transparent',
    );
  });

  it('keeps a custom font size and a text color together', () => {
    expect(cn('text-h1 text-fg')).toBe('text-h1 text-fg');
    expect(cn('text-fg-muted', 'text-danger')).toBe('text-danger');
  });
});

describe('toQuery', () => {
  it('skips empty and false values', () => {
    expect(toQuery({ q: '', page: 2, trash: false, status: 'draft', x: undefined })).toBe(
      '?page=2&status=draft',
    );
    expect(toQuery({})).toBe('');
  });
});
