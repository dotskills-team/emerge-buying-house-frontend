import { describe, expect, it } from 'vitest';
import { activeHref, breadcrumbsFor } from './navigation';

describe('breadcrumbsFor', () => {
  it('names sidebar pages, creation pages and detail pages', () => {
    expect(breadcrumbsFor('/dashboard').map((c) => c.label)).toEqual(['Overview']);
    expect(breadcrumbsFor('/dashboard/blog/categories').map((c) => c.label)).toEqual([
      'Overview',
      'Blog posts',
      'Blog categories',
    ]);
    expect(breadcrumbsFor('/dashboard/users/new').map((c) => c.label)).toEqual([
      'Overview',
      'Users',
      'Add user',
    ]);
    expect(breadcrumbsFor('/dashboard/blog/6ad339ddc220c080ec1faf54').at(-1)).toEqual({
      href: '/dashboard/blog/6ad339ddc220c080ec1faf54',
      label: 'Edit post',
    });
    expect(
      breadcrumbsFor('/dashboard/blog/6ad339ddc220c080ec1faf54/preview').map((c) => c.label),
    ).toEqual(['Overview', 'Blog posts', 'Edit post', 'Preview']);
  });
});

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
