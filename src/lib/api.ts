import { ApiError, rawRequest } from './http';
import { refreshSession } from './session';
import { tokenStore } from './token-store';

export { ApiError };

interface ApiOptions extends RequestInit {
  /** Sends the access token and, on a 401, refreshes the session once and retries. */
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  { auth = false, ...init }: ApiOptions = {},
): Promise<T> {
  if (!auth) return rawRequest<T>(path, init);

  const send = () =>
    rawRequest<T>(path, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${tokenStore.get() ?? ''}` },
    });

  try {
    return await send();
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) throw err;
    await refreshSession(); // throws if the session is over
    return send();
  }
}