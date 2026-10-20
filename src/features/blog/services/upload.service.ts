import { apiFetch } from '@/lib/api';

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  allowed_formats: string;
  signature: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  /** Tiny inline preview shown blurred while the photo loads. Absent if the browser could not make it. */
  blur?: string;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024;

const BLUR_WIDTH = 16;

/**
 * Shrinks the photo to a few pixels and returns it as a data URL (a few hundred bytes), which pages
 * show blurred until the real image arrives. Made here, from the chosen file, so it does not depend
 * on where images are hosted. Best effort: an image the browser cannot decode just gets none.
 */
async function makeBlur(file: File): Promise<string | undefined> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = BLUR_WIDTH;
    canvas.height = Math.max(1, Math.round((bitmap.height / bitmap.width) * BLUR_WIDTH));
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const webp = canvas.toDataURL('image/webp', 0.5);
    // Safari cannot encode WebP and silently returns PNG; JPEG is smaller than that.
    return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.6);
  } catch {
    return undefined;
  }
}

/** Uploads straight to Cloudinary using a short-lived signature from our backend. */
export async function uploadImage(
  file: File,
  folder: 'blog' | 'products' = 'blog',
): Promise<UploadedImage> {
  if (!ALLOWED.includes(file.type)) throw new Error('Use a JPG, PNG, WebP or AVIF image.');
  if (file.size > MAX_BYTES) throw new Error('Image must be 5 MB or smaller.');

  const sig = await apiFetch<UploadSignature>('/blog/admin/uploads/signature', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ folder }),
  });

  // Every signed parameter must be sent exactly as signed.
  const body = new FormData();
  body.append('file', file);
  body.append('api_key', sig.apiKey);
  body.append('timestamp', String(sig.timestamp));
  body.append('folder', sig.folder);
  body.append('allowed_formats', sig.allowed_formats);
  body.append('signature', sig.signature);

  const blur = makeBlur(file);
  let res: Response;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: 'POST',
      body,
    });
  } catch {
    throw new Error('Could not reach the image server. Check your connection.');
  }
  if (!res.ok) throw new Error('Image upload failed. Please try again.');

  const data = (await res.json()) as {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  };
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    blur: await blur,
  };
}
