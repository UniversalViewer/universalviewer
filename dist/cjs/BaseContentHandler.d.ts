import { IContentHandler } from "./IContentHandler";
import { IUVOptions } from "./UniversalViewer";
import { UVAdapter } from "./UVAdapter";
export declare type EventListener = {
    name: string;
    cb: Function;
    ctx?: any;
};
export default class BaseContentHandler<IUVData> implements IContentHandler<IUVData> {
    options: IUVOptions;
    adapter?: UVAdapter | undefined;
    protected _el: HTMLElement;
    private _eventListeners;
    constructor(options: IUVOptions, adapter?: UVAdapter | undefined, eventListeners?: EventListener[]);
    set(data: IUVData, initial?: boolean): void;
    on(name: string, cb: Function, ctx?: any): void;
    fire(name: string, ...args: any[]): void;
    showSpinner(): void;
    hideSpinner(): void;
    configure(config: any): Promise<any>;
    exitFullScreen(): void;
    resize(): void;
    dispose(): void;
}
