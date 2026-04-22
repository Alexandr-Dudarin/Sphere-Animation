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
  preset: 'soft-ai' as SpherePresetName,
  quality: 'medium' as SphereQuality,
  interactive: true,
  glowIntensity: 'medium' as GlowIntensity,
  speed: 1,
  background: 'dark' as SphereBackground,
};