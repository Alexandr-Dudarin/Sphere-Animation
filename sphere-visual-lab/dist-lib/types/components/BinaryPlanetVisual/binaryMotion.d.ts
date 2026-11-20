import type { BinaryPresetConfig } from './binaryPresets';
export declare const BINARY_ROLL = -0.12;
export declare const INITIAL_ANOMALY = 0.42;
export declare const ORBIT_RATE = 0.38;
export declare function clampBinary(value: number, fallback: number, min: number, max: number): number;
/** Solve Kepler's equation so motion accelerates toward periapsis. */
export declare function eccentricAnomaly(mean: number, eccentricity: number): number;
export declare function binaryPositions(mean: number, separation: number, massRatio: number, eccentricity: number): readonly [readonly [number, number, 0], readonly [number, number, 0]];
export declare function advanceBinaryTime(time: number, delta: number, speed: number): number;
/** Exact projected ellipse bounds plus a spherical atmosphere, covering every orbital phase. */
export declare function binaryBounds(config: BinaryPresetConfig, separation: number, tilt: number): {
    x: number;
    y: number;
};
export declare function fitBinaryWidth(size: number, width: number, height: number, bounds: {
    x: number;
    y: number;
}): number;
//# sourceMappingURL=binaryMotion.d.ts.map