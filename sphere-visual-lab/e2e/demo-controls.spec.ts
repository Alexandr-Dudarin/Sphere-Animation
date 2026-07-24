import { expect, test, type Locator, type Page } from '@playwright/test';

async function selectCustomOption(
  page: Page,
  triggerId: string,
  optionName: string,
) {
  await page.locator(`#${triggerId}`).click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}

async function openOrbitalSection(page: Page) {
  const orbitalHeading = page.getByRole('heading', {
    level: 2,
    name: 'Reusable Orbital Visual v1',
  });

  await orbitalHeading.scrollIntoViewIfNeeded();

  const orbitalStage = page.locator('.previewStage').nth(1);
  const orbitalCanvas = orbitalStage.locator('canvas');

  await expect(orbitalCanvas).toBeVisible({ timeout: 30_000 });

  return { orbitalStage, orbitalCanvas };
}

async function expectWithinViewportWidth(
  locator: Locator,
  viewportWidth: number,
  tolerance = 2,
) {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();
  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(-tolerance);
  expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + tolerance);
}

test('переключение Orbital-семейств выбирает их базовые пресеты', async ({
  page,
}) => {
  await page.goto('/');

  const { orbitalCanvas } = await openOrbitalSection(page);
  const objectTrigger = page.locator('#orbital-object');
  const presetTrigger = page.locator('#orbital-preset');
  const orbitalInfo = page.locator('.infoBox').nth(1);

  const families = [
    {
      objectLabel: 'ring-planet — кольцевые планеты',
      objectValue: 'ring-planet',
      defaultPresetLabel: 'ring-planet — сдержанная планета',
      defaultPresetValue: 'ring-planet',
      title: 'Ring Planet',
    },
    {
      objectLabel: 'gyro-core — механические ядра',
      objectValue: 'gyro-core',
      defaultPresetLabel: 'gyro-core — базовое гироскопическое ядро',
      defaultPresetValue: 'gyro-core',
      title: 'Gyro Core',
    },
    {
      objectLabel: 'portal-gate — энергетические порталы',
      objectValue: 'portal-gate',
      defaultPresetLabel: 'portal-gate — базовый энергетический портал',
      defaultPresetValue: 'portal-gate',
      title: 'Portal Gate',
    },
    {
      objectLabel: 'atomic-orb — атомные системы',
      objectValue: 'atomic-orb',
      defaultPresetLabel: 'atomic-orb — базовый атом',
      defaultPresetValue: 'atomic-orb',
      title: 'Atomic Orb',
    },
  ] as const;

  for (const family of families) {
    await selectCustomOption(page, 'orbital-object', family.objectLabel);

    await expect(objectTrigger).toContainText(family.objectLabel);
    await expect(presetTrigger).toContainText(family.defaultPresetLabel);
    await expect(orbitalInfo).toContainText(family.title);
    await expect(orbitalCanvas).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.localStorage.getItem('sphere-visual-lab:orbital-preset'),
        ),
      )
      .toBe(family.defaultPresetValue);

    await expect(objectTrigger).toContainText(family.objectValue);
  }
});

test('фоны сцены и компонента переключаются без потери Canvas', async ({
  page,
}) => {
  await page.goto('/');

  const sphereStage = page.locator('.previewStage').first();
  const sphereCanvas = sphereStage.locator('canvas');

  await expect(sphereCanvas).toBeVisible();

  await selectCustomOption(
    page,
    'stage-background',
    'tech — технологическая сетка',
  );
  await selectCustomOption(page, 'background', 'dark — тёмный');

  await expect(sphereStage).toHaveAttribute('data-stage-background', 'tech');
  await expect(page.locator('#background')).toContainText('dark — тёмный');
  await expect(sphereCanvas).toBeVisible();

  const { orbitalStage, orbitalCanvas } = await openOrbitalSection(page);

  await selectCustomOption(
    page,
    'orbital-stage-background',
    'studio — студийное свечение',
  );
  await selectCustomOption(
    page,
    'orbital-background',
    'dark — тёмный',
  );

  await expect(orbitalStage).toHaveAttribute(
    'data-stage-background',
    'studio',
  );
  await expect(page.locator('#orbital-background')).toContainText(
    'dark — тёмный',
  );
  await expect(orbitalCanvas).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() => ({
        sphere: window.localStorage.getItem(
          'sphere-visual-lab:sphere-stage-background',
        ),
        orbital: window.localStorage.getItem(
          'sphere-visual-lab:orbital-stage-background',
        ),
      })),
    )
    .toEqual({ sphere: 'tech', orbital: 'studio' });

  await page.reload();

  await expect(page.locator('.previewStage').first()).toHaveAttribute(
    'data-stage-background',
    'tech',
  );
  await expect(page.locator('.previewStage').nth(1)).toHaveAttribute(
    'data-stage-background',
    'studio',
  );
});

