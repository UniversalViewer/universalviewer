import {IUVDataProvider} from "./IUVDataProvider";

export class UVDataProvider implements IUVDataProvider {

    public get<T>(key: string, defaultValue: T): T {
        return <T>new Object();
    }

    public set<T>(key: string, value: T): void {

    }
}