import type { GlowIntensity, SphereMode, SpherePresetConfig, SphereQuality } from '../SphereVisual.types';
interface ThreeSphereRendererProps {
    presetConfig: SpherePresetConfig;
    mode: SphereMode;
    quality: SphereQuality;
    interactive: boolean;
    glowIntensity: GlowIntensity;
    speed: number;
    pointerX: number;
    pointerY: number;
    reducedMotion: boolean;
    visualScale: number;
    frameloop: 'always' | 'demand' | 'never';
}
export default function ThreeSphereRenderer(props: ThreeSphereRendererProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThreeSphereRenderer.d.ts.map