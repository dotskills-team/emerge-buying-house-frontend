export type ThemePreference = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/**
 * Runs in <head> before the page paints (see app/layout.tsx), so a dark-theme visitor never sees
 * a flash of the light page. Kept tiny and dependency-free; mirrors resolve() below.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`;

const isPreference = (v: unknown): v is ThemePreference =>
  v === 'light' || v === 'dark' || v === 'system';

export function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export const resolve = (pref: ThemePreference): Theme =>
  pref === 'system' ? (systemDark() ? 'dark' : 'light') : pref;

function apply(pref: ThemePreference) {
  document.documentElement.dataset.theme = resolve(pref);
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function setPreference(pref: ThemePreference) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  apply(pref);
  current = pref;
  notify();
}

let current: ThemePreference | null = null;

/** For useSyncExternalStore: the stored choice, kept in step with the device and other tabs. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (getPreference() === 'system') {
        apply('system');
        notify();
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY && e.key !== null) return;
      current = readPreference();
      apply(current);
      notify();
    };
    media.addEventListener('change', onSystem);
    window.addEventListener('storage', onStorage);
    cleanup = () => {
      media.removeEventListener('change', onSystem);
      window.removeEventListener('storage', onStorage);
    };
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) cleanup?.();
  };
}

let cleanup: (() => void) | null = null;

export function getPreference(): ThemePreference {
  current ??= readPreference();
  return current;
}

/** The server cannot know the choice; the toggle shows "system" until it hydrates. */
export const getServerPreference = (): ThemePreference => 'system';
