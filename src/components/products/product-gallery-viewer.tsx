'use client';

import { useState } from 'react';
import { Maximize2, Shirt, ZoomIn } from 'lucide-react';
import { ImageLightbox, type LightboxItem } from '@/components/site/image-lightbox';
import { MediaImage } from '@/components/ui/media-image';
import { previewUrl, warmImage } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

// Remote images saved before their size was recorded still need a ratio for the zoom maths.
const FALLBACK = { width: 1600, height: 2000 };

/**
 * Product photos: a large image with thumbnails underneath. Clicking the large image opens the
 * full-screen viewer with real zoom on the original file.
 */
export function ProductGalleryViewer({
  images,
  name,
  description,
  specs,
  subtitle,
}: {
  images: ProductImage[];
  name: string;
  description?: string;
  specs?: { label: string; value: string }[];
  subtitle?: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="bg-brand-weave flex aspect-[4/5] items-center justify-center rounded-2xl">
        <Shirt aria-hidden className="text-gold-light/60 size-20" strokeWidth={1} />
      </div>
    );
  }

  const items: LightboxItem[] = images.map((img, i) => ({
    id: `${i}`,
    title: name,
    subtitle:
      images.length > 1
        ? `${subtitle ? `${subtitle} · ` : ''}Photo ${i + 1} of ${images.length}`
        : subtitle,
    description,
    specs,
    image: {
      src: img.url,
      preview: previewUrl(img.url),
      width: img.width ?? FALLBACK.width,
      height: img.height ?? FALLBACK.height,
    },
  }));
  const current = images[active] ?? images[0]!;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(active)}
        onPointerEnter={() => warmImage(current.url)}
        onFocus={() => warmImage(current.url)}
        aria-label={`Zoom into ${name}, photo ${active + 1}`}
        className="group bg-surface-muted relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl"
      >
        <MediaImage
          key={current.url}
          src={current.url}
          blur={current.blur}
          alt={current.alt || name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="text-ink-deep absolute top-4 right-4 flex size-12 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
          <ZoomIn size={20} aria-hidden />
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Maximize2 size={13} aria-hidden /> Click to zoom
        </span>
      </button>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <li key={`${img.url}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  'bg-surface-muted relative block aspect-square w-full overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-(--color-bg) transition',
                  i === active ? 'ring-gold' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                <MediaImage src={img.url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open !== null && (
        <ImageLightbox
          items={items}
          index={Math.min(open, items.length - 1)}
          onIndexChange={(i) => {
            setOpen(i);
            setActive(i);
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
