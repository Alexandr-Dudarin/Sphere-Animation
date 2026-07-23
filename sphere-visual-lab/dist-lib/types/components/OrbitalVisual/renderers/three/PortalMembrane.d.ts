import * as THREE from 'three';
import type { OrbitalQuality } from '../../OrbitalVisual.types';
interface PortalMembraneColors {
    core: THREE.Color;
    glow: THREE.Color;
    accent: THREE.Color;
    hot: THREE.Color;
}
interface PortalMembraneProps {
    radius: number;
    opacity: number;
    flowSpeed: number;
    turbulence: number;
    pulse: number;
    depth: number;
    colors: PortalMembraneColors;
    quality: OrbitalQuality;
    speed: number;
    glowFactor: number;
}
export default function PortalMembrane({ radius, opacity, flowSpeed, turbulence, pulse, depth, colors, quality, speed, glowFactor, }: PortalMembraneProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PortalMembrane.d.ts.map