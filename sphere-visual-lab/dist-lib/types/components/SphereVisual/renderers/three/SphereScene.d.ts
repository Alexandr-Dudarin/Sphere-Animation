import type { GlowIntensity, SphereMode, SpherePresetConfig, SphereQuality } from '../../SphereVisual.types';
interface SphereSceneProps {
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
export default function SphereScene(props: SphereSceneProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SphereScene.d.ts.map