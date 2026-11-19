import { expect, test } from '@playwright/test';

test('water renders without shader errors and its pause freezes the image', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await page.getByRole('link', { name: /Новый объект: круги на воде/ }).click();
  const surface = page.locator('[data-water-ripple]');
  const canvas = surface.locator('canvas');
  await expect(canvas).toBeVisible();
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  await expect(surface).toHaveAttribute('data-frameloop', 'demand');
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const paused = await canvas.screenshot();
  expect((await canvas.screenshot()).equals(paused)).toBe(true);
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click();
  await expect(surface).toHaveAttribute('data-frameloop', 'always');
  await expect.poll(async () => (await canvas.screenshot()).equals(paused)).toBe(false);
  await page.getByRole('button', { name: 'Новая капля', exact: true }).click();
  await page.locator('#water-quality').selectOption('high');
  await expect(canvas).toBeVisible();
  expect(errors).toEqual([]);
});

test('water fits a mobile screen and sleeps when scrolled out of view', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: /Новый объект: круги на воде/ }).click();
  const surface = page.locator('[data-water-ripple]');
  await expect(surface.locator('canvas')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const box = await surface.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(surface).toHaveAttribute('data-frameloop', 'demand');
});

test('water remains static for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: /Новый объект: круги на воде/ }).click();
  await expect(page.locator('[data-water-ripple]')).toHaveAttribute('data-frameloop', 'demand');
});

test('water switches between ripples and falling drop without resetting the stage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Новый объект: круги на воде/ }).click();
  const surface = page.locator('[data-water-ripple]');
  await expect(surface.locator('canvas')).toBeVisible();
  const before = await surface.boundingBox();
  await page.getByRole('button', { name: 'Падающая капля', exact: true }).click();
  await expect(surface).toHaveAttribute('data-water-variant', 'droplet');
  await expect(page.locator('#water-speed')).toHaveValue('0.7');
  const after = await surface.boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await page.getByRole('button', { name: 'Новая капля', exact: true }).click();
  await page.getByRole('button', { name: 'Только круги', exact: true }).click();
  await expect(surface).toHaveAttribute('data-water-variant', 'ripples');
});
