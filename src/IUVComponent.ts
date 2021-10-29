import { IExtension } from "./modules/uv-shared-module/IExtension";
import { IUVAdaptor } from "./IUVAdaptor";
import { BaseComponent } from "@iiif/base-component";

export interface IUVComponent extends BaseComponent {
  extension: IExtension | null;
  isFullScreen: boolean;
  adaptor: IUVAdaptor;
  publish(event: string, args?: any): void;
  subscribe(event: string, cb: any): void;
  resize(): void;
  exitFullScreen(): void;
}
