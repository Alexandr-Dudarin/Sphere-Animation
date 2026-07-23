import * as THREE from 'three';
import type { OrbitalGyroRingPresetConfig, OrbitalQuality } from '../../OrbitalVisual.types';
interface GyroRingColors {
    metal: THREE.Color;
    glow: THREE.Color;
    hot: THREE.Color;
}
interface GyroRingProps {
    config: OrbitalGyroRingPresetConfig;
    colors: GyroRingColors;
    quality: OrbitalQuality;
    speed: number;
    glowFactor: number;
    index: number;
}
export default function GyroRing({ config, colors, quality, speed, glowFactor, index, }: GyroRingProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GyroRing.d.ts.map