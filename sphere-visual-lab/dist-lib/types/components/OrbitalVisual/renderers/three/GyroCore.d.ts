import * as THREE from 'three';
import type { OrbitalGyroPresetConfig, OrbitalQuality } from '../../OrbitalVisual.types';
interface GyroCoreColors {
    core: THREE.Color;
    glow: THREE.Color;
    accent: THREE.Color;
    hot: THREE.Color;
}
interface GyroCoreProps {
    coreSize: number;
    config: OrbitalGyroPresetConfig;
    colors: GyroCoreColors;
    quality: OrbitalQuality;
    speed: number;
    glowFactor: number;
}
export default function GyroCore({ coreSize, config, colors, quality, speed, glowFactor, }: GyroCoreProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GyroCore.d.ts.map