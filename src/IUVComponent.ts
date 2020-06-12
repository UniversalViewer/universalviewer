import { IExtension } from "./modules/uv-shared-module/IExtension";
import { IUVDataProvider } from "./IUVDataProvider";
import { BaseComponent } from "@iiif/base-component";

export interface IUVComponent extends BaseComponent {
  extension: IExtension | null;
  isFullScreen: boolean;
  dataProvider: IUVDataProvider;
  publish(event: string, args?: any): void;
  subscribe(event: string, cb: any): void;
  resize(): void;
  exitFullScreen(): void;
}
