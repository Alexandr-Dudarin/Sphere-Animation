import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectLocatorInside(
  inner: Locator,
  outer: Locator,
  tolerance = 2,
) {
  await expect(inner).toBeVisible();
  await expect(outer).toBeVisible();

  const [innerBox, outerBox] = await Promise.all([
    inner.boundingBox(),
    outer.boundingBox(),
  ]);

  expect(innerBox).not.toBeNull();
  expect(outerBox).not.toBeNull();

  if (!innerBox || !outerBox) {
    return;
  }

  expect(innerBox.x).toBeGreaterThanOrEqual(outerBox.x - tolerance);
  expect(innerBox.y).toBeGreaterThanOrEqual(outerBox.y - tolerance);
  expect(innerBox.x + innerBox.width).toBeLessThanOrEqual(
    outerBox.x + outerBox.width + tolerance,
  );
  expect(innerBox.y + innerBox.height).toBeLessThanOrEqual(
    outerBox.y + outerBox.height + tolerance,
  );
}

async function selectCustomOption(
  page: Page,
  triggerId: string,
  optionName: string,
) {
  await page.locator(`#${triggerId}`).click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}


test('демо открывается и основная сцена сферы создаёт Canvas', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Reusable AI Sphere v1',
    }),
  ).toBeVisible();

  const sphereStage = page.locator('[data-canvas-size]').first();
  const sphereCanvas = sphereStage.locator('canvas');

  await expect(sphereCanvas).toBeVisible();

  const canvasSize = Number(await sphereStage.getAttribute('data-canvas-size'));
  const renderedSize = Number(
    await sphereStage.getAttribute('data-rendered-size'),
  );

  expect(canvasSize).toBeGreaterThan(0);
  expect(renderedSize).toBeGreaterThan(0);
  expect(renderedSize).toBeLessThanOrEqual(canvasSize);

  await expectLocatorInside(sphereCanvas, sphereStage);
});

test('сфера остаётся внутри сцены при динамической смене ширины', async ({
  page,
}) => {
  await page.goto('/');

  const sphereStage = page.locator('[data-canvas-size]').first();
  const sphereCanvas = sphereStage.locator('canvas');

  await expect(sphereCanvas).toBeVisible();
  await expectLocatorInside(sphereCanvas, sphereStage);

  await page.setViewportSize({ width: 640, height: 900 });
  await expect.poll(async () => sphereStage.getAttribute('data-canvas-size')).not.toBeNull();
  await expectLocatorInside(sphereCanvas, sphereStage);

  await page.setViewportSize({ width: 390, height: 790 });
  await expect
    .poll(async () => Number(await sphereStage.getAttribute('data-canvas-size')))
    .toBeLessThan(440);
  await expectLocatorInside(sphereCanvas, sphereStage);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect
    .poll(async () => Number(await sphereStage.getAttribute('data-canvas-size')))
    .toBeGreaterThanOrEqual(440);
  await expectLocatorInside(sphereCanvas, sphereStage);
});

test('настройка режима сферы сохраняется после перезагрузки', async ({
  page,
}) => {
  await page.goto('/');

  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await selectCustomOption(page, 'mode', 'searching — поиск');
  await expect(page.locator('#mode')).toContainText('searching — поиск');

  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem('sphere-visual-lab:sphere-mode'),
      ),
    )
    .toBe('searching');

  await page.reload();
  await expect(page.locator('#mode')).toContainText('searching — поиск');
});

test('idle warm-up подготавливает Orbital Canvas без фоновой анимации', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.addInitScript(() => {
    window.requestIdleCallback = (callback) => {
      const handle = window.setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => 50,
        });
      }, 0);

      return handle;
    };
    window.cancelIdleCallback = (handle) => window.clearTimeout(handle);
  });

  const orbitalChunkResponse = page.waitForResponse(
    (response) =>
      /\/assets\/OrbitalVisual-[^/]+\.js$/.test(
        new URL(response.url()).pathname,
      ) && response.ok(),
    { timeout: 30_000 },
  );

  await page.goto('/');
  await orbitalChunkResponse;

  const orbitalStage = page.locator('.previewStage').nth(1);

  await expect(orbitalStage).toHaveAttribute('data-frameloop', 'demand');
  await expect(orbitalStage.locator('canvas')).toHaveCount(1, {
    timeout: 30_000,
  });
  await expect(
    orbitalStage.getByText('Подготавливаем orbital-сцену…'),
  ).toBeHidden();
});

test('сцены заранее возобновляются рядом с viewport и паузятся вдали', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.requestIdleCallback = () => 1;
    window.cancelIdleCallback = () => undefined;
  });

  await page.goto('/');

  const sphereStage = page.locator('.previewStage').first();
  const orbitalStage = page.locator('.previewStage').nth(1);
  const orbitalHeading = page.getByRole('heading', {
    level: 2,
    name: 'Reusable Orbital Visual v1',
  });

  await expect(sphereStage).toHaveAttribute('data-frameloop', 'always');

  await orbitalHeading.scrollIntoViewIfNeeded();

  await expect(orbitalStage).toHaveAttribute('data-frameloop', 'always');
  await expect(orbitalStage.locator('canvas')).toBeVisible({
    timeout: 30_000,
  });
  await expect(sphereStage).toHaveAttribute('data-frameloop', 'demand');

  await page.getByRole('heading', {
    level: 1,
    name: 'Reusable AI Sphere v1',
  }).scrollIntoViewIfNeeded();

  await expect(sphereStage).toHaveAttribute('data-frameloop', 'always');
  await expect(orbitalStage).toHaveAttribute('data-frameloop', 'demand');
});
