import type { SphereMode } from '../SphereVisual.types';

interface SphereModeConfig {
  rotationDuration: number;
  pulseDuration: number;
  orbitOpacity: number;
  haloStrength: number;
}

export const sphereModeConfigs = {
  idle: {
    rotationDuration: 18,
    pulseDuration: 7,
    orbitOpacity: 0.26,
    haloStrength: 0.72,
  },
  thinking: {
    rotationDuration: 12,
    pulseDuration: 5,
    orbitOpacity: 0.42,
    haloStrength: 1,
  },
  searching: {
    rotationDuration: 9,
    pulseDuration: 4,
    orbitOpacity: 0.52,
    haloStrength: 1.14,
  },
} satisfies Record<SphereMode, SphereModeConfig>;