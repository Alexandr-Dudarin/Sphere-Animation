import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';
interface LightsProps {
    colors: {
        halo: THREE.Color;
        accent: THREE.Color;
        violet: THREE.Color;
        pink: THREE.Color;
    };
    glowIntensity: GlowIntensity;
}
export default function Lights({ colors, glowIntensity }: LightsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Lights.d.ts.map