import type {
  GlowIntensity,
  SphereBackground,
  SphereMode,
  SpherePresetName,
  SphereQuality,
} from '../../components/SphereVisual/SphereVisual.types';

export const SPHERE_DEFAULTS = {
  size: 420,
  mode: 'thinking' as SphereMode,
  preset: 'glass-petal' as SpherePresetName,
  quality: 'high' as SphereQuality,
  interactive: true,
  glowIntensity: 'high' as GlowIntensity,
  speed: 1.1,
  background: 'dark' as SphereBackground,
};