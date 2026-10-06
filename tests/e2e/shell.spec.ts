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


test('renders the first-person world', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#world')).toHaveAttribute('data-ready', 'true');
});

test('uses the same player for both views', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#world')).toHaveAttribute('data-ready', 'true');
  expect(await page.locator('#map').getAttribute('data-player')).toBe(await page.locator('#world').getAttribute('data-player'));
});
