// Same-origin by default: Next.js rewrites /api/* to the backend (see next.config.ts), which keeps
// the refresh cookie first-party. Set NEXT_PUBLIC_API_URL to an absolute URL only when the
// frontend and backend share a site (e.g. localhost:3000 and localhost:5000).
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface FieldError {
  path: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    /** Per-field validation messages, keyed by dotted path (e.g. "email"). */
    public readonly fieldErrors: FieldError[] = [],
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
  errors?: FieldError[];
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
    throw new ApiError(
      res.status,
      body?.message ?? `Request failed (${res.status})`,
      body?.code,
      body?.errors ?? [],
    );
  }
  return body.data as T;
}

/** A readable message for any thrown value, for inline alerts and toasts. */
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  if (err instanceof ApiError && err.status === 403) {
    return err.message || 'You do not have permission to do this.';
  }
  return err instanceof Error && err.message ? err.message : fallback;
}
