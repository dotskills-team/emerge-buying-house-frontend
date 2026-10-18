import { expect, test, type Page } from '@playwright/test';
import { hasNoHorizontalOverflow, signIn } from './helpers';

const WIDTHS = [320, 375, 430, 768, 1024, 1280, 1440, 1920];
const PUBLIC_PAGES = [
  '/',
  '/company/about-us',
  '/company/management',
  '/company/history',
  '/industries/textile',
  '/industries/pharmaceuticals',
  '/production',
  '/sustainability/environmental-sustainability',
  '/sustainability/employee-welfare',
  '/csr',
  '/news-events',
  '/news-events/sourcing-summit-2026',
  '/career',
  '/contact',
  '/login',
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

/** Screenshots are a review aid only; very tall pages can exceed Chrome's capture limit. */
async function shoot(page: Page, width: number, path: string) {
  if (!shots) return;
  // Scroll through first so scroll-triggered reveals and lazy images are in their final state.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round((page.viewportSize()?.height ?? 800) * 0.6);
  for (let y = 0; y < height; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.screenshot({ path: shotName(width, path), fullPage: true }).catch((err: Error) => {
    console.log(`screenshot skipped (${width}${path}): ${err.message.split('\n')[0]}`);
  });
}

for (const width of WIDTHS) {
  test.describe(`${width}px wide`, () => {
    test.use({ viewport: { width, height: width < 768 ? 800 : 900 } });

    test('public pages fit without sideways scrolling and the menu works', async ({ page }) => {
      test.setTimeout(180_000); // many long pages, each with a full-page screenshot
      for (const path of PUBLIC_PAGES) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        expect(await hasNoHorizontalOverflow(page), `${path} overflows at ${width}px`).toBe(true);
        await shoot(page, width, path);
      }
      await page.goto('/');
      if (width < 1280) {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
      } else {
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      }
    });

    // One sign-in per width: the login rate limit (10 per 15 minutes) applies to tests too.
    test('dashboard pages fit and navigation is reachable', async ({ page }) => {
      test.setTimeout(120_000);
      await signIn(page, 'super');
      for (const path of DASHBOARD_PAGES) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(await hasNoHorizontalOverflow(page), `${path} overflows at ${width}px`).toBe(true);
        await shoot(page, width, path);
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
        await expect
          .poll(async () => (await main.boundingBox())?.width ?? 0)
          .toBeGreaterThanOrEqual(before);
        expect(await hasNoHorizontalOverflow(page)).toBe(true);
        await page.getByRole('button', { name: 'Expand sidebar' }).click();
        await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();
      }
    });
  });
}
