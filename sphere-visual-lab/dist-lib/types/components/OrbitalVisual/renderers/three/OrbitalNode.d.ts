import * as THREE from 'three';
interface OrbitalNodeProps {
    radius: number;
    wobble: number;
    seed: number;
    ellipseX: number;
    ellipseY: number;
    size: number;
    glowSize: number;
    speed: number;
    offset: number;
    pulseOffset: number;
    color: THREE.Color;
    glowColor: THREE.Color;
    opacity: number;
}
export default function OrbitalNode({ radius, wobble, seed, ellipseX, ellipseY, size, glowSize, speed, offset, pulseOffset, color, glowColor, opacity, }: OrbitalNodeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OrbitalNode.d.ts.map