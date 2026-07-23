import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface PetalPulseColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface PetalPulseFieldProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: PetalPulseColors;
    pulseStrength: number;
}
export default function PetalPulseField({ speed, reducedMotion, glowIntensity, colors, pulseStrength, }: PetalPulseFieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PetalPulseField.d.ts.map