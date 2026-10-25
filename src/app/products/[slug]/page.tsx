import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  Layers,
  Package,
  Palette,
  Ruler,
  Weight,
  type LucideIcon,
} from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { ProductCard } from '@/components/products/product-card';
import { ProductGalleryViewer } from '@/components/products/product-gallery-viewer';
import { ShareButtons } from '@/components/site/share-buttons';
import { Container } from '@/components/ui/container';
import { SITE } from '@/config/site';
import { PROSE } from '@/features/blog/prose';
import { getPublic } from '@/lib/server-api';
import type { Product, ProductSummary } from '@/types/product';

const loadProduct = cache((slug: string) =>
  getPublic<Product>(`/products/${encodeURIComponent(slug)}`),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return { title: 'Product not found' };
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.summary;
  const image = product.images[0];
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    keywords: product.tags.length ? product.tags : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/products/${product.slug}`,
      siteName: SITE.name,
      images: image ? [{ url: image.url, alt: image.alt || product.name }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
  };
}

/** Product structured data. No price: buyers request quotes. `<` is escaped for safety. */
function jsonLd(p: Product) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.seoDescription || p.summary,
    sku: p.styleCode || undefined,
    category: p.category?.name,
    image: p.images.map((i) => i.url),
    material: p.fabric || undefined,
    color: p.colors.join(', ') || undefined,
    size: p.sizes.join(', ') || undefined,
    brand: { '@type': 'Brand', name: SITE.name },
    url: `${SITE.url}/products/${p.slug}`,
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border-border bg-surface flex items-start gap-3 rounded-2xl border p-4">
      <span className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Icon size={18} aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">{label}</dt>
        <dd className="text-fg mt-0.5 font-semibold">{value}</dd>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, related] = await Promise.all([
    loadProduct(slug),
    getPublic<ProductSummary[]>(`/products/${encodeURIComponent(slug)}/related`).catch(() => null),
  ]);
  if (!product) notFound();

  const facts = [
    product.moq != null && {
      icon: Package,
      label: 'Minimum order',
      value: `${product.moq.toLocaleString()} ${product.moqUnit}`,
    },
    product.leadTime && { icon: Clock, label: 'Lead time', value: product.leadTime },
    product.fabric && { icon: Layers, label: 'Fabric', value: product.fabric },
    product.weight && { icon: Weight, label: 'Weight', value: product.weight },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  const lightboxSpecs = [
    ...facts.map((f) => ({ label: f.label, value: f.value })),
    ...product.specs,
  ];
  const quoteHref = `/contact?product=${encodeURIComponent(
    product.styleCode ? `${product.name} (${product.styleCode})` : product.name,
  )}`;

  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(product) }} />

      <div className="border-border bg-surface border-b">
        <Container>
          <nav aria-label="Breadcrumb" className="py-4">
            <ol className="text-fg-muted flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link href="/" className="hover:text-fg">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <Link href="/products" className="hover:text-fg">
                  Products
                </Link>
              </li>
              {product.category && (
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} aria-hidden />
                  <Link
                    href={`/products?category=${product.category.slug}#catalogue`}
                    className="hover:text-fg"
                  >
                    {product.category.name}
                  </Link>
                </li>
              )}
              <li className="flex min-w-0 items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <span aria-current="page" className="text-fg truncate">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <section className="py-10 sm:py-14 lg:py-16">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGalleryViewer
              images={product.images}
              name={product.name}
              subtitle={product.category?.name}
              description={product.summary}
              specs={lightboxSpecs}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="bg-primary-soft text-primary rounded-full px-3 py-1 text-xs font-semibold">
                  {product.category.name}
                </span>
              )}
              {product.featured && (
                <span className="text-ink-deep rounded-full bg-(image:--gradient-gold) px-3 py-1 text-xs font-semibold">
                  Featured
                </span>
              )}
              {product.styleCode && (
                <span className="text-fg-subtle text-xs font-medium tracking-[0.14em] uppercase">
                  Style {product.styleCode}
                </span>
              )}
            </div>
            <h1 className="font-display text-display text-fg mt-4 font-semibold tracking-tight text-balance">
              {product.name}
            </h1>
            {product.summary && <p className="text-fg-muted mt-4 text-lg">{product.summary}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={quoteHref}
                className="group text-ink-deep shadow-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform"
              >
                Request a quote
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/products#catalogue"
                className="border-border-strong text-fg hover:border-primary hover:text-primary inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold"
              >
                Back to catalogue
              </Link>
            </div>

            {facts.length > 0 && (
              <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {facts.map((f) => (
                  <Fact key={f.label} {...f} />
                ))}
              </dl>
            )}

            {(product.sizes.length > 0 || product.colors.length > 0) && (
              <div className="mt-8 space-y-5">
                {product.sizes.length > 0 && (
                  <div>
                    <p className="text-fg flex items-center gap-2 text-sm font-semibold">
                      <Ruler size={16} aria-hidden className="text-secondary" /> Sizes
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <li
                          key={s}
                          className="border-border bg-surface text-fg inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.colors.length > 0 && (
                  <div>
                    <p className="text-fg flex items-center gap-2 text-sm font-semibold">
                      <Palette size={16} aria-hidden className="text-secondary" /> Colours
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <li
                          key={c}
                          className="bg-surface-muted text-fg-muted rounded-full px-3 py-1.5 text-sm"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {product.certifications.length > 0 && (
              <div className="mt-8">
                <p className="text-fg text-sm font-semibold">Certifications</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.certifications.map((c) => (
                    <li
                      key={c}
                      className="border-primary/20 bg-primary-soft text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium"
                    >
                      <BadgeCheck size={15} aria-hidden /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div className="border-border mt-10 border-t pt-8">
                <h2 className="font-display text-fg text-2xl font-semibold">About this product</h2>
                {/* Sanitized by the backend on save: only allow-listed tags and attributes. */}
                <div
                  className={`${PROSE} mt-2`}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {product.specs.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-fg text-2xl font-semibold">Specifications</h2>
                <dl className="border-border divide-border mt-4 divide-y overflow-hidden rounded-2xl border">
                  {product.specs.map((s, i) => (
                    <div
                      key={`${s.label}-${i}`}
                      className="bg-surface grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 px-5 py-3.5 text-sm odd:bg-(--color-bg)"
                    >
                      <dt className="text-fg-muted">{s.label}</dt>
                      <dd className="text-fg font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="border-border mt-10 flex flex-wrap items-center gap-4 border-t pt-6">
              <p className="text-fg-subtle text-xs font-semibold tracking-[0.2em] uppercase">
                Share
              </p>
              <ShareButtons path={`/products/${product.slug}`} title={product.name} />
            </div>
          </div>
        </Container>
      </section>

      {related && related.length > 0 && (
        <section aria-labelledby="related-products" className="bg-surface-muted py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-secondary inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] uppercase">
                  <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
                  You may also like
                </p>
                <h2
                  id="related-products"
                  className="font-display text-h1 text-fg mt-3 font-semibold tracking-tight"
                >
                  Related products
                </h2>
              </div>
              <Link
                href="/products#catalogue"
                className="text-primary text-sm font-semibold hover:underline"
              >
                View all products
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {related.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </MarketingShell>
  );
}
