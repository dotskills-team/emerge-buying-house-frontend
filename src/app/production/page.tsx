import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  PackageCheck,
  Ruler,
  ScanSearch,
  Scissors,
  Search,
  Shirt,
  X,
} from 'lucide-react';
import { ProcessTimeline } from '@/components/home/home-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { ProductCard } from '@/components/products/product-card';
import { FeatureGrid, MetricsBand } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';
import { getPublic } from '@/lib/server-api';
import { cn } from '@/lib/utils';
import type { ProductCategory, ProductListResult } from '@/types/product';

export const metadata: Metadata = {
  title: 'Production',
  description:
    'Products and production capabilities of Emerge Buying House: knitwear, woven, denim, fabrics and finishing.',
  alternates: { canonical: '/production' },
};

const PAGE_SIZE = 12;

interface Filters {
  category?: string;
  q?: string;
  page?: number;
}

function href(current: Filters, change: Filters) {
  const next = { ...current, page: undefined, ...change };
  const qs = new URLSearchParams();
  if (next.category) qs.set('category', next.category);
  if (next.q) qs.set('q', next.q);
  if (next.page && next.page > 1) qs.set('page', String(next.page));
  const s = qs.toString();
  return s ? `/production?${s}#catalogue` : '/production#catalogue';
}

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filters: Filters = {
    category: params.category?.slice(0, 80) || undefined,
    q: params.q?.trim().slice(0, 100) || undefined,
  };
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);

  const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (filters.category) qs.set('category', filters.category);
  if (filters.q) qs.set('q', filters.q);

  // A slow or unavailable API should not take the whole page down.
  const [products, categories] = await Promise.all([
    getPublic<ProductListResult>(`/products?${qs.toString()}`).catch(() => null),
    getPublic<ProductCategory[]>('/products/categories', 300).catch(() => null),
  ]);
  const visibleCategories = (categories ?? []).filter((c) => c.productCount > 0);
  const total = visibleCategories.reduce((n, c) => n + c.productCount, 0);
  const filtered = Boolean(filters.category || filters.q);
  const totalPages = products?.meta.totalPages ?? 1;
  const active = categories?.find((c) => c.slug === filters.category);

  return (
    <MarketingShell>
      <PageHero
        title="Production"
        lead="Explore what we make. Open any product to see every angle, zoom into the fabric and check the specifications."
        image={IMG.heroSewing}
        crumbs={[{ label: 'Production' }]}
      />

      <section id="catalogue" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Product catalogue"
              title="Quality you can inspect up close."
              lead={
                active?.description ||
                'Filter by category, then open a product for its photos, specifications and minimum order.'
              }
            />
            <form action="/production#catalogue" role="search" className="relative w-full lg:w-80">
              {filters.category && <input type="hidden" name="category" value={filters.category} />}
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <Search
                size={16}
                aria-hidden
                className="text-fg-subtle pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
              />
              <input
                id="product-search"
                type="search"
                name="q"
                defaultValue={filters.q}
                placeholder="Search products"
                className="border-border-strong bg-surface text-fg placeholder:text-fg-subtle focus:border-primary h-12 w-full rounded-full border pr-4 pl-10 text-sm shadow-xs outline-none"
              />
            </form>
          </div>

          {visibleCategories.length > 0 && (
            <nav
              aria-label="Product categories"
              className="-mx-(--page-gutter) mt-10 flex gap-2 overflow-x-auto px-(--page-gutter) pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              {[{ slug: '', name: 'All', productCount: total }, ...visibleCategories].map((c) => {
                const on = (filters.category ?? '') === c.slug;
                return (
                  <Link
                    key={c.slug || 'all'}
                    href={href(filters, { category: c.slug || undefined })}
                    aria-current={on ? 'page' : undefined}
                    scroll={false}
                    className={cn(
                      'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors',
                      on
                        ? 'border-transparent bg-(image:--gradient-brand) text-white shadow-md'
                        : 'border-border bg-surface text-fg-muted hover:border-primary/30 hover:text-fg',
                    )}
                  >
                    {c.name}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs tabular-nums',
                        on ? 'bg-white/20' : 'bg-surface-muted',
                      )}
                    >
                      {c.productCount}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}

          {filtered && (
            <p className="text-fg-muted mt-6 flex flex-wrap items-center gap-3 text-sm">
              {products?.meta.total ?? 0} {products?.meta.total === 1 ? 'product' : 'products'}
              {filters.q && <> for “{filters.q}”</>}
              {active && <> in {active.name}</>}
              <Link
                href="/production#catalogue"
                className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
              >
                <X size={14} aria-hidden /> Clear
              </Link>
            </p>
          )}

          {!products || products.items.length === 0 ? (
            <div className="border-border bg-surface mt-10 flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center">
              <span className="bg-primary-soft text-primary flex size-14 items-center justify-center rounded-2xl">
                <Shirt size={26} aria-hidden />
              </span>
              <h3 className="font-display text-fg mt-5 text-2xl font-semibold">
                {filtered ? 'No products found' : 'Our catalogue is being updated'}
              </h3>
              <p className="text-fg-muted mt-2 max-w-md">
                {filtered
                  ? 'Try another category or search term.'
                  : 'New products are on their way. Tell us what you are looking for and we will send options.'}
              </p>
              <Link
                href={filtered ? '/production#catalogue' : '/contact'}
                className="bg-primary hover:bg-primary-hover text-on-fill mt-6 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold"
              >
                {filtered ? 'Show all products' : 'Request options'}
              </Link>
            </div>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.items.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link
                  href={href(filters, { page: page - 1 })}
                  aria-label="Previous page"
                  className="border-border hover:border-primary hover:text-primary flex size-11 items-center justify-center rounded-full border"
                >
                  <ChevronLeft size={18} aria-hidden />
                </Link>
              )}
              <span className="text-fg-muted text-sm tabular-nums">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={href(filters, { page: page + 1 })}
                  aria-label="Next page"
                  className="border-border hover:border-primary hover:text-primary flex size-11 items-center justify-center rounded-full border"
                >
                  <ChevronRight size={18} aria-hidden />
                </Link>
              )}
            </nav>
          )}
        </Container>
      </section>

      <MetricsBand
        items={[
          { value: '40K', label: 'Pieces a day across our network' },
          { value: 'AQL 2.5', label: 'Final inspection standard' },
          { value: '< 1.5%', label: 'Target defect rate' },
        ]}
      />

      <FeatureGrid
        eyebrow="Capabilities"
        title="Everything a garment needs, under one plan."
        columns={3}
        items={[
          {
            icon: Shirt,
            title: 'Product development',
            body: 'Tech packs, fits and sampling until every detail is approved.',
          },
          {
            icon: Scissors,
            title: 'Cutting & sewing',
            body: 'Automatic cutting and balanced lines for basics and fashion.',
          },
          {
            icon: Ruler,
            title: 'Measurement control',
            body: 'Graded specs checked on every size, at every stage.',
          },
          {
            icon: ScanSearch,
            title: 'Inline inspection',
            body: 'Defects caught at the operation that causes them.',
          },
          {
            icon: Gauge,
            title: 'Capacity planning',
            body: 'Fabric and lines booked ahead to protect delivery dates.',
          },
          {
            icon: PackageCheck,
            title: 'Finishing & packing',
            body: 'Needle detection, pressing and retail-ready packing.',
          },
        ]}
      />

      <ProcessTimeline />
    </MarketingShell>
  );
}
