import * as THREE from 'three';
interface PlanetCoreColors {
    core: THREE.Color;
    glow: THREE.Color;
    accent: THREE.Color;
    hot: THREE.Color;
}
interface PlanetCoreProps {
    coreSize: number;
    colors: PlanetCoreColors;
    speed: number;
    glowFactor: number;
}
export default function PlanetCore({ coreSize, colors, speed, glowFactor, }: PlanetCoreProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlanetCore.d.ts.map