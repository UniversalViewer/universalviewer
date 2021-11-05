import { IExtension } from "./modules/uv-shared-module/IExtension";
import { IUVAdaptor } from "./IUVAdaptor";
import { BaseComponent } from "@iiif/base-component";
import { EventHandler } from "./PubSub";

export interface IUniversalViewer extends BaseComponent {
  extension: IExtension | null;
  isFullScreen: boolean;
  adaptor: IUVAdaptor;
  publish(event: string, args?: any): void;
  subscribe(event: string, handler: EventHandler): void;
  subscribeAll(handler: EventHandler, exceptions: string[]): void;
  resize(): void;
  exitFullScreen(): void;
}
