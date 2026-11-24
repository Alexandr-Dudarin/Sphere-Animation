import { describe, expect, it } from 'vitest';
import { canTraceWave, createImpactSchedule, IMPACT_LIFETIME, MAX_WATER_IMPACTS,
  RAIN_FALL_SECONDS, rainHeight, retainImpacts, scheduleImpacts } from './waterCollectionMotion';

describe('water collection impacts', () => {
  it('keeps rain and impacts on one deterministic timeline at different frame rates', () => {
    const fast = createImpactSchedule();
    const slow = createImpactSchedule();
    for (let frame = 0; frame <= 600; frame++) scheduleImpacts(fast, frame / 60, 1);
    for (let frame = 0; frame <= 200; frame++) scheduleImpacts(slow, frame / 20, 1);
    expect(fast).toEqual(slow);
    for (const impact of fast.impacts) {
      expect(Math.hypot(impact.x, impact.y)).toBeLessThanOrEqual(1.7);
      expect(rainHeight(impact.time, impact.time)).toBeNull();
      expect(rainHeight(impact.time - 0.001, impact.time)).toBeLessThan(0.01);
    }
  });

  it('accelerates the rain toward the water and hides it outside the fall', () => {
    const t = 4;
    expect(rainHeight(t - RAIN_FALL_SECONDS - 0.01, t)).toBeNull();
    const first = rainHeight(t - RAIN_FALL_SECONDS, t)!;
    const middle = rainHeight(t - RAIN_FALL_SECONDS / 2, t)!;
    expect(first).toBeCloseTo(1.65);
    expect(first - middle).toBeLessThan(middle);
    expect(rainHeight(t + 0.01, t)).toBeNull();
  });

  it('keeps the denser rain bounded over long runs without expiring impacts early', () => {
    const state = createImpactSchedule();
    for (let frame = 0; frame <= 6000; frame++) {
      scheduleImpacts(state, frame / 20, 2);
      expect(state.impacts.length).toBeLessThanOrEqual(MAX_WATER_IMPACTS);
    }
    expect(state.impacts[0].time).toBeLessThan(300 - IMPACT_LIFETIME + 0.25);
    for (const impact of state.impacts) {
      expect(Math.hypot(impact.x, impact.y)).toBeLessThanOrEqual(1.7);
      expect(300 - impact.time).toBeLessThanOrEqual(IMPACT_LIFETIME);
    }
  });

  it('changes density without moving already scheduled drops', () => {
    const state = createImpactSchedule();
    scheduleImpacts(state, 2, 0.3);
    const original = state.impacts.map((impact) => ({ ...impact }));
    scheduleImpacts(state, 2.1, 2);
    for (const impact of original) expect(state.impacts).toContainEqual(impact);
  });

  it('throttles pointer trails by both time and distance, then expires old waves', () => {
    const previous = { x: 0, y: 0, time: 2, strength: 1 };
    expect(canTraceWave(previous, { ...previous, x: 1, time: 2.02 })).toBe(false);
    expect(canTraceWave(previous, { ...previous, x: 0.01, time: 3 })).toBe(false);
    expect(canTraceWave(previous, { ...previous, x: 0.2, time: 2.1 })).toBe(true);
    expect(retainImpacts([previous], 2 + IMPACT_LIFETIME + 0.01)).toEqual([]);
    const many = Array.from({ length: 100 }, (_, index) => ({ ...previous, x: index }));
    expect(retainImpacts(many, 2)).toEqual(many.slice(-MAX_WATER_IMPACTS));
  });
});
