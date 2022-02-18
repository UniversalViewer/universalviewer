import { IExtension } from "./modules/uv-shared-module/IExtension";
import { BaseComponent } from "@iiif/base-component";
import { EventHandler, EventHandlerWithName } from "./PubSub";
import { UVAdapter } from "@/UVAdapter";

export interface IExtensionHost extends BaseComponent {
  extension: IExtension | null;
  isFullScreen: boolean;
  adapter: UVAdapter;
  publish(event: string, args?: any): void;
  subscribe(event: string, handler: EventHandler): void;
  subscribeAll(handler: EventHandlerWithName): void;
  resize(): void;
  exitFullScreen(): void;
}
