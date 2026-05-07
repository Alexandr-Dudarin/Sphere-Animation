import type {
  OrbitalPresetConfig,
  OrbitalPresetName,
} from '../OrbitalVisual.types';

export const orbitalPresets = {
  'atomic-orb': {
    coreRgb: '214 245 255',
    glowRgb: '114 220 255',
    accentRgb: '116 140 255',
    hotRgb: '255 255 255',
    ringCount: 6,
    baseRadius: 0.92,
    ringThickness: 0.015,
    coreSize: 0.14,
    haloSize: 0.34,
  },
} satisfies Record<OrbitalPresetName, OrbitalPresetConfig>;