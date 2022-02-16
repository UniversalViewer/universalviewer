import { IExtensionHostAdapter } from "./IExtensionHostAdapter";

export class UVAdapter implements IExtensionHostAdapter {
  public readonly: boolean = false;

  constructor(readonly: boolean) {
    this.readonly = readonly;
  }

  public get<T>(_key: string, _defaultValue: T | undefined): T | undefined {
    return undefined;
  }

  public set<T>(_key: string, _value: T): void {}
}
