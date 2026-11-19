import { rippleDefaults } from './rippleConfig';

export function bounded(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

/** Avoid wall-clock jumps after a suspended tab or a demand-rendered scene. */
export function advanceRippleTime(time: number, delta: number, speed: number) {
  return time + bounded(delta, 0, 0, 0.05) * bounded(speed, rippleDefaults.speed, 0, 3);
}
