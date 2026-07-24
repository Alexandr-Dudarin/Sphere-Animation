import type { OrbitalGlowIntensity, OrbitalPresetConfig, OrbitalQuality } from '../OrbitalVisual.types';
interface ThreeOrbitalCanvasProps {
    presetConfig: OrbitalPresetConfig;
    quality: OrbitalQuality;
    glowIntensity: OrbitalGlowIntensity;
    speed: number;
    visualScale: number;
    frameloop: 'always' | 'demand' | 'never';
}
export default function ThreeOrbitalCanvas({ quality, visualScale, frameloop, ...sceneProps }: ThreeOrbitalCanvasProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThreeOrbitalCanvas.d.ts.map