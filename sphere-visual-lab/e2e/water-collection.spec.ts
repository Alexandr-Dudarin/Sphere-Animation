import { expect, test } from '@playwright/test';

const variants = [
  ['rain', 'Дождь'], ['interactive', 'Касание воды'], ['crown', 'Всплеск-корона'],
  ['vortex', 'Водоворот'], ['waterfall', 'Водопад'],
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
    await page.getByRole('button', { name: title, exact: true }).click();
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
    if (variant === 'crown') {
      await page.locator('#water-speed').fill('2');
      await page.getByRole('button', { name: 'Новая капля', exact: true }).click();
      await surface.scrollIntoViewIfNeeded();
      // Observe the full formation → fall → splash sequence, not just an idle frame.
      for (let index = 0; index < 5; index++) {
        await page.waitForTimeout(800);
        await testInfo.attach(`crown-phase-${index}`, { body: await canvas.screenshot(), contentType: 'image/png' });
      }
    } else {
      await page.waitForTimeout(550);
    }
    await testInfo.attach(`${variant}-desktop`, { body: await canvas.screenshot(), contentType: 'image/png' });
    await page.getByRole('button', { name: 'Пауза', exact: true }).click();
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
