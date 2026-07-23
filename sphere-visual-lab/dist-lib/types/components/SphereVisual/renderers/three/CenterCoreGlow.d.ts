import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface CenterCoreColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface CenterCoreGlowProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: CenterCoreColors;
    centerStrength: number;
}
export default function CenterCoreGlow({ speed, reducedMotion, glowIntensity, colors, centerStrength, }: CenterCoreGlowProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CenterCoreGlow.d.ts.map