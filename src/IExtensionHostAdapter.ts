export interface IExtensionHostAdapter {
  get(key: string, defaultValue: string | null): string | null;
  set(key: string, value: string): void;
}
