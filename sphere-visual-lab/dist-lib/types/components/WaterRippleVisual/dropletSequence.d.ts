export declare const SOURCE_HEIGHT = 1.83;
export declare const SOURCE_TOP = 2.43;
export declare const FREE_FALL_DURATION = 0.66;
export declare const NECK_RETRACTION_DURATION = 0.09;
export declare function getDropletStartTime(interval: number): number;
export declare const SOURCE_SEQUENCE_START: number;
export declare const BODY_RADIUS = 0.112;
export interface LiquidPose {
    visible: boolean;
    position: [number, number, number];
    scale: [number, number, number];
    tilt: number;
    taper: number;
    tip: number;
    opacity: number;
}
/** t=0 is water contact; no second clock or random per-frame deformation. */
export declare function getDropletSequence(time: number, interval: number): {
    main: LiquidPose;
    source: LiquidPose;
    neck: LiquidPose;
    satellites: LiquidPose[];
    stage: "forming" | "falling" | "impact";
};
/** Additional headroom applies to the droplet variant only. */
export declare function fitDropletDiameter(diameter: number, containerHeight: number, tilt: number): number;
//# sourceMappingURL=dropletSequence.d.ts.map