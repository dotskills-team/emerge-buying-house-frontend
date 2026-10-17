// Server components only: talks to the backend directly (no browser, no cookies, public data only).
const API_ORIGIN = (process.env.API_PROXY_TARGET || 'http://localhost:5000').replace(/\/+$/, '');

export class PublicApiError extends Error {
  constructor(public readonly status: number) {
    super(`Public API request failed with status ${status}`);
  }
}

/** Fetches a public endpoint, cached and revalidated every `revalidate` seconds. Null on 404. */
export async function getPublic<T>(path: string, revalidate = 60): Promise<T | null> {
  const res = await fetch(`${API_ORIGIN}/api${path}`, { next: { revalidate } });
  if (res.status === 404) return null;
  if (!res.ok) throw new PublicApiError(res.status);
  const body = (await res.json()) as { success: boolean; data: T };
  return body.data;
}
