import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";
import BaseContentHandler, { EventListener } from "./BaseContentHandler";
import { ContentType } from "./ContentType";

export interface IUVOptions {
  target: HTMLElement;
  data: IUVData<any>;
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
  public contentType: ContentType = ContentType.UNKNOWN;
  public assignedContentHandler: IContentHandler<IUVData<any>>;

  // include _contentType for backwards compat, remove in next major version (UV5)
  public _contentType = this.contentType;
  public _assignedContentHandler;

  private _externalEventListeners: EventListener[] = [];

  constructor(public options: IUVOptions) {
    super(options);
    this._assignContentHandler(this.options.data);
  }

  public get() {
    return this.assignedContentHandler;
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
    } else if (this.contentType) {
      contentType = this.contentType;
    } else {
      contentType = ContentType.UNKNOWN;
    }

    const handlerChanged: boolean = this.contentType !== contentType;

    if (contentType === ContentType.UNKNOWN) {
      console.error("Unknown content type");
    } else if (handlerChanged) {
      this.contentType = this._contentType = contentType; // set content type
      this.assignedContentHandler?.dispose(); // dispose previous content handler
      const m = await ContentHandler[contentType](); // import content handler
      this.showSpinner(); // show spinner
      // include _assignedContentHandler for backwards compat, remove in next major version (UV5)
      this.assignedContentHandler = this._assignedContentHandler =
        new m.default(
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
        this.assignedContentHandler.set(data, initial);
      }
    });
  }

  public exitFullScreen(): void {
    this.assignedContentHandler?.exitFullScreen();
  }

  public resize(): void {
    this.assignedContentHandler?.resize();
  }

  public dispose(): void {
    this.assignedContentHandler?.dispose();
  }
}
