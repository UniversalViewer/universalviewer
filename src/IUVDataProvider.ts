import {ILocale} from "./ILocale";

export interface IUVDataProvider {
    get<T>(key: string, defaultValue: T): T;
    parseLocales(locales: string): ILocale[];
    set<T>(key: string, value: T): void;
}