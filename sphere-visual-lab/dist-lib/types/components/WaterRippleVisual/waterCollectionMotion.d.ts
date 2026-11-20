export declare const MAX_WATER_IMPACTS = 64;
export declare const IMPACT_LIFETIME = 5.5;
export declare const RAIN_FALL_SECONDS = 0.62;
export declare const RAIN_DROP_SCALE = 1.5;
export interface WaterImpact {
    x: number;
    y: number;
    time: number;
    strength: number;
}
export interface ImpactSchedule {
    next: number;
    index: number;
    impacts: WaterImpact[];
}
export declare function createImpactSchedule(): ImpactSchedule;
export declare function retainImpacts(impacts: WaterImpact[], time: number): WaterImpact[];
/** A bounded schedule shared by falling streaks and their water impacts. */
export declare function scheduleImpacts(state: ImpactSchedule, time: number, intensity: number): WaterImpact[];
/** Acceleration ends exactly at the impact timestamp. */
export declare function rainHeight(time: number, impactTime: number): number | null;
export declare function canTraceWave(previous: WaterImpact | undefined, next: WaterImpact): boolean;
//# sourceMappingURL=waterCollectionMotion.d.ts.map