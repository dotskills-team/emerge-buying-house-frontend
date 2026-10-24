'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { uploadImage } from '@/features/blog/services/upload.service';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

export const MAX_PRODUCT_IMAGES = 12;

/**
 * The product's photo set. The first image is the cover. Several files can be chosen at once;
 * they upload one after another so a failure is reported per file.
 */
export function ProductImagesField({
  value,
  onChange,
  onError,
  canUpload,
}: {
  value: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  onError: (message: string) => void;
  canUpload: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const room = MAX_PRODUCT_IMAGES - value.length;

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    const chosen = [...files].slice(0, room);
    if (files.length > room) onError(`Only ${MAX_PRODUCT_IMAGES} images per product are allowed.`);
    setPending(chosen.length);
    let next = value;
    for (const file of chosen) {
      try {
        const img = await uploadImage(file, 'products');
        next = [...next, { ...img, alt: '' }];
        onChange(next);
      } catch (e) {
        onError(`${file.name}: ${e instanceof Error ? e.message : 'upload failed.'}`);
      } finally {
        setPending((n) => n - 1);
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    onChange(next);
  };
  const update = (i: number, patch: Partial<ProductImage>) =>
    onChange(value.map((img, n) => (n === i ? { ...img, ...patch } : img)));

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {value.map((img, i) => (
            <li
              key={`${img.url}-${i}`}
              className={cn(
                'border-border bg-surface overflow-hidden rounded-xl border',
                i === 0 && 'ring-gold/60 ring-2',
              )}
            >
              <div className="bg-surface-muted relative aspect-square">
                <MediaImage
                  src={img.url}
                  blur={img.blur}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1280px) 12rem, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="text-ink-deep absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-(image:--gradient-gold) px-2 py-0.5 text-[0.6875rem] font-semibold shadow-sm">
                    <Star size={10} aria-hidden /> Cover
                  </span>
                )}
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                  <span className="flex gap-1">
                    <ImageAction
                      label={`Move image ${i + 1} earlier`}
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                    >
                      <ArrowLeft size={14} aria-hidden />
                    </ImageAction>
                    <ImageAction
                      label={`Move image ${i + 1} later`}
                      disabled={i === value.length - 1}
                      onClick={() => move(i, i + 1)}
                    >
                      <ArrowRight size={14} aria-hidden />
                    </ImageAction>
                  </span>
                  <span className="flex gap-1">
                    {i > 0 && (
                      <ImageAction label={`Use image ${i + 1} as cover`} onClick={() => move(i, 0)}>
                        <Star size={14} aria-hidden />
                      </ImageAction>
                    )}
                    <ImageAction
                      label={`Remove image ${i + 1}`}
                      danger
                      onClick={() => onChange(value.filter((_, n) => n !== i))}
                    >
                      <Trash2 size={14} aria-hidden />
                    </ImageAction>
                  </span>
                </div>
              </div>
              <label className="block p-2">
                <span className="sr-only">Alt text for image {i + 1}</span>
                <input
                  value={img.alt}
                  maxLength={200}
                  onChange={(e) => update(i, { alt: e.target.value })}
                  placeholder="Describe the photo"
                  className="text-fg placeholder:text-fg-subtle focus:border-primary bg-bg w-full rounded-md border border-transparent px-2 py-1.5 text-xs outline-none"
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      {canUpload ? (
        <>
          <button
            type="button"
            disabled={room <= 0 || pending > 0}
            onClick={() => fileRef.current?.click()}
            className="border-border-strong text-fg-muted hover:border-primary hover:text-primary hover:bg-primary-soft/40 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending > 0 ? (
              <>
                <Loader2 size={22} aria-hidden className="animate-spin" />
                Uploading {pending} {pending === 1 ? 'image' : 'images'}…
              </>
            ) : (
              <>
                <ImagePlus size={22} aria-hidden />
                <span className="text-fg font-medium">
                  {value.length ? 'Add more images' : 'Upload product images'}
                </span>
                <span className="text-fg-subtle text-xs">
                  JPG, PNG, WebP or AVIF, up to 5 MB each · {Math.max(0, room)} of{' '}
                  {MAX_PRODUCT_IMAGES} slots left
                </span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => void pick(e.target.files)}
          />
        </>
      ) : (
        <p className="text-fg-subtle text-sm">You do not have permission to upload images.</p>
      )}
      {value.length > 1 && (
        <p className="text-fg-subtle text-xs">
          The first image is the cover. Use the arrows to change the order.
        </p>
      )}
    </div>
  );
}

function ImageAction({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur transition-colors disabled:opacity-40',
        danger ? 'text-danger hover:bg-danger hover:text-white' : 'text-ink-deep hover:bg-white',
      )}
    >
      {children}
    </button>
  );
}
