import { expect, test } from '@playwright/test';
import { emailFor, signIn } from './helpers';

test.describe('authentication', () => {
  test('shows field validation, then a generic error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Enter your email address.')).toBeVisible();

    await page.getByLabel('Email').fill(emailFor('viewer'));
    await page.getByLabel('Password', { exact: true }).fill('definitely not the password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid email or password.')).toBeVisible();
  });

  test('protects the dashboard, returns to the requested page after sign-in, and signs out', async ({
    page,
  }) => {
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fprofile/);

    await signIn(page, 'viewer', '/dashboard/profile');
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible();

    // The session survives a reload (refresh cookie), the access token lives only in memory.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible();

    await page.getByRole('button', { name: /account menu/i }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('forgot password answers honestly', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('Email').fill(emailFor('viewer'));
    await page.getByRole('button', { name: 'Send reset link' }).click();
    // Either the generic confirmation (email configured) or a clear "not available" message.
    await expect(
      page.getByText(
        /If an account exists for this email|Password reset by email is not available/,
      ),
    ).toBeVisible();
  });

  test('a reset page without a valid link explains what to do', async ({ page }) => {
    await page.goto('/reset-password#token=not-a-real-token-but-long-enough');
    await expect(page.getByRole('heading', { name: 'Link not valid' })).toBeVisible();
    await expect(page).toHaveURL(/\/reset-password$/); // the token was removed from the address bar
  });
});
