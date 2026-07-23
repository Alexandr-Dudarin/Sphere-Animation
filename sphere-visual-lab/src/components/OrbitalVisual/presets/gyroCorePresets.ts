import type {
  OrbitalGyroPresetConfig,
  OrbitalGyroRingPresetConfig,
  OrbitalPresetConfig,
} from '../OrbitalVisual.types';

const gyroCoreBase: OrbitalPresetConfig = {
  coreKind: 'gyro',

  coreRgb: '145 218 230',
  glowRgb: '58 204 232',
  accentRgb: '108 118 132',
  hotRgb: '248 255 255',

  ringCount: 3,
  baseRadius: 1,
  ringThickness: 0.046,

  coreSize: 0.29,
  haloSize: 0.42,
  haloOpacity: 0.012,
  coreGlowOpacity: 0.12,
  coreInnerOpacity: 1,

  families: [],

  gyro: {
    coreScale: 1.1,
    corePulse: 0.011,
    coreRotationSpeed: 0.095,
    coreShellOpacity: 0.021,
    coreGlowOpacity: 0.14,

    rings: [
      {
        /*
         * Кольцо 1 — самое большое.
         * Остаётся основным диагональным
         * hero-контуром: почти ребром к
         * зрителю и с плавным вращением
         * в экранной плоскости.
         */
        radius: 1.46,
        thickness: 0.044,
        tiltX: 1.29,
        tiltY: 0.1,
        tiltZ: -0.24,

        spinSpeed: 0.14,
        direction: 1,
        phase: 0.04,

        spatialMotion: 'planar-orbit',
        spatialSpeed: 0.169,
        spatialDirection: 1,
        spatialPhase: 0.11,

        segments: 4,
        gapRatio: 0.025,
        railInset: 0.014,
        railThicknessScale: 0.15,
        opacity: 0.96,
        markerCount: 1,
        offsetY: -0.065,
      },
      {
        /*
         * Кольцо 2 — среднее.
         * Теперь это горизонтальное
         * reveal-кольцо: оно не повторяет
         * траекторию большого, а циклически
         * раскрывается от положения ребром
         * до широкого горизонтального овала.
         */
        radius: 1.16,
        thickness: 0.037,
        tiltX: 0.08,
        tiltY: -0.2,
        tiltZ: 0.04,

        spinSpeed: 0.21,
        direction: -1,
        phase: 0.37,

        spatialMotion: 'axial-reveal-horizontal',
        spatialSpeed: 0.241,
        spatialDirection: -1,
        spatialPhase: 2.38,

        segments: 5,
        gapRatio: 0.035,
        railInset: 0.012,
        railThicknessScale: 0.17,
        opacity: 0.88,
        markerCount: 1,
        offsetX: -0.012,
        offsetY: 0.028,
      },
      {
        /*
         * Кольцо 3 — маленькое.
         * Сохраняет вертикальное reveal-
         * движение и работает быстрее двух
         * остальных, но без простого
         * отношения скоростей 1.5x.
         */
        radius: 0.92,
        thickness: 0.033,
        tiltX: 0.18,
        tiltY: 0,
        tiltZ: 0.07,

        spinSpeed: 0.3,
        direction: 1,
        phase: 0.67,

        spatialMotion: 'axial-reveal',
        spatialSpeed: 0.287,
        spatialDirection: 1,
        spatialPhase: 0.78,

        segments: 4,
        gapRatio: 0.045,
        railInset: 0.01,
        railThicknessScale: 0.19,
        opacity: 0.9,
        markerCount: 1,
        offsetX: 0,
        offsetY: 0.015,
      },
    ],
  },
};

interface GyroPresetOverrides
  extends Omit<
    Partial<OrbitalPresetConfig>,
    'families' | 'gyro'
  > {
  gyro?: Omit<
    Partial<OrbitalGyroPresetConfig>,
    'rings'
  > & {
    rings?: OrbitalGyroRingPresetConfig[];
  };
}

function cloneGyroRing(
  ring: OrbitalGyroRingPresetConfig,
): OrbitalGyroRingPresetConfig {
  return {
    ...ring,
  };
}

function createGyroPreset(
  overrides: GyroPresetOverrides = {},
): OrbitalPresetConfig {
  const baseGyro =
    gyroCoreBase.gyro!;

  const rings =
    overrides.gyro?.rings ??
    baseGyro.rings;

  return {
    ...gyroCoreBase,
    ...overrides,
    families: [],
    gyro: {
      ...baseGyro,
      ...overrides.gyro,
      rings:
        rings.map(cloneGyroRing),
    },
  };
}

