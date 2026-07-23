import type {
  OrbitalPresetConfig,
  OrbitalPresetName,
} from '../OrbitalVisual.types';
import { atomicOrbPresets } from './atomicOrbPresets';
import { gyroCorePresets } from './gyroCorePresets';
import { portalGatePresets } from './portalGatePresets';
import { ringPlanetPresets } from './ringPlanetPresets';

export const orbitalPresets = {
  ...atomicOrbPresets,
  ...ringPlanetPresets,
  ...gyroCorePresets,
  ...portalGatePresets,
} satisfies Record<OrbitalPresetName, OrbitalPresetConfig>;
