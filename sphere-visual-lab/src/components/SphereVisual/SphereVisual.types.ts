export type SphereMode = 'idle' | 'thinking' | 'searching';
export type SpherePresetName = 'soft-ai' | 'thinking-blue' | 'searching-violet';
export type SphereQuality = 'low' | 'medium' | 'high';
export type GlowIntensity = 'low' | 'medium' | 'high';
export type SphereBackground = 'transparent' | 'dark';
export type SphereRendererType = 'css' | 'three';

export interface SpherePresetConfig {
  coreRgb: string;
  accentRgb: string;
  haloRgb: string;
  ringRgb: string;
  noiseOpacity: number;
}

export interface SphereVisualProps {
  size?: number;
  width?: number | string;
  height?: number | string;
  mode?: SphereMode;
  preset?: SpherePresetName;
  quality?: SphereQuality;
  interactive?: boolean;
  glowIntensity?: GlowIntensity;
  speed?: number;
  background?: SphereBackground;
  className?: string;
  renderer?: SphereRendererType;
}