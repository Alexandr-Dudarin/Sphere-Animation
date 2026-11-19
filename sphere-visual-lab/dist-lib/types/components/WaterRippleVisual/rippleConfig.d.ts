export declare const rippleDefaults: {
    readonly speed: 0.7;
    readonly glowIntensity: 1.3;
    readonly amplitude: 0.008;
    readonly lineWidth: 0.02;
    readonly damping: 0.55;
    readonly rippleInterval: 4.8;
    readonly tilt: 22;
    readonly color: "#168dff";
};
export declare const DROP_FALL_DURATION = 1.05;
export declare const DROP_START_HEIGHT = 1.35;
export declare const DROP_HEIGHT = 0.38;
export declare const DROP_RADIUS = 0.105;
/** Stable stage; only the internal object scale changes with size and tilt. */
export declare function getRippleDiameter(size: number, width: number, height: number, tilt: number, withDrop: boolean): number;
//# sourceMappingURL=rippleConfig.d.ts.map