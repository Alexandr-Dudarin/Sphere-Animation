import type {
  OrbitalFamilyPresetConfig,
  OrbitalPlanetDustPresetConfig,
  OrbitalPresetConfig,
  OrbitalPresetName,
} from '../OrbitalVisual.types';

const atomicOrbBase: OrbitalPresetConfig = {
  coreKind: 'atomic',

  coreRgb: '214 245 255',
  glowRgb: '114 220 255',
  accentRgb: '116 140 255',
  hotRgb: '255 255 255',

  ringCount: 3,
  baseRadius: 0.92,
  ringThickness: 0.0115,

  coreSize: 0.18,
  haloSize: 0.5,
  haloOpacity: 0.04,
  coreGlowOpacity: 0.2,
  coreInnerOpacity: 0.98,

  families: [
    {
      radiusScale: 1.1,
      ellipseX: 1.05,
      ellipseY: 1.08,
      tiltX: 0.05,
      tiltY: 1.16,
      tiltZ: 0.14,
      wobble: 0.006,
      heroThicknessScale: 1.22,
      heroOpacity: 0.7,
      flowSpeed: 0.285,
      rotationSpeed: 0,
      shimmerSpeed: 0.88,
      heroAccentMix: 0.08,
      echoAccentMix: 0.04,
      hotColorMix: 0.06,
      driftX: 0,
      driftY: 0,
      driftZ: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      breath: 0,
      echoes: [],
      nodes: {
        count: 2,
        size: 0.024,
        glowSize: 1.6,
        speed: 0.1,
        offset: 0.08,
      },
    },
    {
      mirrorX: false,
      radiusScale: 1.01,
      ellipseX: 1.34,
      ellipseY: 0.84,
      tiltX: 0.76,
      tiltY: 0.18,
      tiltZ: 0.4,
      wobble: 0.0065,
      heroThicknessScale: 1.18,
      heroOpacity: 0.64,
      flowSpeed: 0.295,
      rotationSpeed: 0,
      shimmerSpeed: 0.92,
      heroAccentMix: 0.18,
      echoAccentMix: 0.1,
      hotColorMix: 0.07,
      driftX: 0,
      driftY: 0,
      driftZ: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      breath: 0,
      echoes: [],
      nodes: {
        count: 3,
        size: 0.024,
        glowSize: 1.58,
        speed: 0.106,
        offset: 0.24,
      },
    },
    {
      mirrorX: true,
      radiusScale: 1.01,
      ellipseX: 1.34,
      ellipseY: 0.84,
      tiltX: 0.76,
      tiltY: 0.18,
      tiltZ: 0.4,
      wobble: 0.0065,
      heroThicknessScale: 1.18,
      heroOpacity: 0.64,
      flowSpeed: 0.295,
      rotationSpeed: 0,
      shimmerSpeed: 0.92,
      heroAccentMix: 0.18,
      echoAccentMix: 0.1,
      hotColorMix: 0.07,
      driftX: 0,
      driftY: 0,
      driftZ: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      breath: 0,
      echoes: [],
      nodes: {
        count: 3,
        size: 0.024,
        glowSize: 1.58,
        speed: 0.106,
        offset: 0.24,
      },
    },
  ],
};

