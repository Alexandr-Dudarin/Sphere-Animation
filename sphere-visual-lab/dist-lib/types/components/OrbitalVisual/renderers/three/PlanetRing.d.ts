import * as THREE from 'three';
import type { OrbitalPlanetDustPresetConfig } from '../../OrbitalVisual.types';
interface PlanetRingProps {
    radius: number;
    thickness: number;
    ellipseX: number;
    ellipseY: number;
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    wobble: number;
    seed: number;
    baseColor: THREE.Color;
    opacity: number;
    flowSpeed: number;
    shimmerSpeed: number;
    offset: number;
    speed: number;
    glowFactor: number;
    splitDepthLayers?: boolean;
    dust?: OrbitalPlanetDustPresetConfig;
}
export default function PlanetRing({ radius, thickness, ellipseX, ellipseY, tiltX, tiltY, tiltZ, wobble, seed, baseColor, opacity, flowSpeed, shimmerSpeed, offset, speed, glowFactor, splitDepthLayers, dust, }: PlanetRingProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlanetRing.d.ts.map