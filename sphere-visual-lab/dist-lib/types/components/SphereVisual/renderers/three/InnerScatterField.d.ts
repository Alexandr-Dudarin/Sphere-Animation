import * as THREE from 'three';
type GlowIntensity = 'low' | 'medium' | 'high' | number;
type SphereColors = {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
};
type InnerScatterFieldProps = {
    speed?: number;
    reducedMotion?: boolean;
    interactive?: boolean;
    glowIntensity?: GlowIntensity;
    colors: SphereColors;
    scatterStrength: number;
};
export default function InnerScatterField({ speed, reducedMotion, glowIntensity, colors, scatterStrength, }: InnerScatterFieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=InnerScatterField.d.ts.map