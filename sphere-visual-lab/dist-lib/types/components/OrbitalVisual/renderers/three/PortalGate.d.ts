import * as THREE from 'three';
import type { OrbitalPortalPresetConfig, OrbitalQuality } from '../../OrbitalVisual.types';
interface PortalGateColors {
    core: THREE.Color;
    glow: THREE.Color;
    accent: THREE.Color;
    hot: THREE.Color;
}
interface PortalGateProps {
    config: OrbitalPortalPresetConfig;
    colors: PortalGateColors;
    quality: OrbitalQuality;
    speed: number;
    glowFactor: number;
}
export default function PortalGate({ config, colors, quality, speed, glowFactor, }: PortalGateProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PortalGate.d.ts.map