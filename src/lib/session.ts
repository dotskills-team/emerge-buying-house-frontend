import { ApiError, rawRequest } from './http';
import { tokenStore } from './token-store';
import type { AuthPayload } from '@/types/auth';

let inflight: Promise<AuthPayload> | null = null;
let signingOut = false;
let onSessionEnded: (() => void) | null = null;

/** The auth store registers here so a dead session anywhere signs the UI out. */
export function setSessionEndedHandler(handler: (() => void) | null): void {
  onSessionEnded = handler;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestRefresh(): Promise<AuthPayload> {
  for (let attempt = 0; ; attempt++) {
    try {
      const data = await rawRequest<AuthPayload>('/auth/refresh', { method: 'POST' });
      tokenStore.set(data.accessToken);
      return data;
    } catch (err) {
      if (err instanceof ApiError && err.code === 'REFRESH_CONFLICT' && attempt < 2) {
        await sleep(300); // another tab rotated the cookie a moment ago: retry with the new one
        continue;
      }
      if (err instanceof ApiError && err.status === 401) {
        tokenStore.set(null);
        onSessionEnded?.();
      }
      throw err;
    }
  }
}

/**
 * Gets a new access token using the refresh cookie.
 * - Concurrent callers in this tab share one request (single flight).
 * - Tabs take turns through the Web Locks API, so they never spend the same refresh token twice.
 * Rejects with ApiError 401 when the session is over, and with another error for network/server problems.
 */
export function refreshSession(): Promise<AuthPayload> {
  if (signingOut) {
    return Promise.reject(new ApiError(401, 'Signing out.', 'SIGNING_OUT'));
  }
  inflight ??= (
    typeof navigator !== 'undefined' && 'locks' in navigator
      ? navigator.locks.request('bh-auth-refresh', requestRefresh)
      : requestRefresh()
  ).finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Revokes the session on the server, then forgets the access token. */
export async function endSession(): Promise<void> {
  signingOut = true;
  try {
    // Let a refresh that is already running finish so logout targets the newest cookie.
    if (inflight) await inflight.catch(() => undefined);
    try {
      await rawRequest<null>('/auth/logout', { method: 'POST' });
    } catch (err) {
      // If the server could not be reached the session is still alive: report it, keep state.
      if (!(err instanceof ApiError) || err.status === 0 || err.status >= 500) throw err;
    }
    tokenStore.set(null);
  } finally {
    signingOut = false;
  }
}
