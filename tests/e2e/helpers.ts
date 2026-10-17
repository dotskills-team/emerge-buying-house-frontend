import { expect, type Page } from '@playwright/test';

export type Role = 'super' | 'admin' | 'content_manager' | 'author' | 'viewer';

const password = () => {
  const pw = process.env.E2E_PASSWORD;
  if (!pw) throw new Error('Set E2E_PASSWORD to the seeded accounts’ password.');
  return pw;
};

export const emailFor = (role: Role) =>
  process.env[`E2E_${role.toUpperCase()}_EMAIL`] ?? `${role}@local.test`;

export async function signIn(page: Page, role: Role, next?: string) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : '/login');
  await page.getByLabel('Email').fill(emailFor(role));
  await page.getByLabel('Password', { exact: true }).fill(password());
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(next ?? /\/dashboard$/);
}

/** True when nothing on the page is wider than the viewport (no sideways scrolling). */
export async function hasNoHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}
