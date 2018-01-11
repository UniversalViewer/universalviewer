import {IUVDataProvider} from "./IUVDataProvider";

export class UVDataProvider implements IUVDataProvider {

    public readonly: boolean = false;

    constructor(readonly: boolean) {
        this.readonly = readonly;
    }

    public get(key: string, defaultValue: string | null): string | null {
        return null;
    }

    public set(key: string, value: string): void {

    }
}