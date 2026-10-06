import { expect, test, type Page } from '@playwright/test';

async function player(page: Page) {
  return JSON.parse((await page.locator('#map').getAttribute('data-player'))!);
}

for (const key of ['a', 'd']) {
  test(`${key} turns both views without moving`, async ({ page }) => {
    await page.goto('./');
    await page.keyboard.down(key);
    await expect.poll(async () => (await player(page)).heading).toBeGreaterThan(0.1);
    await page.keyboard.up(key);
    const stopped = await player(page);
    expect(stopped.x).toBe(15); expect(stopped.z).toBe(25);
    expect(await page.locator('#world').getAttribute('data-player')).toBe(await page.locator('#map').getAttribute('data-player'));
    await page.waitForTimeout(200);
    expect(await player(page)).toEqual(stopped);
  });
}

test('walking while turning follows the changing direction', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.down('d'); await page.keyboard.down('w');
  await expect.poll(async () => (await player(page)).x).toBeGreaterThan(15.1);
  await page.keyboard.up('w'); await page.keyboard.up('d');
  expect((await player(page)).z).toBeLessThan(25);
});

test('focus loss releases turning input', async ({ page }) => {
  await page.goto('./'); await page.keyboard.down('d');
  await expect.poll(async () => (await player(page)).heading).toBeGreaterThan(0.1);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  const stopped = await player(page);
  await page.waitForTimeout(200);
  expect(await player(page)).toEqual(stopped);
});
