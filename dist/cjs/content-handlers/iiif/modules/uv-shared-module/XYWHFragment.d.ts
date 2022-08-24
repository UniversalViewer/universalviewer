export declare class XYWHFragment {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x: number, y: number, w: number, h: number);
    toString(): string;
    static fromString(bounds: string): XYWHFragment;
}
