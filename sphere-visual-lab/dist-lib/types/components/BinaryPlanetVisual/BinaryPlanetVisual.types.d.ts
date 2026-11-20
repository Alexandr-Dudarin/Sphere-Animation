export type BinaryPlanetPreset = 'ice-twins' | 'ice-fire' | 'violet-duet';
export type BinaryPlanetQuality = 'low' | 'medium' | 'high';
export interface BinaryPlanetVisualProps {
    /** Desired width in pixels; the entire orbit is fitted inside the container. */
    size?: number;
    width?: number | string;
    height?: number | string;
    preset?: BinaryPlanetPreset;
    quality?: BinaryPlanetQuality;
    background?: 'transparent' | 'dark';
    /** Animation speed, 0–2. Zero freezes both the orbit and surface rotation. */
    speed?: number;
    /** Semimajor axis of the relative orbit, 2.5–4.5 scene units. */
    separation?: number;
    /** Orbital plane tilt away from a face-on view, 10–70 degrees. */
    tilt?: number;
    /** Atmosphere and orbit glow, 0–2. */
    glowIntensity?: number;
    showOrbits?: boolean;
    paused?: boolean;
    /** Change to return both planets to their starting positions. */
    resetKey?: number;
    frameloop?: 'always' | 'demand' | 'never';
    className?: string;
}
//# sourceMappingURL=BinaryPlanetVisual.types.d.ts.map