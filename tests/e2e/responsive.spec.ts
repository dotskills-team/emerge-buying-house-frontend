import { expect, test } from '@playwright/test';
import { hasNoHorizontalOverflow, signIn } from './helpers';

const WIDTHS = [320, 375, 390, 768, 1024, 1280, 1440];
const PUBLIC_PAGES = [
  '/',
  '/blog',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/does-not-exist',
];
const DASHBOARD_PAGES = [
  '/dashboard',
  '/dashboard/blog',
  '/dashboard/blog/new',
  '/dashboard/blog/categories',
  '/dashboard/users',
  '/dashboard/users/new',
  '/dashboard/roles',
  '/dashboard/audit',
  '/dashboard/profile',
];

const shots = process.env.E2E_SCREENSHOTS; // a directory: also saves a screenshot per page/width
const shotName = (width: number, path: string) =>
  `${shots}/${width}${path.replace(/\//g, '_') || '_home'}.png`;

for (const width of WIDTHS) {
  test.describe(`${width}px wide`, () => {
    test.use({ viewport: { width, height: width < 768 ? 800 : 900 } });

    test('public pages fit without sideways scrolling and the menu works', async ({ page }) => {
      for (const path of PUBLIC_PAGES) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        expect(await hasNoHorizontalOverflow(page), `${path} overflows at ${width}px`).toBe(true);
        if (shots) await page.screenshot({ path: shotName(width, path), fullPage: true });
      }
      await page.goto('/');
      if (width < 768) {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
      } else {
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      }
    });

    // One sign-in per width: the login rate limit (10 per 15 minutes) applies to tests too.
    test('dashboard pages fit and navigation is reachable', async ({ page }) => {
      await signIn(page, 'super');
      for (const path of DASHBOARD_PAGES) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(await hasNoHorizontalOverflow(page), `${path} overflows at ${width}px`).toBe(true);
        if (shots) await page.screenshot({ path: shotName(width, path), fullPage: true });
      }

      await page.goto('/dashboard');
      if (width < 1024) {
        await page.getByRole('button', { name: 'Open navigation' }).click();
        const drawer = page.getByRole('dialog', { name: 'Navigation' });
        await drawer.getByRole('link', { name: 'Users' }).click();
        await expect(page).toHaveURL(/\/dashboard\/users$/);
        await expect(drawer).toHaveCount(0);
      } else {
        await page
          .getByRole('navigation', { name: 'Dashboard' })
          .getByRole('link', { name: 'Users' })
          .click();
        await expect(page).toHaveURL(/\/dashboard\/users$/);
      }
    });
  });
}
