'use client';

import Image, { type ImageProps } from 'next/image';
import { cloudinaryLoader, isCloudinary } from '@/lib/media';

/**
 * `next/image` for uploaded blog and product photos: served straight from the image CDN at the
 * right size, with the stored blur preview while it loads. A client component because a loader is
 * a function, which server components cannot pass down.
 */
export function MediaImage({
  src,
  alt,
  blur,
  ...props
}: Omit<ImageProps, 'src' | 'loader' | 'placeholder' | 'blurDataURL'> & {
  src: string;
  blur?: string;
}) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={isCloudinary(src) ? cloudinaryLoader : undefined}
      placeholder={blur ? 'blur' : 'empty'}
      blurDataURL={blur}
    />
  );
}
