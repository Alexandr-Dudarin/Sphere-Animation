import { describe, expect, it } from 'vitest';
import {
  BODY_RADIUS, FREE_FALL_DURATION, SOURCE_HEIGHT, SOURCE_SEQUENCE_START, SOURCE_TOP,
  fitDropletDiameter, getDropletSequence, getDropletStartTime, NECK_RETRACTION_DURATION,
} from './dropletSequence';
import { getRippleDiameter } from './rippleConfig';

const sample = (time: number, interval = 4.8) => getDropletSequence(time, interval);

describe('droplet from a pouring lip', () => {
  it('grows attached to the lip and pinches its neck before detaching', () => {
    const initial = sample(SOURCE_SEQUENCE_START);
    const grown = sample(-FREE_FALL_DURATION - 1e-7);
    expect(initial.source.position[2] + initial.source.scale[1]).toBeCloseTo(SOURCE_HEIGHT);
    expect(grown.source.scale[0]).toBeGreaterThan(initial.source.scale[0]);
    expect(grown.source.scale[1]).toBeGreaterThan(initial.source.scale[1]);
    expect(grown.neck.scale[0]).toBeLessThan(initial.neck.scale[0]);
    expect(grown.source.position[2] + grown.source.scale[1])
      .toBeGreaterThan(grown.neck.position[2] - grown.neck.scale[1]);
  });

  it('does not jump in position or shape when it leaves the lip or touches water', () => {
    for (const boundary of [-FREE_FALL_DURATION, 0]) {
      const previous = sample(boundary - 1e-7);
      const before = boundary < 0 ? previous.source : previous.main;
      const after = sample(boundary + 1e-7).main;
      for (let axis = 0; axis < 3; axis++) {
        expect(before.position[axis]).toBeCloseTo(after.position[axis], 5);
        expect(before.scale[axis]).toBeCloseTo(after.scale[axis], 5);
      }
      expect(before.taper).toBeCloseTo(after.taper, 5);
      expect(before.tip).toBeCloseTo(after.tip, 5);
    }
  });

  it('accelerates downward and meets the water exactly at the wave clock zero', () => {
    const heights = [-0.6, -0.4, -0.2, 0].map(t => sample(t).main.position[2]);
    const travel = heights.slice(1).map((h, i) => heights[i] - h);
    expect(travel[0]).toBeGreaterThan(0);
    expect(travel[1]).toBeGreaterThan(travel[0]);
    expect(travel[2]).toBeGreaterThan(travel[1]);
    const contact = sample(0).main;
    expect(contact.position[2] - contact.scale[1]).toBeCloseTo(0, 8);
    expect(contact.scale[1]).toBeCloseTo(BODY_RADIUS);
    expect(sample(0.06).main.scale[1]).toBeLessThan(contact.scale[1]);
    expect(sample(0.121).main.visible).toBe(false);
  });

  it('relaxes and wobbles during free fall without a change in ellipsoid volume', () => {
    const poses = [-0.63, -0.5, -0.4, -0.25, -0.1].map(t => sample(t).main);
    const volume = poses[0].scale.reduce((a, b) => a * b, 1);
    for (const pose of poses) expect(pose.scale.reduce((a, b) => a * b, 1)).toBeCloseTo(volume, 9);
    expect(Math.max(...poses.map(p => p.tilt))).toBeGreaterThan(0);
    expect(Math.min(...poses.map(p => p.tilt))).toBeLessThan(0);
  });

  it('releases two smaller followers after the main drop, with later contact', () => {
    expect(sample(-FREE_FALL_DURATION).satellites.every(p => !p.visible)).toBe(true);
    const falling = sample(-0.4);
    expect(falling.satellites).toHaveLength(2);
    for (const bead of falling.satellites) {
      expect(bead.visible).toBe(true);
      expect(bead.position[2]).toBeGreaterThan(falling.main.position[2]);
      expect(bead.scale[0]).toBeLessThan(falling.main.scale[0] / 3);
    }
    for (const bead of sample(0).satellites) expect(bead.position[2] - bead.scale[1]).toBeGreaterThan(0);
    expect(sample(0.54).satellites.every(p => !p.visible)).toBe(true);
  });

  it('repeats the same sequence at every allowed interval', () => {
    for (const interval of [3, 4.8, 10]) {
      for (const time of [-1, -0.6, -0.3, -0.0001, 0.06, 1]) {
        const first = sample(time, interval);
        const next = sample(time + interval, interval);
        expect(next.stage).toBe(first.stage);
        for (let i = 0; i < 3; i++) {
          expect(next.main.position[i]).toBeCloseTo(first.main.position[i], 8);
          expect(next.source.position[i]).toBeCloseTo(first.source.position[i], 8);
          expect(next.source.scale[i]).toBeCloseTo(first.source.scale[i], 8);
        }
      }
    }
  });

  it('keeps the source attached and all scales finite throughout two cycles', () => {
    for (let t = SOURCE_SEQUENCE_START; t < 9.6; t += 0.01) {
      const state = sample(t);
      for (const pose of [state.main, state.source, state.neck, ...state.satellites]) {
        expect(pose.scale.every(s => Number.isFinite(s) && s > 0)).toBe(true);
        expect(pose.position.every(Number.isFinite)).toBe(true);
        expect(pose.opacity).toBeGreaterThanOrEqual(0);
        expect(pose.opacity).toBeLessThanOrEqual(1);
      }
      expect(state.neck.visible).toBe(true);
      expect(state.neck.position[2] + state.neck.scale[1]).toBeGreaterThanOrEqual(SOURCE_HEIGHT - 1e-8);
    }
  });

  it('keeps accumulating throughout the wave cycle, including while the previous drop falls', () => {
    for (const interval of [3, 4.8, 10]) {
      let previousRadius = 0;
      for (let age = NECK_RETRACTION_DURATION + 0.001; age < interval; age += 0.05) {
        const source = sample(age - FREE_FALL_DURATION, interval).source;
        expect(source.visible).toBe(true);
        expect(source.scale[0]).toBeGreaterThan(previousRadius);
        previousRadius = source.scale[0];
      }
      expect(sample(1, interval).source.scale[0]).toBeGreaterThan(sample(0, interval).source.scale[0]);
    }
  });

  it('starts with a small attached bead for every interval without an early phantom fall', () => {
    for (const interval of [3, 4.8, 10]) {
      const time = getDropletStartTime(interval);
      const state = sample(time, interval);
      expect(state.source.scale[0]).toBeCloseTo(BODY_RADIUS * Math.cbrt(0.035), 8);
      expect(state.source.position[2] + state.source.scale[1]).toBeCloseTo(SOURCE_HEIGHT, 8);
      expect(state.main.visible).toBe(false);
      expect(state.satellites.every(p => !p.visible)).toBe(true);
      expect(sample(time + 0.1, interval).source.scale[0]).toBeGreaterThan(state.source.scale[0]);
    }
  });

  it('retains a gently extended upper tip during free fall and blends it into contact', () => {
    expect(sample(-FREE_FALL_DURATION).main.tip).toBe(0);
    for (const time of [-0.5, -0.3, -0.1, -0.0001]) {
      const falling = sample(time).main;
      expect(falling.tip).toBeGreaterThan(0.25);
      expect(falling.tip).toBeLessThanOrEqual(0.32);
      expect(falling.taper).toBeGreaterThanOrEqual(0.18);
    }
    expect(sample(0.06).main.tip).toBeLessThan(sample(0).main.tip);
    expect(sample(-0.3).satellites.every(p => p.tip === 0)).toBe(true);
  });

  it('fits the source above the water at narrow and wide viewport sizes', () => {
    for (const [width, height] of [[300, 200], [1000, 580]]) {
      for (const tilt of [10, 22, 75]) {
        const base = getRippleDiameter(700, width, height, tilt, true);
        const diameter = fitDropletDiameter(base, height, tilt);
        const angle = tilt * Math.PI / 180;
        const top = SOURCE_TOP * Math.cos(angle) + 0.24 * Math.sin(angle);
        expect(diameter).toBeLessThanOrEqual(base);
        expect(top * diameter / 5.6).toBeLessThanOrEqual(height * 0.44 + 1e-8);
      }
    }
  });
});
