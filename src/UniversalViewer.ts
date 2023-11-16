import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";
import BaseContentHandler, { EventListener } from "./BaseContentHandler";

export interface IUVOptions {
  target: HTMLElement;
  data: IUVData<any>;
}

enum ContentType {
  IIIFLEGACY = "manifest",
  IIIF = "iiifManifestId",
  YOUTUBE = "youTubeVideoId",
  UNKNOWN = "unknown",
}

interface IContentHandlerRegistry {
  [key: string]: () => Promise<any>;
}

const ContentHandler: IContentHandlerRegistry = {
  [ContentType.IIIF]: () =>
    /* webpackMode: "lazy" */ import(
      "./content-handlers/iiif/IIIFContentHandler"
    ),
  [ContentType.YOUTUBE]: () =>
    /* webpackMode: "lazy" */ import(
      "./content-handlers/youtube/YouTubeContentHandler"
    ),
};

export class UniversalViewer extends BaseContentHandler<IUVData<any>> {
  private _contentType: ContentType = ContentType.UNKNOWN;
  private _assignedContentHandler: IContentHandler<IUVData<any>>;
  private _externalEventListeners: EventListener[] = [];

  constructor(public options: IUVOptions) {
    super(options);
    this._assignContentHandler(this.options.data);
  }

  public get() {
    return this._assignedContentHandler;
  }

  public on(name: string, cb: Function, ctx?: any): void {
    this._externalEventListeners.push({
      name,
      cb,
      ctx,
    });
  }

  private async _assignContentHandler(data: IUVData<any>): Promise<boolean> {
    let contentType: ContentType;

    if (data[ContentType.IIIFLEGACY]) {
      // if using "manifest" not "iiifManifestId"
      data.iiifManifestId = data[ContentType.IIIFLEGACY];
      delete data[ContentType.IIIFLEGACY];
      contentType = ContentType.IIIF;
    } else if (data[ContentType.IIIF]) {
      contentType = ContentType.IIIF;
    } else if (data[ContentType.YOUTUBE]) {
      contentType = ContentType.YOUTUBE;
    } else if (this._contentType) {
      contentType = this._contentType;
    } else {
      contentType = ContentType.UNKNOWN;
    }

    const handlerChanged: boolean = this._contentType !== contentType;

    if (contentType === ContentType.UNKNOWN) {
      console.error("Unknown content type");
    } else if (handlerChanged) {
      this._contentType = contentType; // set content type
      this._assignedContentHandler?.dispose(); // dispose previous content handler
      const m = await ContentHandler[contentType](); // import content handler
      this.showSpinner(); // show spinner
      this._assignedContentHandler = new m.default(
        {
          target: this._el,
          data: data,
        },
        this.adapter,
        this._externalEventListeners
      ); // create content handler
    }

    return handlerChanged;
  }

  public set(data: IUVData<any>, initial?: boolean): void {
    // content type may have changed
    this._assignContentHandler(data).then((handlerChanged: boolean) => {
      if (handlerChanged) {
        // the handler has changed, show a spinner until it's created
        this.showSpinner();
      } else {
        // the handler didn't change, therefore handler's initial set didn't run
        // so we need to call set
        this._assignedContentHandler.set(data, initial);
      }
    });
  }

  public exitFullScreen(): void {
    this._assignedContentHandler?.exitFullScreen();
  }

  public resize(): void {
    this._assignedContentHandler?.resize();
  }

  public dispose(): void {
    this._assignedContentHandler?.dispose();
  }
}