test('карточка Orbital-пресета синхронизирует сцену, селекты и прокрутку', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const orbitalCatalog = page.getByRole('region', {
    name: 'Orbital-пресеты по семействам',
  });
  const icePlanetCard = orbitalCatalog.getByRole('button', {
    name: /ring-planet-ice/,
  });

  await icePlanetCard.scrollIntoViewIfNeeded();
  await icePlanetCard.click();

  await expect(icePlanetCard).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#orbital-object')).toContainText(
    'ring-planet — кольцевые планеты',
  );
  await expect(page.locator('#orbital-preset')).toContainText(
    'ring-planet-ice — ледяная планета',
  );

  const orbitalDemo = page.locator('.demoLayout.demoAnchor').nth(1);
  await expect(orbitalDemo).toBeInViewport({ ratio: 0.25 });
  await expect(orbitalDemo.locator('canvas')).toBeVisible({ timeout: 30_000 });
});

test('Orbital-пресет сохраняется и восстанавливается после перезагрузки', async ({
  page,
}) => {
  await page.goto('/');
  await openOrbitalSection(page);

  await selectCustomOption(
    page,
    'orbital-object',
    'portal-gate — энергетические порталы',
  );
  await selectCustomOption(
    page,
    'orbital-preset',
    'portal-gate-violet — фиолетовый портал',
  );

  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem('sphere-visual-lab:orbital-preset'),
      ),
    )
    .toBe('portal-gate-violet');

  await page.reload();

  await expect(page.locator('#orbital-object')).toContainText(
    'portal-gate — энергетические порталы',
  );
  await expect(page.locator('#orbital-preset')).toContainText(
    'portal-gate-violet — фиолетовый портал',
  );

  const selectedCard = page
    .getByRole('region', { name: 'Orbital-пресеты по семействам' })
    .getByRole('button', { name: /portal-gate-violet/ });

  await expect(selectedCard).toHaveAttribute('aria-pressed', 'true');
});

test('мобильная ширина не создаёт горизонтальный скролл и сохраняет управление', async ({
  page,
}) => {
  const viewportWidth = 390;

  await page.setViewportSize({ width: viewportWidth, height: 790 });
  await page.goto('/');

  const sphereStage = page.locator('.previewStage').first();
  const spherePanel = page.locator('.controlPanel').first();

  await expectWithinViewportWidth(sphereStage, viewportWidth);
  await expectWithinViewportWidth(spherePanel, viewportWidth);
  await expect(sphereStage.locator('canvas')).toBeVisible();

  await selectCustomOption(page, 'mode', 'idle — спокойный');
  await expect(page.locator('#mode')).toContainText('idle — спокойный');

  const { orbitalStage, orbitalCanvas } = await openOrbitalSection(page);
  const orbitalPanel = page.locator('.controlPanel').nth(1);

  await expectWithinViewportWidth(orbitalStage, viewportWidth);
  await expectWithinViewportWidth(orbitalPanel, viewportWidth);
  await expect(orbitalCanvas).toBeVisible();

  await selectCustomOption(
    page,
    'orbital-object',
    'gyro-core — механические ядра',
  );
  await expect(page.locator('#orbital-preset')).toContainText(
    'gyro-core — базовое гироскопическое ядро',
  );

  const pageWidths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(pageWidths.scrollWidth).toBeLessThanOrEqual(
    pageWidths.clientWidth + 1,
  );
});
