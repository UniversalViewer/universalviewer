import { UVAdapter } from "../../UVAdapter";
import { UniversalViewer } from "../../UniversalViewer";
import { IUVData } from "../../IUVData";
export declare class URLAdapter extends UVAdapter {
    constructor(readonly?: boolean);
    get<T>(key: string, defaultValue?: T | undefined): T | undefined;
    getFragment(key: string, url: string): string | null;
    set<T>(key: string, value: T): void;
    getInitialData(overrides?: IUVData): IUVData;
    dispose(): void;
    bindTo(uv: UniversalViewer): void;
}
