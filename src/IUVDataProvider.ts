import {IUVData} from "./IUVData";
import {Params} from "./Params";

export interface IUVDataProvider {
    assign(data: IUVData): void;
    getParam(param: Params): string | null;
    setParam(key: Params, value: string): void;
}