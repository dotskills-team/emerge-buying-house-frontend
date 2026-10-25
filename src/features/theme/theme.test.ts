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
  it('is light until the visitor chooses, even on a dark device, then remembers the choice', async () => {
    mockSystem(true);
    const theme = await import('./theme');
    expect(theme.getPreference()).toBe('light');
    expect(theme.resolve(theme.getPreference())).toBe('light');

    theme.setPreference('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    // "System" is an explicit choice: it follows the device and is remembered.
    theme.setPreference('system');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('system');
  });

  it('the head script applies the stored choice before paint, and light by default', async () => {
    mockSystem(true);
    const { THEME_INIT_SCRIPT } = await import('./theme');
    const run = () => new Function(THEME_INIT_SCRIPT)();

    run();
    expect(document.documentElement.dataset.theme).toBe('light');
    localStorage.setItem('theme', 'dark');
    run();
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.setItem('theme', 'system');
    run();
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.setItem('theme', 'light');
    run();
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