const ringPlanetBase: OrbitalPresetConfig = {
  coreKind: 'planet',
  ringStyle: 'planetary',

  planetDust: {
    enabled: false,
    density: 1,
    size: 1,
    brightness: 1,
    motion: 1,
    tintRgb: '174 235 255',
  },

  coreRgb: '128 205 255',
  glowRgb: '58 160 255',
  accentRgb: '42 98 220',
  hotRgb: '235 250 255',

  ringCount: 2,
  baseRadius: 0.98,
  ringThickness: 0.0195,

  coreSize: 0.7,
  haloSize: 0.32,
  haloOpacity: 0.008,
  coreGlowOpacity: 0.04,
  coreInnerOpacity: 1,

  families: [
    {
      // Внешнее толстое кольцо — основная планетная плоскость
      radiusScale: 1.16,
      ellipseX: 1.48,
      ellipseY: 0.36,
      tiltX: -0.28,
      tiltY: 0.04,
      tiltZ: -0.08,
      wobble: 0.0025,
      heroThicknessScale: 2.35,
      heroOpacity: 0.76,
      flowSpeed: 0.11,
      rotationSpeed: 0,
      shimmerSpeed: 0.42,
      heroAccentMix: 0.08,
      echoAccentMix: 0.03,
      hotColorMix: 0.04,
      driftX: 0,
      driftY: 0,
      driftZ: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      breath: 0,
      echoes: [],
      nodes: {
        count: 0,
        size: 0.022,
        glowSize: 1.4,
        speed: 0.08,
        offset: 0.1,
      },
    },
    {
      // Внутреннее кольцо — та же плоскость, меньший радиус
      radiusScale: 0.92,
      ellipseX: 1.48,
      ellipseY: 0.36,
      tiltX: -0.28,
      tiltY: 0.04,
      tiltZ: -0.08,
      wobble: 0.0025,
      heroThicknessScale: 1.65,
      heroOpacity: 0.48,
      flowSpeed: 0.09,
      rotationSpeed: 0,
      shimmerSpeed: 0.36,
      heroAccentMix: 0.12,
      echoAccentMix: 0.04,
      hotColorMix: 0.04,
      driftX: 0,
      driftY: 0,
      driftZ: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      breath: 0,
      echoes: [],
      nodes: {
        count: 0,
        size: 0.022,
        glowSize: 1.4,
        speed: 0.08,
        offset: 0.34,
      },
    },
  ],
};

interface RingPlanetPresetOverrides
  extends Omit<
    Partial<OrbitalPresetConfig>,
    'families' | 'planetDust'
  > {
  families?: OrbitalFamilyPresetConfig[];
  planetDust?: Partial<OrbitalPlanetDustPresetConfig>;
}

function clonePlanetFamily(
  family: OrbitalFamilyPresetConfig,
): OrbitalFamilyPresetConfig {
  return {
    ...family,
    echoes: family.echoes.map((echo) => ({
      ...echo,
    })),
    nodes: {
      ...family.nodes,
    },
  };
}

function createRingPlanetPreset(
  overrides: RingPlanetPresetOverrides = {},
): OrbitalPresetConfig {
  const families =
    overrides.families ??
    ringPlanetBase.families;

  return {
    ...ringPlanetBase,
    ...overrides,
    planetDust: {
      ...ringPlanetBase.planetDust!,
      ...overrides.planetDust,
    },
    families:
      families.map(clonePlanetFamily),
  };
}

const ringPlanetSand =
  createRingPlanetPreset({
    coreRgb: '222 181 126',
    glowRgb: '242 196 126',
    accentRgb: '126 78 44',
    hotRgb: '255 239 204',

    haloSize: 0.34,
    haloOpacity: 0.007,
    coreGlowOpacity: 0.038,

    planetDust: {
      tintRgb: '255 218 166',
      motion: 0.76,
    },

    families:
      ringPlanetBase.families.map(
        (family, index) => ({
          ...family,
          flowSpeed:
            index === 0
              ? 0.085
              : 0.068,
          shimmerSpeed:
            index === 0
              ? 0.31
              : 0.26,
          heroOpacity:
            index === 0
              ? 0.7
              : 0.44,
          heroAccentMix:
            index === 0
              ? 0.14
              : 0.18,
          hotColorMix:
            index === 0
              ? 0.08
              : 0.07,
        }),
      ),
  });

