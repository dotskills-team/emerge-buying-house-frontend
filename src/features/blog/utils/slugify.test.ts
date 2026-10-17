import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('makes URL-safe slugs', () => {
    expect(slugify('  Hello, World! 2026 ')).toBe('hello-world-2026');
  });

  it('keeps Bangla letters instead of dropping them', () => {
    expect(slugify('পোশাক শিল্প')).toBe('পোশাক-শিল্প');
  });
});
