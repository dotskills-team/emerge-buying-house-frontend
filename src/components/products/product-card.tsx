import Link from 'next/link';
import { ArrowUpRight, Clock, Images, Package, Shirt } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { cn } from '@/lib/utils';
import type { ProductSummary } from '@/types/product';

/** Catalogue card: the cover photo, and the second photo on hover when there is one. */
export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductSummary;
  priority?: boolean;
  className?: string;
}) {
  const [cover, alt] = product.images;
  const sizes =
    '(min-width: 1536px) 22rem, (min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw';
  return (
    <article
      className={cn(
        'group bg-surface border-border hover:border-primary/30 relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      <div className="bg-surface-muted relative aspect-[4/5] overflow-hidden">
        {cover ? (
          <>
            <MediaImage
              src={cover.url}
              blur={cover.blur}
              alt={cover.alt || product.name}
              fill
              priority={priority}
              sizes={sizes}
              className={cn(
                'object-cover transition duration-700 group-hover:scale-105',
                alt && 'group-hover:opacity-0',
              )}
            />
            {alt && (
              <MediaImage
                src={alt.url}
                alt=""
                fill
                sizes={sizes}
                className="scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="bg-brand-weave absolute inset-0 flex items-center justify-center">
            <Shirt aria-hidden className="text-gold-light/60 size-14" strokeWidth={1.1} />
          </div>
        )}
        <span
          aria-hidden
          className="from-ink-deep/60 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {product.category && (
            <span className="bg-surface/95 text-primary rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              {product.category.name}
            </span>
          )}
          {product.featured && (
            <span className="text-ink-deep shadow-gold rounded-full bg-(image:--gradient-gold) px-3 py-1 text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <span className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Images size={12} aria-hidden /> {product.images.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {product.styleCode && (
          <p className="text-fg-subtle text-xs font-medium tracking-[0.14em] uppercase">
            {product.styleCode}
          </p>
        )}
        <h3 className="font-display text-fg group-hover:text-primary mt-1 text-xl leading-snug font-semibold tracking-tight transition-colors">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        {product.summary && (
          <p className="text-fg-muted mt-2 line-clamp-2 text-sm">{product.summary}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {product.moq != null && (
            <span className="bg-surface-muted text-fg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
              <Package size={12} aria-hidden /> MOQ {product.moq.toLocaleString()}
            </span>
          )}
          {product.leadTime && (
            <span className="bg-surface-muted text-fg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
              <Clock size={12} aria-hidden /> {product.leadTime}
            </span>
          )}
          <span className="text-primary ml-auto inline-flex items-center gap-1 text-sm font-semibold">
            Details
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
