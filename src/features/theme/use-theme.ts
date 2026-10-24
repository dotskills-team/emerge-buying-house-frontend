'use client';

import { useSyncExternalStore } from 'react';
import { getPreference, getServerPreference, setPreference, subscribe } from './theme';

export function useTheme() {
  const preference = useSyncExternalStore(subscribe, getPreference, getServerPreference);
  return { preference, setPreference };
}
