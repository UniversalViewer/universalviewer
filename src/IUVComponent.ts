import {IExtension} from "./modules/uv-shared-module/IExtension"
import {IUVDataProvider} from "./IUVDataProvider";

export interface IUVComponent extends _Components.IBaseComponent {
    extension: IExtension | null;
    isFullScreen: boolean;
    URLDataProvider: IUVDataProvider;
    publish(event: string, args?: any): void;
    subscribe(event: string, cb: any): void;
    resize(): void;
    exitFullScreen(): void;
}