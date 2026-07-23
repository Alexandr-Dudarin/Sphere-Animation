import * as THREE from 'three';
import type { OrbitalPortalRingPresetConfig, OrbitalQuality } from '../../OrbitalVisual.types';
interface PortalRingColors {
    glow: THREE.Color;
    accent: THREE.Color;
    hot: THREE.Color;
}
interface PortalRingProps {
    config: OrbitalPortalRingPresetConfig;
    colors: PortalRingColors;
    quality: OrbitalQuality;
    speed: number;
    glowFactor: number;
    index: number;
}
export default function PortalRing({ config, colors, quality, speed, glowFactor, index, }: PortalRingProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PortalRing.d.ts.map