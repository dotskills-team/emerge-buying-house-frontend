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
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024;

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
  return { url: data.secure_url, publicId: data.public_id, width: data.width, height: data.height };
}
