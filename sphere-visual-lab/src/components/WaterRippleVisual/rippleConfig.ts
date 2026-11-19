export const rippleDefaults = {
  speed: 0.7,
  glowIntensity: 1.3,
  amplitude: 0.008,
  lineWidth: 0.02,
  damping: 0.55,
  rippleInterval: 4.8,
  tilt: 22,
  color: '#168dff',
} as const;

export const DROP_FALL_DURATION = 1.05;
export const DROP_START_HEIGHT = 1.35;
export const DROP_HEIGHT = 0.38;
export const DROP_RADIUS = 0.105;

/** Stable stage; only the internal object scale changes with size and tilt. */
export function getRippleDiameter(size: number, width: number, height: number, tilt: number, withDrop: boolean) {
  const radians = tilt * Math.PI / 180;
  const top = Math.max(2.8 * Math.sin(radians) + 0.15 * Math.cos(radians),
    withDrop ? (DROP_START_HEIGHT + DROP_HEIGHT) * Math.cos(radians) : 0);
  return Math.min(size, width * 0.94, height * 0.88 * 5.6 / (2 * top));
}
