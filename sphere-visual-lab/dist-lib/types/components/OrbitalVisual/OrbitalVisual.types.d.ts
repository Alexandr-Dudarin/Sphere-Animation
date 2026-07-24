import type { OrbitalPresetName } from './catalog/orbitalCatalog';
export type { OrbitalPresetName } from './catalog/orbitalCatalog';
export type OrbitalQuality = 'low' | 'medium' | 'high';
export type OrbitalGlowIntensity = 'low' | 'medium' | 'high';
export type OrbitalBackground = 'transparent' | 'dark';
export type OrbitalCoreKind = 'atomic' | 'planet' | 'gyro' | 'portal';
export type OrbitalRingStyle = 'energy' | 'planetary';
export type OrbitalGyroSpatialMotion = 'planar-orbit' | 'axial-reveal' | 'axial-reveal-horizontal';
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
export interface OrbitalPlanetDustPresetConfig {
    enabled: boolean;
    density: number;
    size: number;
    brightness: number;
    motion: number;
    tintRgb: string;
}
export interface OrbitalGyroRingPresetConfig {
    radius: number;
    thickness: number;
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    spinSpeed: number;
    direction: 1 | -1;
    phase: number;
    spatialMotion: OrbitalGyroSpatialMotion;
    spatialSpeed: number;
    spatialDirection: 1 | -1;
    spatialPhase: number;
    segments: number;
    gapRatio: number;
    railInset: number;
    railThicknessScale: number;
    opacity: number;
    markerCount: number;
    offsetX?: number;
    offsetY?: number;
    offsetZ?: number;
}
export interface OrbitalGyroPresetConfig {
    coreScale: number;
    corePulse: number;
    coreRotationSpeed: number;
    coreShellOpacity: number;
    coreGlowOpacity: number;
    rings: OrbitalGyroRingPresetConfig[];
}
export interface OrbitalPortalRingPresetConfig {
    radius: number;
    thickness: number;
    depthOffset: number;
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    segments: number;
    gapRatio: number;
    spinSpeed: number;
    direction: 1 | -1;
    phase: number;
    opacity: number;
    accentMix: number;
    hotMix: number;
    markerEvery: number;
}
export interface OrbitalPortalPresetConfig {
    membraneRadius: number;
    membraneOpacity: number;
    membraneFlowSpeed: number;
    membraneTurbulence: number;
    membranePulse: number;
    membraneDepth: number;
    frameTiltX: number;
    frameTiltY: number;
    frameTiltZ: number;
    frameRotationSpeed: number;
    rings: OrbitalPortalRingPresetConfig[];
}
export interface OrbitalPresetConfig {
    coreKind?: OrbitalCoreKind;
    ringStyle?: OrbitalRingStyle;
    planetDust?: OrbitalPlanetDustPresetConfig;
    gyro?: OrbitalGyroPresetConfig;
    portal?: OrbitalPortalPresetConfig;
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
    frameloop?: 'always' | 'demand' | 'never';
}
//# sourceMappingURL=OrbitalVisual.types.d.ts.map