const ringPlanetIce =
  createRingPlanetPreset({
    coreRgb: '198 232 246',
    glowRgb: '132 211 255',
    accentRgb: '108 141 198',
    hotRgb: '250 254 255',

    baseRadius: 1.01,
    ringThickness: 0.0165,

    coreSize: 0.64,
    haloSize: 0.36,
    haloOpacity: 0.012,
    coreGlowOpacity: 0.055,

    planetDust: {
      enabled: true,
      density: 0.62,
      size: 0.82,
      brightness: 0.82,
      motion: 0.7,
      tintRgb: '229 248 255',
    },

    families:
      ringPlanetBase.families.map(
        (family, index) => ({
          ...family,
          radiusScale:
            index === 0
              ? 1.24
              : 0.96,
          ellipseX: 1.56,
          ellipseY: 0.31,
          tiltX: -0.24,
          tiltY: 0.03,
          tiltZ: -0.06,
          heroThicknessScale:
            index === 0
              ? 1.88
              : 1.22,
          heroOpacity:
            index === 0
              ? 0.62
              : 0.34,
          flowSpeed:
            index === 0
              ? 0.075
              : 0.058,
          shimmerSpeed:
            index === 0
              ? 0.26
              : 0.22,
          heroAccentMix:
            index === 0
              ? 0.04
              : 0.08,
          hotColorMix:
            index === 0
              ? 0.09
              : 0.08,
        }),
      ),
  });

const ringPlanetEclipse =
  createRingPlanetPreset({
    coreRgb: '118 76 52',
    glowRgb: '235 143 69',
    accentRgb: '84 42 30',
    hotRgb: '255 218 157',

    baseRadius: 0.94,
    ringThickness: 0.022,

    coreSize: 0.74,
    haloSize: 0.29,
    haloOpacity: 0.006,
    coreGlowOpacity: 0.03,

    planetDust: {
      enabled: true,
      density: 0.34,
      size: 1.04,
      brightness: 1.08,
      motion: 0.55,
      tintRgb: '255 176 86',
    },

    families:
      ringPlanetBase.families.map(
        (family, index) => ({
          ...family,
          radiusScale:
            index === 0
              ? 1.08
              : 0.86,
          ellipseX: 1.42,
          ellipseY: 0.42,
          tiltX: -0.34,
          tiltY: 0.055,
          tiltZ: -0.11,
          heroThicknessScale:
            index === 0
              ? 2.55
              : 1.72,
          heroOpacity:
            index === 0
              ? 0.82
              : 0.5,
          flowSpeed:
            index === 0
              ? 0.062
              : 0.05,
          shimmerSpeed:
            index === 0
              ? 0.22
              : 0.18,
          heroAccentMix:
            index === 0
              ? 0.2
              : 0.24,
          hotColorMix:
            index === 0
              ? 0.14
              : 0.12,
        }),
      ),
  });

const gyroCoreBase: OrbitalPresetConfig = {
  coreKind: 'gyro',

  coreRgb: '143 215 228',
  glowRgb: '55 202 232',
  accentRgb: '92 104 118',
  hotRgb: '247 255 255',

  ringCount: 3,
  baseRadius: 1,
  ringThickness: 0.046,

  coreSize: 0.26,
  haloSize: 0.4,
  haloOpacity: 0.012,
  coreGlowOpacity: 0.12,
  coreInnerOpacity: 1,

  families: [],

  gyro: {
    coreScale: 1.08,
    corePulse: 0.012,
    coreRotationSpeed: 0.1,
    coreShellOpacity: 0.024,
    coreGlowOpacity: 0.16,

    rings: [
      {
        radius: 1.36,
        thickness: 0.047,
        tiltX: 1.24,
        tiltY: 0.08,
        tiltZ: -0.16,
        spinSpeed: 0.09,
        direction: 1,
        phase: 0.04,
        segments: 4,
        gapRatio: 0.045,
        railInset: 0.014,
        railThicknessScale: 0.16,
        opacity: 0.96,
        markerCount: 2,
        offsetY: -0.1,
      },
      {
        radius: 1.06,
        thickness: 0.042,
        tiltX: 0.74,
        tiltY: 0.82,
        tiltZ: 0.46,
        spinSpeed: 0.135,
        direction: -1,
        phase: 0.34,
        segments: 5,
        gapRatio: 0.06,
        railInset: 0.012,
        railThicknessScale: 0.18,
        opacity: 0.94,
        markerCount: 2,
        offsetX: 0.035,
        offsetY: 0.025,
      },
      {
        radius: 0.8,
        thickness: 0.034,
        tiltX: 0.12,
        tiltY: 1.46,
        tiltZ: -0.1,
        spinSpeed: 0.19,
        direction: 1,
        phase: 0.67,
        segments: 4,
        gapRatio: 0.075,
        railInset: 0.01,
        railThicknessScale: 0.2,
        opacity: 0.9,
        markerCount: 2,
        offsetX: -0.025,
      },
    ],
  },
};

