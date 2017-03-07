import {IExtension} from "./modules/uv-shared-module/IExtension"
import {IUVDataProvider} from "./IUVDataProvider";

export interface IUVComponent extends _Components.IBaseComponent {
    extension: IExtension;
    isFullScreen: boolean;
    URLDataProvider: IUVDataProvider;
}