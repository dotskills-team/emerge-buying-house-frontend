import type { ImageLoaderProps } from 'next/image';

/**
 * Uploaded blog and product photos live on Cloudinary for now. Its CDN resizes and converts them
 * (AVIF/WebP) from the URL, so they skip the Next.js optimizer. Moving to our own hosting later
 * means changing only this file and the upload service.
 */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export const isCloudinary = (src: string) => CLOUDINARY_UPLOAD.test(src);

/** Inserts a Cloudinary transformation (e.g. `f_auto,q_auto,w_800`) into an upload URL. */
export function cloudinaryUrl(src: string, transform: string): string {
  const m = CLOUDINARY_UPLOAD.exec(src);
  return m ? `${m[1]}${transform}/${m[2]}` : src;
}

/** `next/image` loader: the best format and quality the browser supports, never upscaled. */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  return cloudinaryUrl(src, `f_auto,q_${quality ?? 'auto'},c_limit,w_${width}`);
}

/** A lighter version of a photo, shown while the original loads (e.g. in the zoom viewer). */
export const previewUrl = (src: string, width = 1200) =>
  isCloudinary(src) ? cloudinaryLoader({ src, width }) : src;

const ARTICLE_WIDTHS = [480, 768, 1080, 1440];
// Article body width (--container-prose, 46rem) on desktop, full width below it.
const ARTICLE_SIZES = '(min-width: 48rem) 46rem, 100vw';

/**
 * Photos inside an article are stored as plain `<img>` tags pointing at the original upload. This
 * serves them at the size the reader needs instead of the multi-megabyte original.
 */
export function optimizeArticleImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\ssrc="([^"]+)"([^>]*)>/g, (tag, before, src, after) => {
    const url = src.replace(/&amp;/g, '&');
    if (!isCloudinary(url)) return tag;
    const srcset = ARTICLE_WIDTHS.map((w) => `${cloudinaryLoader({ src: url, width: w })} ${w}w`);
    return `<img${before} src="${cloudinaryLoader({ src: url, width: 1080 })}" srcset="${srcset.join(', ')}" sizes="${ARTICLE_SIZES}" decoding="async"${after}>`;
  });
}

const warmed = new Set<string>();

/** Starts downloading an image in the background so it is ready when it is opened. */
export function warmImage(src: string) {
  if (typeof window === 'undefined' || warmed.has(src)) return;
  warmed.add(src);
  const img = new window.Image();
  img.decoding = 'async';
  img.src = src;
}
