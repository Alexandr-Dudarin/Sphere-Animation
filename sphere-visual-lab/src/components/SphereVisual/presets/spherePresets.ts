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
    violetRgb: '128 104 255',
    pinkRgb: '232 118 255',
    mintRgb: '108 255 223',
    whiteRgb: '255 255 255',
    noiseOpacity: 0.08,
  },

  'soft-ai': {
    coreRgb: '27 55 158',
    accentRgb: '68 181 255',
    haloRgb: '173 244 255',
    ringRgb: '91 143 255',
    violetRgb: '128 104 255',
    pinkRgb: '232 118 255',
    mintRgb: '108 255 223',
    whiteRgb: '255 255 255',
    noiseOpacity: 0.1,
  },

  'thinking-blue': {
    coreRgb: '20 44 176',
    accentRgb: '53 162 255',
    haloRgb: '137 238 255',
    ringRgb: '64 108 255',
    violetRgb: '112 126 255',
    pinkRgb: '198 150 255',
    mintRgb: '112 246 230',
    whiteRgb: '255 255 255',
    noiseOpacity: 0.12,
  },

  'searching-violet': {
    coreRgb: '52 47 168',
    accentRgb: '122 90 255',
    haloRgb: '198 175 255',
    ringRgb: '89 132 255',
    violetRgb: '158 122 255',
    pinkRgb: '255 96 184',
    mintRgb: '124 255 224',
    whiteRgb: '255 255 255',
    noiseOpacity: 0.14,
  },

  'calm-pearl': {
    coreRgb: '42 54 122',
    accentRgb: '145 196 255',
    haloRgb: '214 239 255',
    ringRgb: '167 180 255',
    violetRgb: '184 170 255',
    pinkRgb: '243 196 255',
    mintRgb: '190 255 241',
    whiteRgb: '255 252 255',
    noiseOpacity: 0.08,
  },

  'neon-core': {
    coreRgb: '18 32 118',
    accentRgb: '53 214 255',
    haloRgb: '157 248 255',
    ringRgb: '72 132 255',
    violetRgb: '121 98 255',
    pinkRgb: '255 74 202',
    mintRgb: '82 255 228',
    whiteRgb: '255 255 255',
    noiseOpacity: 0.13,
  },

  'bio-glow': {
    coreRgb: '20 72 88',
    accentRgb: '76 218 206',
    haloRgb: '185 255 240',
    ringRgb: '92 180 170',
    violetRgb: '126 152 255',
    pinkRgb: '205 170 255',
    mintRgb: '92 255 215',
    whiteRgb: '245 255 252',
    noiseOpacity: 0.09,
  },
} satisfies Record<SpherePresetName, SpherePresetConfig>;