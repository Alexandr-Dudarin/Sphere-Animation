import type {
  OrbitalPortalPresetConfig,
  OrbitalPortalRingPresetConfig,
  OrbitalPresetConfig,
} from '../OrbitalVisual.types';

const portalGateBase: OrbitalPresetConfig = {
  coreKind: 'portal',

  coreRgb: '224 251 255',
  glowRgb: '78 225 255',
  accentRgb: '45 91 214',
  hotRgb: '255 255 255',

  ringCount: 3,
  baseRadius: 1,
  ringThickness: 0.055,

  coreSize: 0.82,
  haloSize: 0.72,
  haloOpacity: 0.035,
  coreGlowOpacity: 0.16,
  coreInnerOpacity: 1,

  families: [],

  portal: {
    membraneRadius: 0.82,
    membraneOpacity: 0.86,
    membraneFlowSpeed: 0.52,
    membraneTurbulence: 0.56,
    membranePulse: 0.028,
    membraneDepth: 0.24,

    frameTiltX: 0.06,
    frameTiltY: -0.1,
    frameTiltZ: -0.035,
    frameRotationSpeed: 0.014,

    rings: [
      {
        /*
         * Внешний силовой каркас:
         * массивный, спокойный и с редкими
         * световыми акцентами.
         */
        radius: 1.34,
        thickness: 0.08,
        depthOffset: 0.08,
        tiltX: 0.012,
        tiltY: 0.018,
        tiltZ: 0,
        segments: 10,
        gapRatio: 0.07,
        spinSpeed: 0.072,
        direction: 1,
        phase: 0.06,
        opacity: 0.9,
        accentMix: 0.16,
        hotMix: 0.42,
        markerEvery: 2,
      },
      {
        /*
         * Среднее управляющее кольцо:
         * тоньше, светлее и вращается
         * в противоположную сторону.
         */
        radius: 1.09,
        thickness: 0.039,
        depthOffset: -0.045,
        tiltX: -0.03,
        tiltY: 0.045,
        tiltZ: 0.022,
        segments: 16,
        gapRatio: 0.12,
        spinSpeed: 0.132,
        direction: -1,
        phase: 0.34,
        opacity: 0.82,
        accentMix: 0.38,
        hotMix: 0.5,
        markerEvery: 3,
      },
      {
        /*
         * Внутренний стабилизатор:
         * почти непрерывная тонкая окружность,
         * отделяющая раму от мембраны.
         */
        radius: 0.91,
        thickness: 0.018,
        depthOffset: 0.13,
        tiltX: 0.022,
        tiltY: -0.03,
        tiltZ: -0.016,
        segments: 32,
        gapRatio: 0.07,
        spinSpeed: 0.215,
        direction: 1,
        phase: 0.68,
        opacity: 0.76,
        accentMix: 0.55,
        hotMix: 0.56,
        markerEvery: 8,
      },
    ],
  },
};

interface PortalPresetOverrides
  extends Omit<Partial<OrbitalPresetConfig>, 'families' | 'portal'> {
  portal?: Omit<Partial<OrbitalPortalPresetConfig>, 'rings'> & {
    rings?: OrbitalPortalRingPresetConfig[];
  };
}

function createPortalPreset(
  overrides: PortalPresetOverrides = {},
): OrbitalPresetConfig {
  const basePortal = portalGateBase.portal!;
  const rings = overrides.portal?.rings ?? basePortal.rings;

  return {
    ...portalGateBase,
    ...overrides,
    families: [],
    portal: {
      ...basePortal,
      ...overrides.portal,
      rings: rings.map((ring) => ({ ...ring })),
    },
  };
}

const portalGateViolet = createPortalPreset({
  coreRgb: '244 234 255',
  glowRgb: '185 105 255',
  accentRgb: '69 79 232',
  hotRgb: '255 249 255',

  haloSize: 0.76,
  haloOpacity: 0.042,

  portal: {
    membraneOpacity: 0.8,
    membraneFlowSpeed: 0.66,
    membraneTurbulence: 0.76,
    membranePulse: 0.045,
    frameRotationSpeed: 0.024,
    rings: portalGateBase.portal!.rings.map((ring, index) => ({
      ...ring,
      spinSpeed: [0.12, 0.205, 0.32][index] ?? ring.spinSpeed,
      opacity: [0.92, 0.84, 0.8][index] ?? ring.opacity,
      accentMix: [0.3, 0.5, 0.62][index] ?? ring.accentMix,
      hotMix: [0.42, 0.48, 0.58][index] ?? ring.hotMix,
    })),
  },
});

const portalGateEmber = createPortalPreset({
  coreRgb: '255 231 180',
  glowRgb: '255 146 52',
  accentRgb: '142 48 32',
  hotRgb: '255 250 219',

  haloSize: 0.7,
  haloOpacity: 0.032,

  portal: {
    membraneOpacity: 0.7,
    membraneFlowSpeed: 0.44,
    membraneTurbulence: 0.56,
    membranePulse: 0.034,
    membraneDepth: 0.19,
    frameTiltY: -0.11,
    frameRotationSpeed: 0.012,
    rings: portalGateBase.portal!.rings.map((ring, index) => ({
      ...ring,
      thickness: [0.082, 0.049, 0.026][index] ?? ring.thickness,
      gapRatio: [0.075, 0.15, 0.29][index] ?? ring.gapRatio,
      spinSpeed: [0.074, 0.125, 0.205][index] ?? ring.spinSpeed,
      opacity: [0.94, 0.8, 0.7][index] ?? ring.opacity,
      accentMix: [0.22, 0.4, 0.56][index] ?? ring.accentMix,
      hotMix: [0.34, 0.4, 0.48][index] ?? ring.hotMix,
    })),
  },
});

export const portalGatePresets = {
  'portal-gate':
    createPortalPreset(),

  'portal-gate-violet':
    portalGateViolet,

  'portal-gate-ember':
    portalGateEmber,
} satisfies Record<string, OrbitalPresetConfig>;
