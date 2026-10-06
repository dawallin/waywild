import { expect, test } from '@playwright/test';

test('applying a seed rebuilds both views and resets the player', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('w');
  await expect.poll(async () => JSON.parse((await page.locator('#map').getAttribute('data-player'))!).z).toBeLessThan(24.8);
  await page.keyboard.up('w');
  await page.getByLabel('Seed', { exact: true }).fill('42');
  await page.getByRole('button', { name: 'Skapa landskap' }).click();
  await expect(page.locator('#world')).toHaveAttribute('data-seed', '42');
  await expect(page.locator('#map')).toHaveAttribute('data-seed', '42');
  expect(JSON.parse((await page.locator('#map').getAttribute('data-player'))!)).toMatchObject({ x:15, z:25, heading:0 });
  await page.keyboard.down('w');
  await expect.poll(async () => JSON.parse((await page.locator('#map').getAttribute('data-player'))!).z).toBeLessThan(24.8);
  await page.keyboard.up('w');
});
test('map switching retains the applied seed', async ({ page }) => {
  await page.goto('./'); await page.getByLabel('Seed', { exact: true }).fill('42');
  await page.getByRole('button', { name: 'Skapa landskap' }).click();
  await page.getByRole('combobox', { name: 'Karta', exact: true }).selectOption('bent');
  await expect(page.locator('#world')).toHaveAttribute('data-seed', '42');
});
test('plus and minus apply adjacent seeds immediately', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Öka seed' }).click();
  await expect(page.getByLabel('Seed', { exact: true })).toHaveValue('2');
  await expect(page.locator('#world')).toHaveAttribute('data-seed', '2');
  await page.getByRole('button', { name: 'Minska seed' }).click();
  await expect(page.getByLabel('Seed', { exact: true })).toHaveValue('1');
  await expect(page.locator('#world')).toHaveAttribute('data-seed', '1');
});
test('seed controls respect both integer bounds', async ({ page }) => {
  await page.goto('./');
  const seed = page.getByLabel('Seed', { exact: true });
  await seed.fill('0'); await expect(page.getByRole('button', { name: 'Minska seed' })).toBeDisabled();
  await seed.fill('4294967295'); await expect(page.getByRole('button', { name: 'Öka seed' })).toBeDisabled();
});
test('invalid seeds are not applied', async ({ page }) => {
  await page.goto('./');
  for (const value of ['-1', '1.5', '4294967296', '']) {
    await page.getByLabel('Seed', { exact: true }).fill(value);
    await page.getByRole('button', { name: 'Skapa landskap' }).click();
    await expect(page.locator('#world')).toHaveAttribute('data-seed', '1');
    await expect(page.getByRole('button', { name: 'Öka seed' })).toBeDisabled();
  }
});
