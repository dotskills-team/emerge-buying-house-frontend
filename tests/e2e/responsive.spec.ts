import { expect, test } from '@playwright/test';
import { hasNoHorizontalOverflow, signIn } from './helpers';

const WIDTHS = [320, 375, 430, 768, 1024, 1280, 1440, 1920];
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
      const sidebar = page.getByRole('navigation', { name: 'Dashboard' });
      if (width < 768) {
        // Phones: off-canvas drawer behind a menu button.
        await page.getByRole('button', { name: 'Open navigation' }).click();
        const drawer = page.getByRole('dialog', { name: 'Navigation' });
        await drawer.getByRole('link', { name: 'Users' }).click();
        await expect(page).toHaveURL(/\/dashboard\/users$/);
        await expect(drawer).toHaveCount(0);
      } else {
        // Tablets: icon rail; laptops and up: full sidebar. Links keep their accessible names.
        await sidebar.getByRole('link', { name: 'Users' }).click();
        await expect(page).toHaveURL(/\/dashboard\/users$/);
      }

      if (width >= 1024) {
        // The sidebar collapses to a rail and the content grows to use the space.
        const main = page.locator('main');
        const before = (await main.boundingBox())?.width ?? 0;
        await page.getByRole('button', { name: 'Collapse sidebar' }).click();
        await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
        await expect.poll(async () => (await main.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(before);
        expect(await hasNoHorizontalOverflow(page)).toBe(true);
        await page.getByRole('button', { name: 'Expand sidebar' }).click();
        await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();
      }
    });
  });
}
