import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";

export interface IUVOptions {
  target: HTMLElement;
  data: IUVData;
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

export class UniversalViewer implements IContentHandler<IUVData> {
  private _contentType: ContentType = ContentType.UNKNOWN;
  private _assignedContentHandler: IContentHandler<IUVData>;
  public el: HTMLElement;
  private _externalEventListeners: { name: string; callback: Function }[] = [];

  constructor(public options: IUVOptions) {
    this.el = options.target;
    this._assignContentHandler(this.options.data);
  }

  public on(name: string, callback: Function, ctx?: any): void {
    this._externalEventListeners.push({
      name,
      callback,
    });
  }

  private async _assignContentHandler(data: IUVData): Promise<boolean> {
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
      this._showSpinner(); // show spinner
      this._assignedContentHandler = new m.default({
        target: this.el,
        data: data,
      }); // create content handler

      // add event listeners
      this._externalEventListeners.forEach(({ name, callback }) => {
        this._assignedContentHandler.on(name, callback);
      });
    }

    return handlerChanged;
  }

  private _showSpinner(): void {
    this.el.parentElement!.parentElement!.classList.remove("loaded");
  }

  public set(data: IUVData): void {
    // content type may have changed
    this._assignContentHandler(data).then((handlerChanged: boolean) => {
      if (handlerChanged) {
        // the handler has changed, show a spinner until it's created
        this._showSpinner();
      } else {
        // the handler didn't change, therefore handler's initial set didn't run
        // so we need to call set
        this._assignedContentHandler.set(data);
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
