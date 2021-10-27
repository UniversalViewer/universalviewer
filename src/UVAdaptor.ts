import { IUVAdaptor } from "./IUVAdaptor";

export class UVAdaptor implements IUVAdaptor {
  public readonly: boolean = false;

  constructor(readonly: boolean) {
    this.readonly = readonly;
  }

  public get(_key: string, _defaultValue: string | null): string | null {
    return null;
  }

  public set(_key: string, _value: string): void {}
}
