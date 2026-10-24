import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mockSystem(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: dark,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});
afterEach(() => vi.unstubAllGlobals());

describe('theme', () => {
  it('follows the device until a choice is made, then remembers it', async () => {
    mockSystem(true);
    const theme = await import('./theme');
    expect(theme.getPreference()).toBe('system');
    expect(theme.resolve('system')).toBe('dark');

    theme.setPreference('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    theme.setPreference('system');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('the head script applies the stored choice before paint', async () => {
    mockSystem(false);
    const { THEME_INIT_SCRIPT } = await import('./theme');
    localStorage.setItem('theme', 'dark');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.removeItem('theme');
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
