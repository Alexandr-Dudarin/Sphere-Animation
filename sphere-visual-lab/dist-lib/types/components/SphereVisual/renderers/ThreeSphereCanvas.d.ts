import type { GlowIntensity, SphereMode, SpherePresetConfig, SphereQuality } from '../SphereVisual.types';
interface ThreeSphereCanvasProps {
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
}
export default function ThreeSphereCanvas({ quality, visualScale, ...sceneProps }: ThreeSphereCanvasProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThreeSphereCanvas.d.ts.map