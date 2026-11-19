import { type RefObject } from 'react';
import type { WaterRippleQuality } from './WaterRippleVisual.types';
interface Props {
    time: RefObject<number>;
    interval: number;
    color: string;
    glow: number;
    quality: WaterRippleQuality;
}
export default function DropletSource({ time, interval, color, glow, quality }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DropletSource.d.ts.map