import { expect, test } from '@playwright/test';
import { signIn } from './helpers';

const unique = () => Date.now().toString(36);

test.describe('role-based access', () => {
  test('a viewer sees only what they may use, and direct URLs are refused', async ({ page }) => {
    await signIn(page, 'viewer');
    const nav = page.getByRole('navigation', { name: 'Dashboard' });
    await expect(nav.getByRole('link', { name: 'Blog posts' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Users' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Roles & permissions' })).toHaveCount(0);

    await page.goto('/dashboard/users');
    await expect(
      page.getByRole('heading', { name: 'You do not have access to this page' }),
    ).toBeVisible();
    await page.goto('/dashboard/blog');
    await expect(page.getByRole('link', { name: 'New post' })).toHaveCount(0);
  });

  test('a Super Admin creates a user, changes their role and deactivates them', async ({
    page,
  }) => {
    const email = `e2e-${unique()}@local.test`;
    await signIn(page, 'super');
    await page.goto('/dashboard/users/new');
    await page.getByLabel('Full name').fill('E2E Person');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Initial password').fill('an e2e test passphrase');
    await page.getByLabel('Role').selectOption('author');
    await page.getByRole('button', { name: 'Create user' }).click();

    await expect(page.getByRole('heading', { name: 'E2E Person' })).toBeVisible();
    await expect(page.getByText('can now sign in')).toBeVisible();

    await page.getByRole('combobox', { name: 'Role' }).selectOption('content_manager');
    await page.getByRole('button', { name: 'Change role' }).click();
    await expect(page.getByText('Role changed to Content Manager.')).toBeVisible();

    await page.getByRole('button', { name: 'Deactivate account' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Deactivate' }).click();
    await expect(page.getByRole('button', { name: 'Reactivate account' })).toBeVisible();

    await page.goto('/dashboard/audit');
    await expect(page.getByText('changed account status').first()).toBeVisible();
  });

  test('an admin cannot edit a Super Admin', async ({ page }) => {
    await signIn(page, 'admin');
    await page.goto('/dashboard/users?');
    await page.getByLabel('Filter by role').selectOption('super_admin');
    await page.getByRole('link', { name: 'Local Super' }).first().click();
    await expect(
      page.getByText('Only a Super Admin can change a Super Admin account.'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save details' })).toHaveCount(0);
  });

  test('an author drafts a post but cannot publish it; an editor can', async ({
    page,
    browser,
  }) => {
    const title = `E2E draft ${unique()}`;
    await signIn(page, 'author');
    await page.goto('/dashboard/blog/new');
    await page.getByLabel('Title', { exact: true }).fill(title);
    await page
      .getByRole('textbox', { name: 'Article content' })
      .fill('Hello from the end-to-end test.');
    await expect(page.getByRole('button', { name: 'Publish' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Save draft' }).click();
    await expect(page).toHaveURL(/\/dashboard\/blog\/[a-f0-9]{24}$/);

    const editor = await browser.newPage();
    await signIn(editor, 'content_manager');
    await editor.goto('/dashboard/blog');
    const row = editor.getByRole('listitem').filter({ hasText: title });
    await row.getByRole('button', { name: 'Publish' }).click();
    await expect(editor.getByText('Post published.')).toBeVisible();
    await editor.close();

    // The public list is cached for up to a minute (ISR); the new post's own page is live at once.
    await page.goto(`/blog/${title.toLowerCase().replace(/ /g, '-')}`);
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  });
});