const gyroCorePrecision =
  createGyroPreset({
    coreRgb: '236 250 255',
    glowRgb: '153 226 255',
    accentRgb: '116 145 167',
    hotRgb: '255 255 255',

    coreSize: 0.272,
    haloSize: 0.39,
    haloOpacity: 0.009,
    coreGlowOpacity: 0.105,

    gyro: {
      coreScale: 1.035,
      corePulse: 0.006,
      coreRotationSpeed: 0.072,
      coreShellOpacity: 0.028,
      coreGlowOpacity: 0.115,

      rings:
        gyroCoreBase.gyro!.rings.map(
          (ring, index) => ({
            ...ring,
            thickness:
              [
                0.038,
                0.032,
                0.028,
              ][index] ??
              ring.thickness,
            spinSpeed:
              [
                0.118,
                0.176,
                0.248,
              ][index] ??
              ring.spinSpeed,
            spatialSpeed:
              [
                0.154,
                0.219,
                0.266,
              ][index] ??
              ring.spatialSpeed,
            opacity:
              [
                0.9,
                0.82,
                0.84,
              ][index] ??
              ring.opacity,
            railThicknessScale:
              [
                0.13,
                0.15,
                0.17,
              ][index] ??
              ring.railThicknessScale,
          }),
        ),
    },
  });

const gyroCoreReactor =
  createGyroPreset({
    coreRgb: '232 224 255',
    glowRgb: '103 225 255',
    accentRgb: '118 76 178',
    hotRgb: '255 246 255',

    coreSize: 0.315,
    haloSize: 0.48,
    haloOpacity: 0.018,
    coreGlowOpacity: 0.17,

    gyro: {
      coreScale: 1.16,
      corePulse: 0.017,
      coreRotationSpeed: 0.138,
      coreShellOpacity: 0.034,
      coreGlowOpacity: 0.205,

      rings:
        gyroCoreBase.gyro!.rings.map(
          (ring, index) => ({
            ...ring,
            thickness:
              [
                0.049,
                0.041,
                0.036,
              ][index] ??
              ring.thickness,
            spinSpeed:
              [
                0.176,
                0.264,
                0.372,
              ][index] ??
              ring.spinSpeed,
            spatialSpeed:
              [
                0.181,
                0.258,
                0.307,
              ][index] ??
              ring.spatialSpeed,
            opacity:
              [
                0.98,
                0.93,
                0.95,
              ][index] ??
              ring.opacity,
            railThicknessScale:
              [
                0.18,
                0.2,
                0.22,
              ][index] ??
              ring.railThicknessScale,
          }),
        ),
    },
  });

const gyroCoreAmber =
  createGyroPreset({
    coreRgb: '255 224 170',
    glowRgb: '244 160 68',
    accentRgb: '116 72 42',
    hotRgb: '255 247 220',

    coreSize: 0.296,
    haloSize: 0.4,
    haloOpacity: 0.01,
    coreGlowOpacity: 0.11,

    gyro: {
      coreScale: 1.085,
      corePulse: 0.008,
      coreRotationSpeed: 0.068,
      coreShellOpacity: 0.024,
      coreGlowOpacity: 0.13,

      rings:
        gyroCoreBase.gyro!.rings.map(
          (ring, index) => ({
            ...ring,
            thickness:
              [
                0.05,
                0.042,
                0.036,
              ][index] ??
              ring.thickness,
            spinSpeed:
              [
                0.112,
                0.169,
                0.238,
              ][index] ??
              ring.spinSpeed,
            spatialSpeed:
              [
                0.146,
                0.207,
                0.252,
              ][index] ??
              ring.spatialSpeed,
            opacity:
              [
                0.94,
                0.86,
                0.89,
              ][index] ??
              ring.opacity,
            railThicknessScale:
              [
                0.16,
                0.18,
                0.2,
              ][index] ??
              ring.railThicknessScale,
          }),
        ),
    },
  });

export const gyroCorePresets = {
  'gyro-core':
    gyroCoreBase,

  'gyro-core-precision':
    gyroCorePrecision,

  'gyro-core-reactor':
    gyroCoreReactor,

  'gyro-core-amber':
    gyroCoreAmber,
} satisfies Record<string, OrbitalPresetConfig>;
