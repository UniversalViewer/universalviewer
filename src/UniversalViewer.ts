import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";
import { EventHandler, PubSub } from "./PubSub";
// import { Async } from "@edsilv/utils";

export interface IUVOptions {
  target: HTMLElement;
  data: IUVData;
}

enum ContentType {
  IIIF = "manifest",
  YOUTUBE = "youTubeVideoId",
  UNKNOWN = "unknown",
}

interface IContentHandlerRegistry {
  [key: string]: () => Promise<any>;
}

const ContentHandler: IContentHandlerRegistry = {
  [ContentType.IIIF]: () =>
    /* webpackMode: "lazy" */ import("./IIIFContentHandler"),
  [ContentType.YOUTUBE]: () =>
    /* webpackMode: "lazy" */ import("./YouTubeContentHandler"),
};

export type EventListener = {
  [key: string]: { fn: Function; ctx: any }[];
};

export class UniversalViewer {
  private _contentType: ContentType = ContentType.UNKNOWN;
  private _contentHandler: IContentHandler<IUVData>;
  public el: HTMLElement;
  private _pubsub: PubSub = new PubSub();
  // private _eventListener: EventListener;
  // private _uvReadyEvent;
  // private _isUVReady: boolean = false;

  constructor(public options: IUVOptions) {
    this.el = options.target;
    this._assignContentHandler(this.options.data);
    // this._uvReadyEvent = new CustomEvent("uvready");
  }

  public on(name: string, callback: EventHandler): void {
    console.log("on", name);
    this._pubsub.subscribe(name, callback);
    // var e = this._eventListener || (this._eventListener = {});

    // (e[name] || (e[name] = [])).push({
    //   fn: callback,
    //   ctx: ctx,
    // });
  }

  // public on(name: string, callback: Function, ctx: any): void {
  //   window.addEventListener("uvready", () => {
  //     return this._contentHandler.on(name, callback, ctx);
  //   });
  // }

  private async _assignContentHandler(data: IUVData): Promise<void> {
    let contentType: ContentType;

    if (data[ContentType.IIIF]) {
      contentType = ContentType.IIIF;
    } else if (data[ContentType.YOUTUBE]) {
      contentType = ContentType.YOUTUBE;
    } else {
      contentType = ContentType.UNKNOWN;
    }

    if (contentType === ContentType.UNKNOWN) {
      console.error("Unknown content type");
    } else if (this._contentType !== contentType) {
      this._contentHandler?.dispose(); // dispose previous content handler
      // this._pubsub.dispose(); // clear event listeners
      this._contentType = contentType; // set content type
      console.log("create content handler", contentType);
      const m = await ContentHandler[contentType](); // import content handler
      this._contentHandler = new m.default(this.options, this._pubsub); // create content handler
      // window.dispatchEvent(this._uvReadyEvent);
    }
  }

  public set(data: IUVData): void {
    this._assignContentHandler(data).then(() => {
      this._contentHandler.set(data);
    });
  }

  public resize(): void {
    this._contentHandler?.resize();
  }
}
