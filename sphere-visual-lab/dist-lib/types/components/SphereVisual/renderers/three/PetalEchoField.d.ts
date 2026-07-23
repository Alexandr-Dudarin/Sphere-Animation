import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface PetalEchoColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface PetalEchoFieldProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: PetalEchoColors;
    echoStrength: number;
}
export default function PetalEchoField({ speed, reducedMotion, glowIntensity, colors, echoStrength, }: PetalEchoFieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PetalEchoField.d.ts.map