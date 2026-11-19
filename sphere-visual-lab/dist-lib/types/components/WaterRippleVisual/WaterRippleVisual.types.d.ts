export type WaterRippleQuality = 'low' | 'medium' | 'high';
export type WaterRippleBackground = 'transparent' | 'dark';
export type WaterRippleVariant = 'ripples' | 'droplet' | 'rain' | 'interactive' | 'crown' | 'vortex' | 'waterfall';
/** A procedural water surface; all animation runs locally without textures. */
export interface WaterRippleVisualProps {
    size?: number;
    width?: number | string;
    height?: number | string;
    quality?: WaterRippleQuality;
    background?: WaterRippleBackground;
    color?: string;
    /** Water effect. Defaults to a drop forming at a pouring lip. */
    variant?: WaterRippleVariant;
    /** Rain density, vortex depth, or waterfall flow strength, 0.3–2. */
    intensity?: number;
    /** Simulation speed, 0–3. Zero freezes the current wave. */
    speed?: number;
    /** Emissive strength, 0–2. */
    glowIntensity?: number;
    /** Relief used for lighting, 0–0.15. Ring geometry stays on the surface. */
    amplitude?: number;
    /** Width of the luminous core, 0.004–0.05 scene units. */
    lineWidth?: number;
    /** Radial attenuation, 0.2–2. */
    damping?: number;
    /** Seconds between drops at speed=1, 3–10. */
    rippleInterval?: number;
    /** Viewing angle above the surface, 10–75 degrees. */
    tilt?: number;
    paused?: boolean;
    /** Trigger a wave in interactive mode; restart the cycle in the other variants. */
    dropKey?: number;
    frameloop?: 'always' | 'demand' | 'never';
    className?: string;
}
//# sourceMappingURL=WaterRippleVisual.types.d.ts.map