export interface IContentHandler<IUVData> {
  // new (options: IUVOptions): IContentHandler<IUVData>;
  get<T>(key: string): T | undefined;
  set(data: IUVData): void;
  dispose(): void;
  on(name: string, callback: Function, ctx: any): void;
  resize(): void;
}
