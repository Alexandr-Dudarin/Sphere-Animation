import { describe, expect, it } from 'vitest';
import { binaryPlanetPresets } from './binaryPresets';
import { advanceBinaryTime, BINARY_ROLL, binaryBounds, binaryPositions, binaryRingDimensions, eccentricAnomaly, fitBinaryWidth } from './binaryMotion';

describe('binary planetary motion', () => {
  it('keeps the centre of mass fixed and the planets apart over complete orbits', () => {
    for (const config of binaryPlanetPresets) {
      for (let i = 0; i <= 240; i++) {
        const [a, b] = binaryPositions(i / 240 * Math.PI * 2, 1.35, config.massRatio, config.eccentricity);
        expect(a[0] + config.massRatio * b[0]).toBeCloseTo(0, 12);
        expect(a[1] + config.massRatio * b[1]).toBeCloseTo(0, 12);
        expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThan(
          config.planets[0].radius + config.planets[1].radius);
      }
    }
  });
  it('solves Kepler motion and advances faster near periapsis', () => {
    for (const mean of [-1, 0, 0.4, 2, 12, 1000]) {
      const e = eccentricAnomaly(mean, 0.19);
      expect(e - 0.19 * Math.sin(e)).toBeCloseTo(mean % (Math.PI * 2), 10);
    }
    const near = eccentricAnomaly(0.1, 0.19) - eccentricAnomaly(0, 0.19);
    const far = eccentricAnomaly(Math.PI + 0.1, 0.19) - eccentricAnomaly(Math.PI, 0.19);
    expect(near).toBeGreaterThan(far);
  });
  it('encloses both full orbits inside the ring and fits the whole system at extreme settings', () => {
    for (const config of binaryPlanetPresets) for (const tilt of [10, 68, 80]) {
      for (const separation of [1.35, 1.5, 1.9]) {
        const bounds = binaryBounds(config, separation, tilt);
        const ring = binaryRingDimensions(config, separation);
        for (let i = 0; i < 120; i++) {
          const pair = binaryPositions(i / 120 * Math.PI * 2, separation, config.massRatio, config.eccentricity);
          pair.forEach(([x, y], index) => {
            expect(Math.hypot(x, y) + config.planets[index].radius).toBeLessThan(ring.inner);
            const py = y * Math.cos(tilt * Math.PI / 180);
            const sx = x * Math.cos(BINARY_ROLL) - py * Math.sin(BINARY_ROLL);
            const sy = x * Math.sin(BINARY_ROLL) + py * Math.cos(BINARY_ROLL);
            expect(Math.abs(sx) + config.planets[index].radius).toBeLessThan(bounds.x);
            expect(Math.abs(sy) + config.planets[index].radius).toBeLessThan(bounds.y);
          });
        }
        for (let i = 0; i < 240; i++) {
          const angle = i / 240 * Math.PI * 2;
          const rx = ring.outer * Math.cos(angle), ry = ring.outer * Math.sin(angle) * Math.cos(tilt * Math.PI / 180);
          expect(Math.abs(rx * Math.cos(BINARY_ROLL) - ry * Math.sin(BINARY_ROLL))).toBeLessThanOrEqual(bounds.x + 1e-9);
          expect(Math.abs(rx * Math.sin(BINARY_ROLL) + ry * Math.cos(BINARY_ROLL))).toBeLessThanOrEqual(bounds.y + 1e-9);
        }
        const fitted = fitBinaryWidth(800, 300, 340, bounds);
        expect(fitted).toBeLessThanOrEqual(300 * 0.92);
        expect(fitted * bounds.y / bounds.x).toBeLessThanOrEqual(340 * 0.84 + 1e-9);
        expect(fitBinaryWidth(150, 800, 600, bounds)).toBe(150);
      }
    }
  });
  it('freezes without jumping after suspended tabs or invalid frame deltas', () => {
    expect(advanceBinaryTime(2, 1, 0)).toBe(2);
    expect(advanceBinaryTime(2, 60, 1)).toBeCloseTo(2.05);
    expect(advanceBinaryTime(2, NaN, 1)).toBe(2);
    expect(advanceBinaryTime(2, -1, 1)).toBe(2);
  });
});
