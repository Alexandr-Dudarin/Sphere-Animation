export type OrbitalPresetName = 'atomic-orb';

export type OrbitalQuality = 'low' | 'medium' | 'high';
export type OrbitalGlowIntensity = 'low' | 'medium' | 'high';
export type OrbitalBackground = 'transparent' | 'dark';

export interface OrbitalPresetConfig {
  coreRgb: string;
  glowRgb: string;
  accentRgb: string;
  hotRgb: string;
  ringCount: number;
  baseRadius: number;
  ringThickness: number;
  coreSize: number;
  haloSize: number;
}

export interface OrbitalVisualProps {
  size?: number;
  width?: number | string;
  height?: number | string;
  preset?: OrbitalPresetName;
  quality?: OrbitalQuality;
  glowIntensity?: OrbitalGlowIntensity;
  speed?: number;
  background?: OrbitalBackground;
  className?: string;
}