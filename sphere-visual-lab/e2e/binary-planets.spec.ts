import { expect, test } from '@playwright/test';

for (const [preset, name] of [['ice-twins', 'Ледяные близнецы'], ['ice-fire', 'Лёд и пламя'], ['violet-duet', 'Фиолетовый дуэт']]) {
  test(`binary system: ${preset} animates, pauses and fits mobile`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('/#binary-planets');
    const section = page.locator('#binary-planets');
    const surface = section.locator('[data-binary-planet]');
    await section.getByRole('button', { name, exact: true }).click();
    await surface.scrollIntoViewIfNeeded();
    await expect(surface).toHaveAttribute('data-binary-preset', preset);
    const canvas = surface.locator('canvas');
    await expect(canvas).toBeVisible();
    const initial = await canvas.screenshot();
    await expect.poll(async () => (await canvas.screenshot()).equals(initial)).toBe(false);
    await section.getByRole('button', { name: 'Пауза', exact: true }).click();
    await surface.scrollIntoViewIfNeeded();
    await expect(surface).toHaveAttribute('data-frameloop', 'demand');
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const still = await canvas.screenshot();
    expect((await canvas.screenshot()).equals(still)).toBe(true);
    await testInfo.attach(`binary-${preset}-desktop`, { body: still, contentType: 'image/png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await surface.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await testInfo.attach(`binary-${preset}-mobile`, { body: await canvas.screenshot(), contentType: 'image/png' });
    expect(errors).toEqual([]);
  });
}

test('binary controls resize inside a stable stage and allow transparent, ring-free export', async ({ page }, testInfo) => {
  await page.goto('/#binary-planets');
  const section = page.locator('#binary-planets');
  await section.scrollIntoViewIfNeeded();
  const surface = section.locator('[data-binary-planet]');
  const canvas = surface.locator('canvas');
  await surface.scrollIntoViewIfNeeded();
  await section.getByRole('button', { name: 'Пауза', exact: true }).click();
  const before = await surface.boundingBox();
  await page.locator('#binary-size').fill('280');
  await surface.scrollIntoViewIfNeeded();
  const small = await canvas.screenshot();
  await page.locator('#binary-size').fill('800');
  await surface.scrollIntoViewIfNeeded();
  expect((await canvas.screenshot()).equals(small)).toBe(false);
  const after = await surface.boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await section.getByLabel('Показывать общее кольцо').uncheck();
  await section.getByLabel('Прозрачный фон', { exact: true }).check();
  await page.locator('#binary-tilt').fill('80');
  await page.locator('#binary-separation').fill('1.9');
  await page.locator('#binary-quality').selectOption('high');
  await surface.scrollIntoViewIfNeeded();
  await testInfo.attach('binary-transparent-no-ring', { body: await canvas.screenshot(), contentType: 'image/png' });
  await section.getByRole('button', { name: 'В начало орбиты' }).click();
  await surface.scrollIntoViewIfNeeded();
  const reset = await canvas.screenshot();
  await section.getByRole('button', { name: 'В начало орбиты' }).click();
  await surface.scrollIntoViewIfNeeded();
  expect((await canvas.screenshot()).equals(reset)).toBe(true);
  await section.getByRole('button', { name: 'Продолжить', exact: true }).click();
  await surface.scrollIntoViewIfNeeded();
  await expect.poll(async () => (await canvas.screenshot()).equals(reset)).toBe(false);
});

test('binary scene sleeps outside the viewport and respects reduced motion', async ({ page }) => {
  await page.goto('/#binary-planets');
  await page.locator('#binary-planets').scrollIntoViewIfNeeded();
  const surface = page.locator('[data-binary-planet]');
  await surface.scrollIntoViewIfNeeded();
  await expect(surface).toHaveAttribute('data-frameloop', 'always');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(surface).toHaveAttribute('data-frameloop', 'demand');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await surface.scrollIntoViewIfNeeded();
  await expect(surface).toHaveAttribute('data-frameloop', 'demand');
  await page.locator('#binary-speed').fill('0');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(surface).toHaveAttribute('data-frameloop', 'demand');
});

// Time-spaced review frames cover conjunctions as well as the initial side-by-side view.
test('shared ring surrounds the moving pair at several orbital phases', async ({ page }, testInfo) => {
  await page.goto('/#binary-planets');
  const section = page.locator('#binary-planets');
  await section.scrollIntoViewIfNeeded();
  const surface = section.locator('[data-binary-planet]');
  await page.locator('#binary-speed').fill('2');
  await section.getByRole('button', { name: 'В начало орбиты' }).click();
  await surface.scrollIntoViewIfNeeded();
  const canvas = surface.locator('canvas');
  for (let phase = 0; phase < 4; phase++) {
    await testInfo.attach(`binary-shared-ring-phase-${phase}`, {
      body: await canvas.screenshot(), contentType: 'image/png',
    });
    if (phase < 3) await page.waitForTimeout(2100);
  }
  await section.getByRole('button', { name: 'Пауза', exact: true }).click();
  await section.getByRole('button', { name: 'В начало орбиты' }).click();
  await surface.scrollIntoViewIfNeeded();
  const ringVisible = await canvas.screenshot();
  await section.getByLabel('Показывать общее кольцо').uncheck();
  await surface.scrollIntoViewIfNeeded();
  expect((await canvas.screenshot()).equals(ringVisible)).toBe(false);
  await section.getByLabel('Показывать общее кольцо').check();
  await surface.scrollIntoViewIfNeeded();
  expect((await canvas.screenshot()).equals(ringVisible)).toBe(true);
});
