import { UVAdapter } from "./UVAdapter";
export interface IContentHandler<IUVData> {
    adapter?: UVAdapter | undefined;
    set(data: IUVData, initial?: boolean): void;
    dispose(): void;
    on(name: string, callback: Function, ctx?: any): void;
    resize(): void;
    exitFullScreen(): void;
}
