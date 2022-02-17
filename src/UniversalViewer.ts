import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";

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
    /* webpackMode: "lazy" */ import(
      "./content-handlers/iiif/IIIFContentHandler"
    ),
  [ContentType.YOUTUBE]: () =>
    /* webpackMode: "lazy" */ import(
      "./content-handlers/youtube/YouTubeContentHandler"
    ),
};

export class UniversalViewer {
  private _contentType: ContentType = ContentType.UNKNOWN;
  private _contentHandler: IContentHandler<IUVData>;
  public el: HTMLElement;
  private _eventListeners: { name: string; callback: Function }[] = [];

  constructor(public options: IUVOptions) {
    this.el = options.target;
    this._assignContentHandler(this.options.data);
  }

  public on(name: string, callback: Function, ctx?: any): void {
    this._eventListeners.push({
      name,
      callback,
    });
  }

  private async _assignContentHandler(data: IUVData): Promise<void> {
    let contentType: ContentType;

    if (data[ContentType.IIIF]) {
      contentType = ContentType.IIIF;
    } else if (data[ContentType.YOUTUBE]) {
      contentType = ContentType.YOUTUBE;
    } else if (this._contentType) {
      contentType = this._contentType;
    } else {
      contentType = ContentType.UNKNOWN;
    }

    if (contentType === ContentType.UNKNOWN) {
      console.error("Unknown content type");
    } else if (this._contentType !== contentType) {
      this._contentHandler?.dispose(); // dispose previous content handler
      this._contentType = contentType; // set content type
      const m = await ContentHandler[contentType](); // import content handler
      this._contentHandler = new m.default(this.options); // create content handler

      // add event listeners
      this._eventListeners.forEach(({ name, callback }) => {
        this._contentHandler.on(name, callback);
      });
    }
  }

  public set(data: IUVData): void {
    // content type may have changed
    this._assignContentHandler(data).then(() => {
      this._contentHandler.set(data);
    });
  }

  public resize(): void {
    this._contentHandler?.resize();
  }
}
