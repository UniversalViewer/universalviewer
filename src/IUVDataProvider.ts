export interface IUVDataProvider {
    get<T>(key: string, defaultValue: T): T;
    set<T>(key: string, value: T): void;
}