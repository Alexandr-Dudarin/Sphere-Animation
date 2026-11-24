import type { BinaryPresetConfig } from './binaryPresets';

export const BINARY_ROLL = -0.12;
export const INITIAL_ANOMALY = 0.42;
export const ORBIT_RATE = 0.38;

export function clampBinary(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

/** Solve Kepler's equation so motion accelerates toward periapsis. */
export function eccentricAnomaly(mean: number, eccentricity: number) {
  const phase = mean % (Math.PI * 2);
  let angle = phase;
  for (let i = 0; i < 6; i++) {
    angle -= (angle - eccentricity * Math.sin(angle) - phase) /
      (1 - eccentricity * Math.cos(angle));
  }
  return angle;
}

export function binaryPositions(mean: number, separation: number, massRatio: number, eccentricity: number) {
  const angle = eccentricAnomaly(mean, eccentricity);
  const x = separation * (Math.cos(angle) - eccentricity);
  const y = separation * Math.sqrt(1 - eccentricity ** 2) * Math.sin(angle);
  const secondary = 1 / (1 + massRatio);
  const primary = -massRatio * secondary;
  return [[x * primary, y * primary, 0], [x * secondary, y * secondary, 0]] as const;
}

export function advanceBinaryTime(time: number, delta: number, speed: number) {
  return time + (Number.isFinite(delta) ? Math.min(0.05, Math.max(0, delta)) : 0) * speed;
}

/** Both complete orbits (including atmospheres) stay inside a common clear centre. */
export function binaryRingDimensions(config: BinaryPresetConfig, separation: number) {
  const fractions = [config.massRatio / (1 + config.massRatio), 1 / (1 + config.massRatio)];
  const reach = Math.max(...fractions.map((fraction, i) =>
    separation * fraction * (1 + config.eccentricity) + config.planets[i].radius * 1.12));
  const inner = Math.max(1.5, reach + 0.14);
  return { inner, outer: inner + 0.58 };
}

/** Exact projected ellipse bounds plus a spherical atmosphere, covering every orbital phase. */
export function binaryBounds(config: BinaryPresetConfig, separation: number, tilt: number) {
  const xRotation = tilt * Math.PI / 180;
  const c = Math.cos(BINARY_ROLL), s = Math.sin(BINARY_ROLL), ct = Math.cos(xRotation);
  const e = config.eccentricity;
  const axes = [config.massRatio / (1 + config.massRatio), 1 / (1 + config.massRatio)];
  const { outer } = binaryRingDimensions(config, separation);
  // Keep the same framing when the ring is hidden.
  let x = outer * Math.hypot(c, s * ct), y = outer * Math.hypot(s, c * ct);
  axes.forEach((fraction, i) => {
    const a = separation * fraction;
    const b = a * Math.sqrt(1 - e * e);
    const halo = config.planets[i].radius * 1.12;
    x = Math.max(x, Math.abs(a * e * c) + Math.hypot(a * c, b * s * ct) + halo);
    y = Math.max(y, Math.abs(a * e * s) + Math.hypot(a * s, b * c * ct) + halo);
  });
  return { x, y };
}

export function fitBinaryWidth(size: number, width: number, height: number, bounds: { x: number; y: number }) {
  return Math.max(0, Math.min(size, width * 0.92, height * 0.84 * bounds.x / bounds.y));
}
