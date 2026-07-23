import * as THREE from 'three';
interface PlanetRingDustProps {
    radius: number;
    thickness: number;
    ellipseX: number;
    ellipseY: number;
    wobble: number;
    seed: number;
    baseColor: THREE.Color;
    opacity: number;
    speed: number;
    glowFactor: number;
    density: number;
    size: number;
    brightness: number;
    motion: number;
    tintRgb: string;
    splitDepthLayers: boolean;
}
export default function PlanetRingDust({ radius, thickness, ellipseX, ellipseY, wobble, seed, baseColor, opacity, speed, glowFactor, density, size, brightness, motion, tintRgb, splitDepthLayers, }: PlanetRingDustProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlanetRingDust.d.ts.map