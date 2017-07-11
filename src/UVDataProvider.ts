import {IUVDataProvider} from "./IUVDataProvider";

export class UVDataProvider implements IUVDataProvider {

    public get(key: string, defaultValue: string | null): string | null {
        return null;
    }

    public set(key: string, value: string): void {

    }
}