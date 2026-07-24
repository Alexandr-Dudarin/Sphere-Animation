export type SphereMode = 'idle' | 'thinking' | 'searching';
export type SpherePresetName = 'glass-petal' | 'soft-ai' | 'thinking-blue' | 'searching-violet' | 'calm-pearl' | 'neon-core' | 'bio-glow' | 'prism-bloom';
export type SphereQuality = 'low' | 'medium' | 'high';
export type GlowIntensity = 'low' | 'medium' | 'high';
export type SphereBackground = 'transparent' | 'dark';
export type SphereRendererType = 'css' | 'three';
export interface SpherePresetConfig {
    coreRgb: string;
    accentRgb: string;
    haloRgb: string;
    ringRgb: string;
    violetRgb: string;
    pinkRgb: string;
    mintRgb: string;
    whiteRgb?: string;
    noiseOpacity: number;
    shellOpacity: number;
    innerVolumeStrength: number;
    echoStrength: number;
    centerStrength: number;
    scatterStrength: number;
    pulseStrength: number;
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
    frameloop?: 'always' | 'demand' | 'never';
}
//# sourceMappingURL=SphereVisual.types.d.ts.map