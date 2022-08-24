export declare type BoxSelector = {
    type: "BoxSelector";
    unit?: "percent" | "pixel";
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type TemporalSelector = {
    type: "TemporalSelector";
    startTime: number;
    endTime?: number;
};
export declare type TemporalBoxSelector = {
    type: "TemporalBoxSelector";
    x: number;
    y: number;
    width: number;
    height: number;
    startTime: number;
    endTime?: number;
};
export declare type SupportedSelectors = TemporalSelector | BoxSelector | TemporalBoxSelector;
