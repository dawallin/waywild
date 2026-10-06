import { expect, test } from '@playwright/test';

async function position(page: import('@playwright/test').Page) {
  return JSON.parse((await page.locator('#map').getAttribute('data-player'))!);
}

test('holding W moves the player forward', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).z).toBeLessThan(24.8);
  await page.keyboard.up('w');
});

test('releasing W stops movement', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).z).toBeLessThan(24.8);
  await page.keyboard.up('w');
  const stopped = await position(page);
  await page.waitForTimeout(200);
  expect(await position(page)).toEqual(stopped);
});

test('moving updates both views to the same position', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).z).toBeLessThan(24.8);
  await page.keyboard.up('w');
  expect(await page.locator('#world').getAttribute('data-player')).toBe(await page.locator('#map').getAttribute('data-player'));
});

test('holding S moves the player backward', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('s');
  await expect.poll(async () => (await position(page)).z).toBeGreaterThan(25.2);
  await page.keyboard.up('s');
});

test('W and S together stop movement', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.down('w'); await page.keyboard.down('s');
  const stopped = await position(page);
  await page.waitForTimeout(200);
  expect(await position(page)).toEqual(stopped);
  await page.keyboard.up('w'); await page.keyboard.up('s');
});

test('backward movement stops at the rear wall', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('s');
  await expect.poll(async () => (await position(page)).z, { timeout: 6000 }).toBe(29.5);
  await page.waitForTimeout(100);
  expect((await position(page)).z).toBe(29.5);
  await page.keyboard.up('s');
});
