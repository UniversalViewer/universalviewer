export class UVAdapter {
  public readonly: boolean = false;

  constructor(readonly: boolean) {
    this.readonly = readonly;
  }

  public get<T>(_key: string, _defaultValue: T | undefined): T | undefined {
    return undefined;
  }

  public set<T>(_key: string, _value: T): void {}

  public dispose(): void {}
}
