import type {
  SpherePresetConfig,
  SpherePresetName,
} from '../SphereVisual.types';

export const spherePresets = {
  'glass-petal': {
    coreRgb: '28 48 148',
    accentRgb: '102 223 255',
    haloRgb: '182 244 255',
    ringRgb: '122 136 255',
    noiseOpacity: 0.08,
  },
  'soft-ai': {
    coreRgb: '27 55 158',
    accentRgb: '68 181 255',
    haloRgb: '173 244 255',
    ringRgb: '91 143 255',
    noiseOpacity: 0.1,
  },
  'thinking-blue': {
    coreRgb: '20 44 176',
    accentRgb: '53 162 255',
    haloRgb: '137 238 255',
    ringRgb: '64 108 255',
    noiseOpacity: 0.12,
  },
  'searching-violet': {
    coreRgb: '52 47 168',
    accentRgb: '122 90 255',
    haloRgb: '198 175 255',
    ringRgb: '89 132 255',
    noiseOpacity: 0.14,
  },
} satisfies Record<SpherePresetName, SpherePresetConfig>;