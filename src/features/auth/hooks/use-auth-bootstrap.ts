'use client';

import { useCallback, useEffect } from 'react';
import { ApiError } from '@/lib/http';
import { refreshSession } from '@/lib/session';
import { useAuthStore } from '@/store/auth-store';

/**
 * Restores the session after a page load: the access token is gone (memory only), so the
 * HttpOnly refresh cookie is exchanged for a new one. Runs once per page load.
 */
export function useAuthBootstrap() {
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);

  const restore = useCallback(async () => {
    const { setLoading, setAuthenticated, setUnauthenticated, setError } = useAuthStore.getState();
    setLoading();
    try {
      const data = await refreshSession();
      setAuthenticated(data.user);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setUnauthenticated();
      else setError(err instanceof Error ? err.message : 'Could not restore your session.');
    }
  }, []);

  useEffect(() => {
    if (useAuthStore.getState().status === 'idle') void restore();
  }, [restore]);

  return { status, error, retry: restore };
}
