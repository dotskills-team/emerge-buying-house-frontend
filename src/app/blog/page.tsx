import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, ChevronRight, FileText, Rss, Search, X } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { EmptyState } from '@/components/feedback/states';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { PageHero } from '@/components/site/page-hero';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';
import { getPublic } from '@/lib/server-api';
import { cn } from '@/lib/utils';
import type { CategoryWithCount, PostListResult, TagCount } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description:
    'Practical articles on garment sourcing, product development, quality assurance and responsible production from the Emerge Buying House team.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
};

const PAGE_SIZE = 9;

interface Filters {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
}

/** Builds a /blog URL, keeping the other filters. Page 1 and empty values are left out. */
function blogHref(current: Filters, change: Filters) {
  const next = { ...current, page: undefined, ...change };
  const qs = new URLSearchParams();
  if (next.q) qs.set('q', next.q);
  if (next.category) qs.set('category', next.category);
  if (next.tag) qs.set('tag', next.tag);
  if (next.page && next.page > 1) qs.set('page', String(next.page));
  const s = qs.toString();
  return s ? `/blog?${s}` : '/blog';
}

/** 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - (sorted[i - 1] ?? p) > 1 ? ['gap', p] : [p])) as (
    number | 'gap'
  )[];
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const filters: Filters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    category: params.category?.slice(0, 80) || undefined,
    tag: params.tag?.trim().toLowerCase().slice(0, 40) || undefined,
    page: Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1),
  };
  const page = filters.page ?? 1;
  const filtered = Boolean(filters.q || filters.category || filters.tag);
  // The featured article only leads the unfiltered first page.
  const showFeatured = !filtered && page === 1;

  const [featuredRes, categories, tags] = await Promise.all([
    showFeatured ? getPublic<PostListResult>('/blog/posts?featured=true&limit=1') : null,
    getPublic<CategoryWithCount[]>('/blog/categories', 300),
    getPublic<TagCount[]>('/blog/tags', 300),
  ]);
  const featured = featuredRes?.items[0] ?? null;

  const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (filters.q) qs.set('q', filters.q);
  if (filters.category) qs.set('category', filters.category);
  if (filters.tag) qs.set('tag', filters.tag);
  if (featured) qs.set('exclude', featured.slug);
  const posts = await getPublic<PostListResult>(`/blog/posts?${qs.toString()}`);

  const activeCategory = categories?.find((c) => c.slug === filters.category);
  const visibleCategories = (categories ?? []).filter((c) => c.postCount > 0);
  const totalPages = posts?.meta.totalPages ?? 1;

  return (
    <MarketingShell>
      <PageHero
        title="Blog & insights"
        lead="Field notes on sourcing, quality and responsible production, written by the people who work on the factory floor."
        image={IMG.fabricRolls}
        crumbs={[{ label: 'Blog' }]}
      />

      {/* Filter bar */}
      <section className="border-border bg-surface sticky top-[4.5rem] z-20 border-b shadow-xs">
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <form action="/blog" role="search" className="relative lg:w-80 lg:shrink-0">
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            {filters.tag && <input type="hidden" name="tag" value={filters.tag} />}
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search
              size={16}
              aria-hidden
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              id="blog-search"
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Search articles"
              className="border-border-strong bg-bg text-fg placeholder:text-fg-subtle focus:border-primary h-11 w-full rounded-full border pr-4 pl-10 text-sm outline-none"
            />
          </form>
          {visibleCategories.length > 0 && (
            <nav
              aria-label="Categories"
              className="-mx-(--page-gutter) flex gap-2 overflow-x-auto px-(--page-gutter) pb-1 lg:mx-0 lg:px-0 lg:pb-0"
            >
              {[{ slug: '', name: 'All', postCount: 0 }, ...visibleCategories].map((c) => {
                const active = (filters.category ?? '') === c.slug;
                return (
                  <Link
                    key={c.slug || 'all'}
                    href={blogHref(filters, { category: c.slug || undefined })}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border-border text-fg-muted hover:border-primary/40 hover:text-fg',
                    )}
                  >
                    {c.name}
                    {c.slug && (
                      <span className={cn('text-xs', active ? 'text-white/75' : 'text-fg-subtle')}>
                        {c.postCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {featured && (
          <div className="mb-12 sm:mb-16">
            <PostCard post={featured} featured priority />
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:gap-16">
          <div className="min-w-0">
            {filtered && (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <p className="text-fg-muted text-sm" aria-live="polite">
                  {posts?.meta.total ?? 0} {posts?.meta.total === 1 ? 'article' : 'articles'}
                  {filters.q && (
                    <>
                      {' '}
                      for <strong className="text-fg">“{filters.q}”</strong>
                    </>
                  )}
                  {activeCategory && (
                    <>
                      {' '}
                      in <strong className="text-fg">{activeCategory.name}</strong>
                    </>
                  )}
                  {filters.tag && (
                    <>
                      {' '}
                      tagged <strong className="text-fg">#{filters.tag}</strong>
                    </>
                  )}
                </p>
                <Link
                  href="/blog"
                  className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  <X size={14} aria-hidden /> Clear filters
                </Link>
              </div>
            )}

            {!posts || posts.items.length === 0 ? (
              featured ? null : (
                <EmptyState
                  icon={FileText}
                  title={filtered ? 'No articles found' : 'No articles yet'}
                  message={
                    filtered
                      ? 'Try another search, category or tag.'
                      : 'Our first articles are on their way. Check back soon.'
                  }
                />
              )
            ) : (
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.items.map((post, i) => (
                  <li key={post.id}>
                    <PostCard post={post} priority={!featured && i < 2} />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                {page > 1 && (
                  <Link
                    href={blogHref(filters, { page: page - 1 })}
                    aria-label="Previous page"
                    className="border-border text-fg hover:border-primary hover:text-primary flex size-11 items-center justify-center rounded-full border"
                  >
                    <ChevronLeft size={18} aria-hidden />
                  </Link>
                )}
                {pageList(page, totalPages).map((p, i) =>
                  p === 'gap' ? (
                    <span key={`gap-${i}`} className="text-fg-subtle px-1" aria-hidden>
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={blogHref(filters, { page: p })}
                      aria-current={p === filters.page ? 'page' : undefined}
                      aria-label={`Page ${p}`}
                      className={cn(
                        'flex size-11 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors',
                        p === filters.page
                          ? 'bg-primary shadow-glow text-white'
                          : 'text-fg-muted hover:bg-surface-muted hover:text-fg',
                      )}
                    >
                      {p}
                    </Link>
                  ),
                )}
                {page < totalPages && (
                  <Link
                    href={blogHref(filters, { page: page + 1 })}
                    aria-label="Next page"
                    className="border-border text-fg hover:border-primary hover:text-primary flex size-11 items-center justify-center rounded-full border"
                  >
                    <ChevronRight size={18} aria-hidden />
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-40 lg:self-start">
            {visibleCategories.length > 0 && (
              <div className="border-border bg-surface rounded-3xl border p-6 shadow-sm">
                <h2 className="font-display text-fg text-lg font-semibold">Categories</h2>
                <ul className="mt-4 space-y-1">
                  {visibleCategories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={blogHref(filters, { category: c.slug })}
                        aria-current={filters.category === c.slug ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                          filters.category === c.slug
                            ? 'bg-primary-soft text-primary font-semibold'
                            : 'text-fg-muted hover:bg-surface-muted hover:text-fg',
                        )}
                      >
                        {c.name}
                        <span className="text-fg-subtle text-xs tabular-nums">{c.postCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="border-border bg-surface rounded-3xl border p-6 shadow-sm">
                <h2 className="font-display text-fg text-lg font-semibold">Popular tags</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <li key={t.tag}>
                      <Link
                        href={blogHref(filters, { tag: filters.tag === t.tag ? undefined : t.tag })}
                        aria-current={filters.tag === t.tag ? 'page' : undefined}
                        className={cn(
                          'inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors',
                          filters.tag === t.tag
                            ? 'border-primary bg-primary text-white'
                            : 'border-border text-fg-muted hover:border-primary/40 hover:text-fg',
                        )}
                      >
                        #{t.tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-brand-weave relative overflow-hidden rounded-3xl p-6 text-white shadow-lg">
              <div aria-hidden className="bg-grain absolute inset-0" />
              <div className="relative">
                <Rss size={22} aria-hidden className="text-gold-light" />
                <h2 className="font-display mt-3 text-lg font-semibold">Never miss an article</h2>
                <p className="mt-2 text-sm text-white/80">
                  Follow new posts in any feed reader with our RSS feed.
                </p>
                <a
                  href="/blog/rss.xml"
                  className="text-ink-deep shadow-gold mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-(image:--gradient-gold) px-5 text-sm font-semibold"
                >
                  <Rss size={15} aria-hidden /> RSS feed
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </MarketingShell>
  );
}
