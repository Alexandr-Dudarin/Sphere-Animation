import { bounded } from './rippleTiming';
import { rippleDefaults } from './rippleConfig';

export const SOURCE_HEIGHT = 1.83;
export const SOURCE_TOP = 2.43;
export const FREE_FALL_DURATION = 0.66;
export const NECK_RETRACTION_DURATION = 0.09;
const FALLING_TIP_EXTENSION = 0.32;
const FALLING_TAPER = 0.18;

export function getDropletStartTime(interval: number) {
  return -bounded(interval, rippleDefaults.rippleInterval, 3, 10) - FREE_FALL_DURATION
    + NECK_RETRACTION_DURATION;
}

export const SOURCE_SEQUENCE_START = getDropletStartTime(rippleDefaults.rippleInterval);
export const BODY_RADIUS = 0.112;
const RELEASE_STRETCH = 1.5;
const NECK_LENGTH = 0.12;
const RELEASE_HEIGHT = SOURCE_HEIGHT - NECK_LENGTH - BODY_RADIUS * RELEASE_STRETCH;
const RELEASE_VELOCITY = 0.1;
const GRAVITY = 2 * (RELEASE_HEIGHT - BODY_RADIUS - RELEASE_VELOCITY * FREE_FALL_DURATION)
  / (FREE_FALL_DURATION * FREE_FALL_DURATION);

export interface LiquidPose {
  visible: boolean;
  position: [number, number, number];
  scale: [number, number, number];
  tilt: number;
  taper: number;
  tip: number;
  opacity: number;
}

const smooth = (p: number) => p * p * (3 - 2 * p);
const clamp01 = (p: number) => Math.max(0, Math.min(1, p));

function pose(height: number, radius: number, vertical: number, opacity = 1): LiquidPose {
  return { visible: opacity > 0, position: [0, 0, height], scale: [radius, vertical, radius], tilt: 0, taper: 0, tip: 0, opacity };
}

function impactPose(age: number, radius: number, bodyHeight = radius): LiquidPose {
  const p = clamp01(age / 0.12);
  const vertical = bodyHeight * Math.max(0.03, 1 - p);
  return pose(vertical, radius * (1 + 0.5 * p), vertical, 1 - p);
}

/** t=0 is water contact; no second clock or random per-frame deformation. */
export function getDropletSequence(time: number, interval: number) {
  const period = bounded(interval, rippleDefaults.rippleInterval, 3, 10);
  const phase = ((time % period) + period) % period;
  // Keep the short trailing-drop contact window on the current cycle.
  const relative = time < 0 ? time : phase < 0.55 ? phase : phase - period;
  // Source growth has its own phase on the SAME clock. It continues while
  // the preceding drop is falling and while its waves spread and fade.
  const sinceRelease = ((time + FREE_FALL_DURATION) % period + period) % period;
  const growth = clamp01((sinceRelease - NECK_RETRACTION_DURATION)
    / (period - NECK_RETRACTION_DURATION));
  const shape = smooth(growth);
  // Cube-root radial growth keeps filling gradual; axial stretch models neck pull.
  const radius = BODY_RADIUS * Math.cbrt(0.035 + 0.965 * growth);
  const vertical = radius * (0.72 + 0.78 * shape);
  const length = NECK_LENGTH * shape;
  const source = pose(SOURCE_HEIGHT - length - vertical, radius, vertical,
    smooth(clamp01(sinceRelease / NECK_RETRACTION_DURATION)));
  source.taper = 0.28 * shape;
  const pinch = smooth(clamp01((growth - 0.72) / 0.28));
  let neck = pose(SOURCE_HEIGHT - length / 2, 0.027 * (1 - pinch) + 0.003,
    Math.max(0.004, length / 2 + 0.008));
  if (sinceRelease < NECK_RETRACTION_DURATION) {
    const retract = sinceRelease / NECK_RETRACTION_DURATION;
    neck = pose(SOURCE_HEIGHT - NECK_LENGTH * (1 - retract) / 2,
      0.003 + retract * 0.027, (NECK_LENGTH / 2 + 0.008) * (1 - retract) + 0.008 * retract);
  }

  let main = pose(0, BODY_RADIUS, BODY_RADIUS, 0);
  let stage: 'forming' | 'falling' | 'impact' = 'forming';
  if (relative >= -FREE_FALL_DURATION && relative < 0) {
    const elapsed = relative + FREE_FALL_DURATION;
    const progress = elapsed / FREE_FALL_DURATION;
    const settle = 1 - smooth(clamp01(progress / 0.22));
    const wobble = 0.09 * Math.sin(elapsed * 26) * Math.exp(-elapsed * 3)
      * Math.sin(progress * Math.PI);
    const stretch = 1 + (RELEASE_STRETCH - 1) * settle + wobble;
    const radial = BODY_RADIUS / Math.sqrt(stretch / RELEASE_STRETCH);
    const height = RELEASE_HEIGHT - RELEASE_VELOCITY * elapsed - GRAVITY * elapsed * elapsed / 2;
    main = pose(height, radial, BODY_RADIUS * stretch);
    main.taper = FALLING_TAPER + (0.28 - FALLING_TAPER) * settle;
    main.tip = FALLING_TIP_EXTENSION * smooth(clamp01(elapsed / 0.1)) * (1 - 0.15 * progress);
    main.tilt = 0.055 * Math.sin(elapsed * 18) * Math.sin(progress * Math.PI);
    stage = 'falling';
  } else if (relative >= 0 && relative < 0.12) {
    main = impactPose(relative, BODY_RADIUS * Math.sqrt(RELEASE_STRETCH), BODY_RADIUS);
    main.taper = FALLING_TAPER * (1 - relative / 0.12);
    main.tip = FALLING_TIP_EXTENSION * 0.85 * (1 - relative / 0.12);
    stage = 'impact';
  }

  const satellites = [
    { delay: 0.09, radius: 0.027, sign: -1 },
    { delay: 0.18, radius: 0.019, sign: 1 },
  ].map(({ delay, radius, sign }) => {
    const elapsed = relative + FREE_FALL_DURATION - delay;
    const start = SOURCE_HEIGHT - 0.085;
    const hit = Math.sqrt(2 * (start - radius) / GRAVITY);
    if (elapsed < 0 || elapsed > hit + 0.12) return pose(start, radius, radius, 0);
    if (elapsed >= hit) return impactPose(elapsed - hit, radius);
    const p = elapsed / hit;
    const stretch = 1 + 0.08 * Math.sin(elapsed * 24) * Math.sin(Math.PI * p);
    const bead = pose(start - GRAVITY * elapsed * elapsed / 2,
      radius / Math.sqrt(stretch), radius * stretch, smooth(clamp01(elapsed / 0.045)));
    bead.position[0] = sign * 0.04 * Math.sin(Math.PI * p);
    return bead;
  });
  return { main, source, neck, satellites, stage };
}

/** Additional headroom applies to the droplet variant only. */
export function fitDropletDiameter(diameter: number, containerHeight: number, tilt: number) {
  const angle = tilt * Math.PI / 180;
  const top = SOURCE_TOP * Math.cos(angle) + 0.24 * Math.sin(angle);
  return Math.min(diameter, containerHeight * 0.44 * 5.6 / top);
}