export const orbitalPresets = {
  'atomic-orb': atomicOrbBase,

  'atomic-orb-no-electrons': {
    ...atomicOrbBase,
    families: atomicOrbBase.families.map((family) => ({
      ...family,
      nodes: {
        ...family.nodes,
        count: 0,
      },
    })),
  },

  'atomic-orb-more-electrons': {
    ...atomicOrbBase,
    families: atomicOrbBase.families.map((family, index) => {
      const counts = [4, 6, 6];
      const sizes = [0.022, 0.022, 0.022];
      const glowSizes = [1.52, 1.5, 1.5];

      return {
        ...family,
        nodes: {
          ...family.nodes,
          count: counts[index] ?? family.nodes.count,
          size: sizes[index] ?? family.nodes.size,
          glowSize: glowSizes[index] ?? family.nodes.glowSize,
        },
      };
    }),
  },

  'atomic-orb-white': {
    ...atomicOrbBase,
    coreRgb: '236 248 255',
    glowRgb: '205 232 255',
    accentRgb: '182 208 255',
    hotRgb: '255 255 255',
    haloOpacity: 0.045,
    coreGlowOpacity: 0.22,
    families: atomicOrbBase.families.map((family) => ({
      ...family,
      heroOpacity: Math.min(family.heroOpacity + 0.04, 0.78),
      heroAccentMix: Math.max(family.heroAccentMix - 0.04, 0.04),
      hotColorMix: Math.max(family.hotColorMix - 0.02, 0.04),
    })),
  },

  'atomic-orb-violet': {
    ...atomicOrbBase,
    coreRgb: '228 220 255',
    glowRgb: '171 126 255',
    accentRgb: '118 102 255',
    hotRgb: '255 244 255',
    haloOpacity: 0.045,
    coreGlowOpacity: 0.22,
    families: atomicOrbBase.families.map((family) => ({
      ...family,
      heroAccentMix: Math.min(family.heroAccentMix + 0.08, 0.32),
      echoAccentMix: Math.min(family.echoAccentMix + 0.06, 0.22),
      hotColorMix: Math.min(family.hotColorMix + 0.04, 0.14),
    })),
  },

  'ring-planet':
    createRingPlanetPreset(),

  'ring-planet-stardust':
    createRingPlanetPreset({
      planetDust: {
        enabled: true,
      },
    }),

  'ring-planet-sand':
    ringPlanetSand,

  'ring-planet-sand-stardust':
    createRingPlanetPreset({
      ...ringPlanetSand,
      planetDust: {
        ...ringPlanetSand.planetDust!,
        enabled: true,
        density: 0.84,
        size: 0.94,
        brightness: 0.9,
        motion: 0.74,
        tintRgb: '255 218 166',
      },
      families:
        ringPlanetSand.families,
    }),

  'ring-planet-ice':
    ringPlanetIce,

  'ring-planet-eclipse':
    ringPlanetEclipse,

  'gyro-core':
    gyroCoreBase,
} satisfies Record<OrbitalPresetName, OrbitalPresetConfig>;
