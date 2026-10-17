import { describe, expect, it } from 'vitest';
import { activeHref } from './navigation';

const hrefs = ['/dashboard', '/dashboard/blog', '/dashboard/blog/categories', '/dashboard/users'];

describe('activeHref', () => {
  it('picks the most specific matching entry', () => {
    expect(activeHref('/dashboard/blog/categories', hrefs)).toBe('/dashboard/blog/categories');
    expect(activeHref('/dashboard/blog/123', hrefs)).toBe('/dashboard/blog');
    expect(activeHref('/dashboard', hrefs)).toBe('/dashboard');
  });

  it('does not match on a shared prefix that is not a path segment', () => {
    expect(activeHref('/dashboard/users-archive', hrefs)).toBe('/dashboard');
  });
});
