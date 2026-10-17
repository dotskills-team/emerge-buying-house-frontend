import { create } from 'zustand';
import { setSessionEndedHandler } from '@/lib/session';
import type { PublicUser } from '@/types/auth';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthState {
  status: AuthStatus;
  user: PublicUser | null;
  error: string | null;
  /** True when the user chose to sign out (as opposed to the session expiring). */
  signedOut: boolean;
  setLoading: () => void;
  setAuthenticated: (user: PublicUser) => void;
  /** Refreshes the signed-in user's details (name, role, permissions) without a status change. */
  setUser: (user: PublicUser) => void;
  setUnauthenticated: (signedOut?: boolean) => void;
  setError: (message: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  user: null,
  error: null,
  signedOut: false,
  setLoading: () => set({ status: 'loading', error: null }),
  setAuthenticated: (user) => set({ status: 'authenticated', user, error: null, signedOut: false }),
  setUser: (user) => set({ user }),
  setUnauthenticated: (signedOut = false) =>
    set({ status: 'unauthenticated', user: null, error: null, signedOut }),
  setError: (error) => set({ status: 'error', error }),
}));

// A refresh that fails with 401 (expired, revoked, reused) ends the session everywhere in the UI.
setSessionEndedHandler(() => useAuthStore.getState().setUnauthenticated());
