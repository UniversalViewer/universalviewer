import { IExtension } from "./modules/uv-shared-module/IExtension";
import { IExtensionHostAdapter } from "./IExtensionHostAdapter";
import { BaseComponent } from "@iiif/base-component";
import { EventHandler, EventHandlerWithName } from "./PubSub";

export interface IExtensionHost extends BaseComponent {
  extension: IExtension | null;
  isFullScreen: boolean;
  adapter: IExtensionHostAdapter;
  publish(event: string, args?: any): void;
  subscribe(event: string, handler: EventHandler): void;
  subscribeAll(handler: EventHandlerWithName): void;
  resize(): void;
  exitFullScreen(): void;
}
