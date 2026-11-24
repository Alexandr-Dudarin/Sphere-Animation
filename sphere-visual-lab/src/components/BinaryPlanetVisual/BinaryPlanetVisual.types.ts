export type BinaryPlanetPreset = 'ice-twins' | 'ice-fire' | 'violet-duet';
export type BinaryPlanetQuality = 'low' | 'medium' | 'high';

export interface BinaryPlanetVisualProps {
  /** Desired width in pixels; both planets and the shared ring is fitted inside the container. */
  size?: number;
  width?: number | string;
  height?: number | string;
  preset?: BinaryPlanetPreset;
  quality?: BinaryPlanetQuality;
  background?: 'transparent' | 'dark';
  /** Animation speed, 0–2. Zero freezes both the orbit and surface rotation. */
  speed?: number;
  /** Semimajor axis of the relative orbit, 1.35–1.9 scene units. Defaults to 1.4 for ice-twins, 1.5 otherwise. */
  separation?: number;
  /** Orbital plane tilt away from a face-on view, 10–80 degrees. */
  tilt?: number;
  /** Surface lighting and shared ring glow, 0–2. */
  glowIntensity?: number;
  /** Show the common planetary ring around both bodies. */
  showRing?: boolean;
  /** @deprecated Use showRing. Kept for existing working-version integrations. */
  showOrbits?: boolean;
  paused?: boolean;
  /** Change to return both planets to their starting positions. */
  resetKey?: number;
  frameloop?: 'always' | 'demand' | 'never';
  className?: string;
}
