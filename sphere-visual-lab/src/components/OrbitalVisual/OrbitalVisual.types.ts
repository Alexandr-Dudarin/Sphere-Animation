export type OrbitalPresetName =
  | 'atomic-orb'
  | 'atomic-orb-no-electrons'
  | 'atomic-orb-more-electrons'
  | 'atomic-orb-white'
  | 'atomic-orb-violet'
  | 'ring-planet';

export type OrbitalQuality = 'low' | 'medium' | 'high';
export type OrbitalGlowIntensity = 'low' | 'medium' | 'high';
export type OrbitalBackground = 'transparent' | 'dark';
export type OrbitalCoreKind = 'atomic' | 'planet';

export interface OrbitalNodePresetConfig {
  count: number;
  size: number;
  glowSize: number;
  speed: number;
  offset: number;
}

export interface OrbitalEchoPresetConfig {
  radiusScale: number;
  thicknessScale: number;
  tiltOffsetX: number;
  tiltOffsetY: number;
  tiltOffsetZ: number;
  wobbleScale: number;
  opacity: number;
  flowSpeed: number;
  rotationSpeed: number;
  offset: number;
}

export interface OrbitalFamilyPresetConfig {
  radiusScale: number;
  ellipseX: number;
  ellipseY: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  mirrorX?: boolean;
  wobble: number;
  heroThicknessScale: number;
  heroOpacity: number;
  flowSpeed: number;
  rotationSpeed: number;
  shimmerSpeed: number;
  heroAccentMix: number;
  echoAccentMix: number;
  hotColorMix: number;
  driftX: number;
  driftY: number;
  driftZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  breath: number;
  echoes: OrbitalEchoPresetConfig[];
  nodes: OrbitalNodePresetConfig;
}

export interface OrbitalPresetConfig {
  coreKind?: OrbitalCoreKind;
  coreRgb: string;
  glowRgb: string;
  accentRgb: string;
  hotRgb: string;
  ringCount: number;
  baseRadius: number;
  ringThickness: number;
  coreSize: number;
  haloSize: number;
  haloOpacity: number;
  coreGlowOpacity: number;
  coreInnerOpacity: number;
  families: OrbitalFamilyPresetConfig[];
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