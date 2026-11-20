import { expect, test } from '@playwright/test';

const variants = [
  ['rain', 'Дождь'], ['interactive', 'Касание воды'],
] as const;

for (const [variant, title] of variants) {
  test(`water collection: ${variant} renders, freezes, and fits mobile`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('/#water-ripple');
    const surface = page.locator('[data-water-ripple]');
    const section = page.locator('#water-ripple');
    await section.scrollIntoViewIfNeeded();
    await expect(surface).toHaveAttribute('data-water-variant', 'droplet');
    const before = await surface.boundingBox();
    await page.locator('#water-ripple').getByRole('button', { name: title, exact: true }).click();
    await expect(surface).toHaveAttribute('data-water-variant', variant);
    await surface.scrollIntoViewIfNeeded();
    const after = await surface.boundingBox();
    expect(after!.width).toBe(before!.width);
    expect(after!.height).toBe(before!.height);
    const canvas = surface.locator('canvas');
    await expect(canvas).toBeVisible();
    if (variant === 'interactive') {
      await canvas.click({ position: { x: after!.width * 0.42, y: after!.height * 0.5 } });
      await surface.focus();
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(550);
    await testInfo.attach(`${variant}-desktop`, { body: await canvas.screenshot(), contentType: 'image/png' });
    await page.locator('#water-ripple').getByRole('button', { name: 'Пауза', exact: true }).click();
    await expect(surface).toHaveAttribute('data-frameloop', 'demand');
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const frozen = await canvas.screenshot();
    expect((await canvas.screenshot()).equals(frozen)).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    await surface.scrollIntoViewIfNeeded();
    await expect(canvas).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await testInfo.attach(`${variant}-mobile`, { body: await canvas.screenshot(), contentType: 'image/png' });
    expect(errors).toEqual([]);
  });
}

test('touch water stays still until interaction, including when revisiting it', async ({ page }, testInfo) => {
  await page.goto('/#water-ripple');
  const section = page.locator('#water-ripple');
  const surface = section.locator('[data-water-ripple]');
  const canvas = surface.locator('canvas');
  await section.scrollIntoViewIfNeeded();
  const select = async (name: string) => {
    await section.getByRole('button', { name, exact: true }).click();
    await surface.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
  };
  await select('Касание воды');
  const idle = await canvas.screenshot();
  await testInfo.attach('interactive-before-touch', { body: idle, contentType: 'image/png' });
  await page.waitForTimeout(1200);
  expect((await canvas.screenshot()).equals(idle)).toBe(true);
  await canvas.hover();
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(idle)).toBe(false);
  await select('Дождь');
  await select('Касание воды');
  expect((await canvas.screenshot()).equals(idle)).toBe(true);
  await surface.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(idle)).toBe(false);
});

test('four water variants preserve independent ring and drop interval settings', async ({ page }) => {
  await page.goto('/#water-ripple');
  const section = page.locator('#water-ripple');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('group', { name: 'Вариант воды' }).getByRole('button')).toHaveCount(4);
  const interval = section.locator('#water-interval');
  await expect(interval).toHaveValue('4');
  await interval.fill('5');
  await section.getByRole('button', { name: 'Только круги', exact: true }).click();
  await expect(interval).toHaveValue('4.8');
  await interval.fill('6');
  await section.getByRole('button', { name: 'Падающая капля', exact: true }).click();
  await expect(interval).toHaveValue('5');
  await section.getByRole('button', { name: 'Только круги', exact: true }).click();
  await expect(interval).toHaveValue('6');
});
