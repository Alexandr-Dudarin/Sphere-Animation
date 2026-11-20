import type { BinaryPlanetPreset } from './BinaryPlanetVisual.types';
export interface PlanetAppearance {
    color: string;
    accent: string;
    atmosphere: string;
    radius: number;
    bands: number;
    seed: number;
}
export interface BinaryPresetConfig {
    id: BinaryPlanetPreset;
    title: string;
    description: string;
    /** Secondary mass divided by primary mass. */
    massRatio: number;
    eccentricity: number;
    planets: readonly [PlanetAppearance, PlanetAppearance];
}
export declare const binaryPlanetPresets: readonly BinaryPresetConfig[];
export declare function getBinaryPreset(id: BinaryPlanetPreset): BinaryPresetConfig;
//# sourceMappingURL=binaryPresets.d.ts.map