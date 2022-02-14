import { IExtensionHostAdapter } from "./IExtensionHostAdapter";

export class UVAdapter implements IExtensionHostAdapter {
  public readonly: boolean = false;

  constructor(readonly: boolean) {
    this.readonly = readonly;
  }

  public get(
    _key: string,
    _defaultValue: string | undefined
  ): string | undefined {
    return undefined;
  }

  public set(_key: string, _value: string): void {}
}
