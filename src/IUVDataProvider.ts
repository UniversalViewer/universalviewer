import {IUVData} from "./IUVData";
import {Params} from "./Params";

export interface IUVDataProvider {
    data(): IUVData;
    parseLocale(locale: string): void;
    assign(data: IUVData): void;
    isDeepLinkingEnabled(): boolean;
    getParam(param: Params): string | null;
}