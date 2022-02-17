export interface IExtensionHostAdapter {
  get(key: string, defaultValue: string | undefined): string | undefined;
  set(key: string, value: string): void;
}
