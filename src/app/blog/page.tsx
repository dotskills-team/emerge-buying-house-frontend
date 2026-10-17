import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/feedback/states';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Container } from '@/components/ui/container';
import { getPublic } from '@/lib/server-api';
import { cn, formatDate } from '@/lib/utils';
import type { Category, PostListResult } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'News and practical advice on garment sourcing, production and quality.',
};

const pageHref = (page: number, category?: string) => {
  const qs = new URLSearchParams();
  if (category) qs.set('category', category);
  if (page > 1) qs.set('page', String(page));
  const s = qs.toString();
  return s ? `/blog?${s}` : '/blog';
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const category = params.category?.slice(0, 80);
  const qs = new URLSearchParams({ page: String(page), limit: '9' });
  if (category) qs.set('category', category);

  const [posts, categories] = await Promise.all([
    getPublic<PostListResult>(`/blog/posts?${qs.toString()}`),
    getPublic<Category[]>('/blog/categories', 300),
  ]);

  return (
    <MarketingShell>
      <section className="border-border bg-surface border-b py-12 sm:py-16">
        <Container>
          <p className="text-primary text-sm font-medium">Insights</p>
          <h1 className="text-h1 text-fg mt-2">From the sourcing floor</h1>
          <p className="text-fg-muted mt-3 max-w-2xl">
            News and practical advice on garment sourcing, production and quality.
          </p>
          {categories && categories.length > 0 && (
            <nav aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
              {[{ slug: '', name: 'All' }, ...categories].map((c) => {
                const active = (category ?? '') === c.slug;
                return (
                  <Link
                    key={c.slug || 'all'}
                    href={pageHref(1, c.slug || undefined)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-border text-fg-muted hover:text-fg',
                    )}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {!posts || posts.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No articles yet"
            message={category ? 'There are no articles in this category yet.' : 'Check back soon.'}
          />
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.items.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group border-border bg-surface flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="bg-surface-muted relative aspect-video">
                      {post.coverImage && (
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.alt}
                          fill
                          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-fg-subtle text-xs">
                        {post.category?.name ?? 'Article'} · {formatDate(post.publishedAt)} ·{' '}
                        {post.readingTime} min
                      </p>
                      <h2 className="text-h3 text-fg group-hover:text-primary mt-2">
                        {post.title}
                      </h2>
                      <p className="text-fg-muted mt-2 line-clamp-3 text-sm">{post.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {posts.meta.totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex items-center justify-between text-sm"
              >
                {page > 1 ? (
                  <Link
                    href={pageHref(page - 1, category)}
                    className="text-primary hover:underline"
                  >
                    ← Newer articles
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-fg-muted">
                  Page {posts.meta.page} of {posts.meta.totalPages}
                </span>
                {page < posts.meta.totalPages ? (
                  <Link
                    href={pageHref(page + 1, category)}
                    className="text-primary hover:underline"
                  >
                    Older articles →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </Container>
    </MarketingShell>
  );
}
