import * as THREE from 'three';
import type { OrbitalRingStyle } from '../../OrbitalVisual.types';
interface OrbitNodeConfig {
    size: number;
    glowSize: number;
    speed: number;
    offset: number;
    pulseOffset: number;
    opacity: number;
}
interface OrbitRibbonProps {
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
    hotColor: THREE.Color;
    opacity: number;
    flowSpeed: number;
    shimmerSpeed: number;
    rotationSpeed: number;
    offset: number;
    speed: number;
    glowFactor: number;
    ringStyle?: OrbitalRingStyle;
    splitDepthLayers?: boolean;
    nodes?: OrbitNodeConfig[];
}
export default function OrbitRibbon({ radius, thickness, ellipseX, ellipseY, tiltX, tiltY, tiltZ, wobble, seed, baseColor, hotColor, opacity, flowSpeed, shimmerSpeed, offset, speed, glowFactor, ringStyle, splitDepthLayers, nodes, }: OrbitRibbonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OrbitRibbon.d.ts.map