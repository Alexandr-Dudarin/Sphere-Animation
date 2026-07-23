import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface InnerVolumeColors {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
}
interface InnerVolumeGlowProps {
    speed: number;
    reducedMotion: boolean;
    glowIntensity: GlowIntensity;
    colors: InnerVolumeColors;
    volumeStrength: number;
}
export default function InnerVolumeGlow({ speed, reducedMotion, glowIntensity, colors, volumeStrength, }: InnerVolumeGlowProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=InnerVolumeGlow.d.ts.map