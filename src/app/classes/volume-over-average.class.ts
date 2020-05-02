import { IntervalBase } from './interval-base.class';

export class VolumeOverAverge extends IntervalBase {
    daysOver: number[];
    volume1d: string[];
    volume3d: string[];
    volume1w: string[];
    volAvg: string[];
}