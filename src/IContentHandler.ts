export interface IContentHandler<IUVData> {
  set(data: IUVData): void;
  dispose(): void;
  on(name: string, callback: Function, ctx?: any): void;
  resize(): void;
  exitFullScreen(): void;
}
