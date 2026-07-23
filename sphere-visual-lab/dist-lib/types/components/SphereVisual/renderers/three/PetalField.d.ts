import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface PetalFieldColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface PetalFieldProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: PetalFieldColors;
}
export default function PetalField({ speed, reducedMotion, glowIntensity, colors, }: PetalFieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PetalField.d.ts.map