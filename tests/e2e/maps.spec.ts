import { expect, test } from '@playwright/test';

test('map selection rebuilds both views and resets player and input', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.keyboard.down('w'); await page.keyboard.down('d');
  await expect.poll(async () => JSON.parse((await page.locator('#map').getAttribute('data-player'))!).heading).toBeGreaterThan(.1);
  await page.getByRole('combobox', { name: 'Karta', exact: true }).selectOption('bent');
  await expect(page.locator('#map')).toHaveAttribute('data-cells', JSON.stringify(['xxx', 'xoo', 'xox']));
  expect(await page.locator('#world').getAttribute('data-cells')).toBe(await page.locator('#map').getAttribute('data-cells'));
  const start = await page.locator('#map').getAttribute('data-player');
  expect(JSON.parse(start!)).toMatchObject({ x: 15, z: 25, heading: 0 });
  await page.waitForTimeout(200);
  expect(await page.locator('#map').getAttribute('data-player')).toBe(start);
  await page.keyboard.up('w'); await page.keyboard.up('d');
  for (const choice of ['straight', 'bent', 'straight']) {
    await page.getByRole('combobox', { name: 'Karta', exact: true }).selectOption(choice);
    expect(await page.locator('#world').getAttribute('data-cells')).toBe(await page.locator('#map').getAttribute('data-cells'));
    expect(await page.locator('#world').getAttribute('data-player')).toBe(start);
  }
  expect(errors).toEqual([]);
});
