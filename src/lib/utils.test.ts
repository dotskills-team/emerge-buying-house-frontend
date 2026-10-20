import { describe, expect, it } from 'vitest';
import { cn, formatRelative, toQuery } from './utils';

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

describe('formatRelative', () => {
  const now = Date.parse('2026-10-20T12:00:00Z');
  const ago = (ms: number) => new Date(now - ms).toISOString();
  it('says how long ago, then falls back to the date', () => {
    expect(formatRelative(ago(20_000), now)).toBe('just now');
    expect(formatRelative(ago(5 * 60_000), now)).toBe('5 minutes ago');
    expect(formatRelative(ago(3 * 3_600_000), now)).toBe('3 hours ago');
    expect(formatRelative(ago(26 * 3_600_000), now)).toBe('yesterday');
    expect(formatRelative(ago(10 * 86_400_000), now)).toBe('10 Oct 2026');
    expect(formatRelative(null, now)).toBe('—');
  });
});
