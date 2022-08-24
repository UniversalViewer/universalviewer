import { IExtension } from "./modules/uv-shared-module/IExtension";
import { EventHandler, EventHandlerWithName } from "./PubSub";
import BaseContentHandler from "../../BaseContentHandler";
import { IIIFData } from "./IIIFData";
export interface IIIFExtensionHost extends BaseContentHandler<IIIFData> {
    extension: IExtension | null;
    isFullScreen: boolean;
    publish(event: string, args?: any, extra?: any): void;
    subscribe(event: string, handler: EventHandler): void;
    subscribeAll(handler: EventHandlerWithName): void;
    resize(): void;
    exitFullScreen(): void;
}
