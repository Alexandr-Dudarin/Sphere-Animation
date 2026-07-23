import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface GlassShellColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface GlassShellProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: GlassShellColors;
    shellStrength: number;
}
export default function GlassShell({ speed, reducedMotion, glowIntensity, colors, shellStrength, }: GlassShellProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GlassShell.d.ts.map