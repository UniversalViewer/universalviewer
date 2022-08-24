export declare class UVAdapter {
    readonly: boolean;
    constructor(readonly: boolean);
    get<T>(_key: string, _defaultValue: T | undefined): T | undefined;
    set<T>(_key: string, _value: T): void;
    dispose(): void;
}
