'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize2, ZoomIn } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCTS, type ProductCategory } from '@/content/products';
import { cn } from '@/lib/utils';
import { ImageLightbox, type LightboxItem } from './image-lightbox';

type Filter = 'All' | ProductCategory;

/** Filterable product grid; any card opens the zoomable viewer. `?item=<id>` opens one directly. */
export function ProductGallery() {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    const id = params.get('item');
    const i = PRODUCTS.findIndex((p) => p.id === id);
    return i >= 0 ? i : null;
  });

  const visible = useMemo(
    () => (filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  );
  // The viewer browses the products currently shown by the filter, in the same order.
  const items: LightboxItem[] = useMemo(
    () =>
      visible.map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: p.category,
        description: p.details,
        specs: p.specs,
        image: p.image,
      })),
    [visible],
  );

  const counts = useMemo(() => {
    const c = new Map<Filter, number>([['All', PRODUCTS.length]]);
    for (const p of PRODUCTS) c.set(p.category, (c.get(p.category) ?? 0) + 1);
    return c;
  }, []);

  function close() {
    setOpenIndex(null);
    if (params.get('item')) router.replace('/production', { scroll: false });
  }

  return (
    <>
      <div
        role="toolbar"
        aria-label="Filter products"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible"
      >
        {(['All', ...PRODUCT_CATEGORIES] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors',
              filter === f
                ? 'border-transparent bg-(image:--gradient-brand) text-white shadow-md'
                : 'border-border bg-surface text-fg-muted hover:text-fg hover:border-primary/30',
            )}
          >
            {f}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs tabular-nums',
                filter === f ? 'bg-white/20' : 'bg-surface-muted',
              )}
            >
              {counts.get(f) ?? 0}
            </span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <article className="group bg-surface border-border hover:border-primary/30 h-full overflow-hidden rounded-3xl border shadow-sm transition-shadow hover:shadow-lg">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Zoom into ${p.name}`}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    aria-hidden
                    className="from-ink-deep/70 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="text-primary absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-110"
                  >
                    <ZoomIn size={20} />
                  </span>
                  <span className="text-fg absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm">
                    {p.category}
                  </span>
                </button>
                <div className="p-5 sm:p-6">
                  <h3 className="text-fg text-lg font-semibold">{p.name}</h3>
                  <p className="text-fg-muted mt-2 text-sm">{p.details}</p>
                  <dl className="mt-4 flex flex-wrap gap-2">
                    {p.specs.slice(0, 2).map((s) => (
                      <div
                        key={s.label}
                        className="bg-surface-muted rounded-lg px-3 py-1.5 text-xs"
                      >
                        <dt className="sr-only">{s.label}</dt>
                        <dd className="text-fg-muted">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                  >
                    <Maximize2 size={15} aria-hidden /> View in detail
                  </button>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {openIndex !== null && items.length > 0 && (
        <ImageLightbox
          items={items}
          index={Math.min(openIndex, items.length - 1)}
          onIndexChange={setOpenIndex}
          onClose={close}
        />
      )}
    </>
  );
}
