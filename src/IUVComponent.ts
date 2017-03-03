import {IUVDataProvider} from "./IUVDataProvider";
import {URLDataProvider} from "./URLDataProvider";

export interface IUVComponent extends _Components.IBaseComponent {
    URLDataProvider: IUVDataProvider;
}