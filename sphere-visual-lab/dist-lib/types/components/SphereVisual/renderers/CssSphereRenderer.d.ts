import type { GlowIntensity, SphereMode, SpherePresetConfig, SphereQuality } from '../SphereVisual.types';
interface CssSphereRendererProps {
    presetConfig: SpherePresetConfig;
    mode: SphereMode;
    quality: SphereQuality;
    interactive: boolean;
    glowIntensity: GlowIntensity;
    speed: number;
    pointerX: number;
    pointerY: number;
    reducedMotion: boolean;
}
export default function CssSphereRenderer({ presetConfig, mode, quality, interactive, glowIntensity, speed, pointerX, pointerY, reducedMotion, }: CssSphereRendererProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CssSphereRenderer.d.ts.map