import { expect, test, type APIRequestContext } from '@playwright/test';
import { emailFor, signIn } from './helpers';

// Public Cloudinary sample photos (the only remote host next/image allows).
const IMAGES = ['sample', 'couple', 'dog'].map((n) => ({
  url: `https://res.cloudinary.com/demo/image/upload/${n}.jpg`,
  alt: `${n} photo`,
}));

const unique = Date.now().toString(36);
const NAME = `E2E Jersey ${unique}`;
let slug = '';

/** Creates a category and a published three-photo product through the API (one sign-in). */
async function seed(request: APIRequestContext) {
  const login = await request.post('/api/auth/login', {
    data: { email: emailFor('content_manager'), password: process.env.E2E_PASSWORD },
  });
  expect(login.ok()).toBeTruthy();
  const { accessToken } = ((await login.json()) as { data: { accessToken: string } }).data;
  const headers = { Authorization: `Bearer ${accessToken}` };

  const cat = await request.post('/api/products/admin/categories', {
    headers,
    data: { name: `E2E Knitwear ${unique}` },
  });
  const categoryId = ((await cat.json()) as { data: { id: string } }).data.id;
  const created = await request.post('/api/products/admin/products', {
    headers,
    data: {
      name: NAME,
      category: categoryId,
      summary: 'A soft 180 gsm organic cotton jersey tee.',
      images: IMAGES,
      moq: 1000,
      leadTime: '60–75 days',
      sizes: ['S', 'M', 'L'],
      specs: [{ label: 'Wash', value: 'Enzyme wash' }],
    },
  });
  expect(created.status()).toBe(201);
  const product = ((await created.json()) as { data: { id: string; slug: string } }).data;
  const published = await request.post(`/api/products/admin/products/${product.id}/publish`, {
    headers,
  });
  expect(published.ok()).toBeTruthy();
  slug = product.slug;
}

test.describe('products', () => {
  test.beforeAll(async ({ request }) => {
    await seed(request);
  });

  test('a published product opens a detail page with a zoomable photo gallery', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/production?q=${encodeURIComponent(NAME)}`);
    await page.getByRole('link', { name: NAME }).click();
    await expect(page).toHaveURL(new RegExp(`/production/${slug}$`));
    await expect(page.getByRole('heading', { level: 1, name: NAME })).toBeVisible();
    await expect(page.getByText('1,000 pcs per style')).toBeVisible();

    await page.getByRole('button', { name: /Zoom into/ }).click();
    const viewer = page.getByRole('dialog');
    await expect(viewer).toBeVisible();
    await expect(viewer.getByText('Photo 1 of 3')).toBeVisible();
    await viewer.getByRole('button', { name: 'Zoom in' }).click();
    await expect(viewer.getByLabel('Zoom level')).not.toHaveText('100%');
    await viewer.getByRole('button', { name: 'Reset zoom' }).click();
    await expect(viewer.getByLabel('Zoom level')).toHaveText('100%');
    await page.keyboard.press('ArrowRight');
    await expect(viewer.getByText('Photo 2 of 3')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(viewer).toHaveCount(0);

    // "Request a quote" carries the product into the contact form.
    await page.locator('#main').getByRole('link', { name: 'Request a quote' }).click();
    await expect(page.getByLabel(/Message/)).toHaveValue(new RegExp(NAME));
  });

  test('editors find and update the product in the dashboard', async ({ page }) => {
    await signIn(page, 'content_manager');
    await page.goto('/dashboard/products');
    await page.getByRole('searchbox', { name: 'Search products' }).fill(NAME);
    await page.getByRole('link', { name: `Edit ${NAME}` }).click();
    await expect(page.getByLabel('Product name')).toHaveValue(NAME);
    await page.getByLabel('Lead time').fill('45 days');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Changes saved.')).toBeVisible();
  });
});
