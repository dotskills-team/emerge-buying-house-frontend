// Same-origin by default: Next.js rewrites /api/* to the backend (see next.config.ts), which keeps
// the refresh cookie first-party. Set NEXT_PUBLIC_API_URL to an absolute URL only for a direct setup.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

/** Plain request with no auth handling. Status 0 means the network request itself failed. */
export async function rawRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new ApiError(
      0,
      'Cannot reach the server. Check your connection and try again.',
      'NETWORK_ERROR',
    );
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`, body?.code);
  }
  return body.data as T;
}