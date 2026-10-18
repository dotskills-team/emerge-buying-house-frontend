import { expect, test } from '@playwright/test';
import { hasNoHorizontalOverflow } from './helpers';

test.describe('public website', () => {
  test('desktop dropdowns open on hover and keyboard, and link to their pages', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('button', { name: 'Company' }).hover();
    await page
      .locator('#menu-company')
      .getByRole('link', { name: /Management/ })
      .click();
    await expect(page).toHaveURL(/\/company\/management$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Management' })).toBeVisible();

    await nav.getByRole('button', { name: 'Industries' }).focus();
    await page.keyboard.press('Enter');
    await expect(
      page.locator('#menu-industries').getByRole('link', { name: /Information Technology/ }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-industries')).toHaveCount(0);
  });

  test('mobile menu shows every submenu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await menu.getByRole('button', { name: 'Sustainability' }).click();
    await menu.getByRole('link', { name: 'Employee Welfare' }).click();
    await expect(page).toHaveURL(/\/sustainability\/employee-welfare$/);
    await expect(menu).toHaveCount(0);
  });

  test('production images open in a zoomable viewer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/production');
    await page.getByRole('button', { name: /Zoom into Core denim collection/ }).click();
    const viewer = page.getByRole('dialog');
    await expect(viewer).toBeVisible();
    await expect(viewer.getByRole('heading', { name: 'Core denim collection' })).toBeVisible();

    await viewer.getByRole('button', { name: 'Zoom in' }).click();
    await expect(viewer.getByLabel('Zoom level')).not.toHaveText('100%');
    await viewer.getByRole('button', { name: 'Reset zoom' }).click();
    await expect(viewer.getByLabel('Zoom level')).toHaveText('100%');

    await page.keyboard.press('ArrowRight');
    await expect(viewer.getByRole('heading', { level: 2 })).not.toHaveText('Core denim collection');
    await page.keyboard.press('Escape');
    await expect(viewer).toHaveCount(0);
  });

  test('news detail: left titles scroll to that story; social links on the right', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/news-events/new-sourcing-office-chattogram');
    const stories = page.getByRole('navigation', { name: 'Stories' });
    await stories.getByRole('link', { name: /Rooftop solar now powers/ }).click();
    const target = page.locator('#solar-rooftop-partner-factories h2');
    await expect(target).toBeInViewport();
    await expect(page).toHaveURL(/\/news-events\/solar-rooftop-partner-factories$/);
    await expect(page.getByRole('complementary', { name: 'Share and follow' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Share on LinkedIn' }).first()).toBeVisible();
  });

  test('every industry page renders without overflow on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    for (const slug of [
      'textile',
      'retail',
      'pharmaceuticals',
      'information-technology',
      'real-estate',
    ]) {
      await page.goto(`/industries/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await hasNoHorizontalOverflow(page), `${slug} overflows`).toBe(true);
    }
  });
});
