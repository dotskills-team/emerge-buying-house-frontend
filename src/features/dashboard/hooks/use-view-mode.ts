'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { ViewMode } from '../components/content-ui';

const EVENT = 'dashboard:view-mode';
// In-memory copy, so the choice holds for the session even where storage is blocked.
const memory = new Map<string, ViewMode>();

function read(key: string, fallback: ViewMode): ViewMode {
  const cached = memory.get(key);
  if (cached) return cached;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'grid' || saved === 'list') return saved;
  } catch {
    /* storage unavailable */
  }
  return fallback;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** List or grid layout for a dashboard list, remembered per browser (a convenience only). */
export function useViewMode(
  key: string,
  fallback: ViewMode = 'list',
): [ViewMode, (mode: ViewMode) => void] {
  const mode = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );
  const setMode = useCallback(
    (next: ViewMode) => {
      memory.set(key, next);
      try {
        localStorage.setItem(key, next);
      } catch {
        /* storage unavailable */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [mode, setMode];
}
