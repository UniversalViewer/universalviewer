import { UVAdapter } from "./UVAdapter";

export interface IContentHandler<IUVData> {
  // adapter.bindTo() sets this.
  // when the content handler is disposed, it also disposes the adapter.
  adapter?: UVAdapter | undefined;
  set(data: IUVData, initial?: boolean): void;
  dispose(): void;
  on(name: string, callback: Function, ctx?: any): void;
  resize(): void;
  exitFullScreen(): void;
}
