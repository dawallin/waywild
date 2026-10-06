import { expect, test } from '@playwright/test';

test('large landscape selection updates both views', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('combobox', { name:'Karta', exact:true }).selectOption('landscape');
  await expect(page.locator('#map')).toHaveAttribute('data-cells', JSON.stringify(Array.from({ length:10 },(_,i)=>i===5?'xxxxxoxxxx':'xxxxxxxxxx')));
  expect(await page.locator('#world').getAttribute('data-cells')).toBe(await page.locator('#map').getAttribute('data-cells'));
  expect(JSON.parse((await page.locator('#world').getAttribute('data-player'))!)).toMatchObject({ x:55,z:55,heading:0 });
});
test('seed changes work on the large landscape', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('combobox', { name:'Karta', exact:true }).selectOption('landscape');
  await page.getByRole('button', { name:'Öka seed' }).click();
  await expect(page.locator('#world')).toHaveAttribute('data-seed','2');
  expect(JSON.parse((await page.locator('#world').getAttribute('data-player'))!)).toMatchObject({ x:55,z:55,heading:0 });
});
