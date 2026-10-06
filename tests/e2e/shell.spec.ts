import { expect, test } from '@playwright/test';

test('shows the map panel', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('region', { name: 'Karta', exact: true })).toBeVisible();
});

test('shows the first-person panel', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('region', { name: 'Förstaperson', exact: true })).toBeVisible();
});

test('loads production assets without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Waywild', exact: true })).toBeVisible();
  await expect(page.locator('main')).toHaveCSS('display', 'grid');
  expect(errors).toEqual([]);
});
