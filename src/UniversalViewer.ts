import { IUVData } from "./IUVData";
import { IContentHandler } from "./IContentHandler";
import { IIIFContentHandler } from "./IIIFContentHandler";
import { YouTubeContentHandler } from "./YouTubeContentHandler";

enum ContentType {
  IIIF = "iiif",
  YOUTUBE = "youtube",
  UNKNOWN = "unknown",
}

export interface IUVOptions {
  target: HTMLElement;
  data: IUVData;
}

export class UniversalViewer {
  private _contentType: ContentType = ContentType.UNKNOWN;
  private _contentHandler: IContentHandler<IUVData>;
  public el: HTMLElement;

  constructor(public options: IUVOptions) {
    this.el = options.target;
    this.assignContentTypeHandler(this.options.data);
  }

  public on(name: string, callback: Function, ctx: any): void {
    return this._contentHandler.on(name, callback, ctx);
  }

  getContentType(data: IUVData): ContentType {
    if (data.manifest) {
      return ContentType.IIIF;
    } else if (data.youTubeVideoId) {
      return ContentType.YOUTUBE;
    } else if (this._contentType) {
      return this._contentType;
    }
    return ContentType.UNKNOWN;
  }

  assignContentTypeHandler(data: IUVData) {
    this._contentType = this.getContentType(data);

    if (this._contentType === ContentType.UNKNOWN) {
      console.error("unknown content type");
      return;
    }

    console.log("contentType", this._contentType);

    switch (this._contentType) {
      case ContentType.IIIF:
        if (
          !this._contentHandler ||
          !(this._contentHandler instanceof IIIFContentHandler)
        ) {
          this._contentHandler?.dispose();
          this._contentHandler = new IIIFContentHandler(this.options);
        }
        break;
      case ContentType.YOUTUBE:
        if (
          !this._contentHandler ||
          !(this._contentHandler instanceof YouTubeContentHandler)
        ) {
          this._contentHandler?.dispose();
          this._contentHandler = new YouTubeContentHandler(this.options);
        }
        break;
    }
  }

  public set(data: IUVData): void {
    this.assignContentTypeHandler(data);
    this._contentHandler.set(data);
  }

  public resize(): void {
    this._contentHandler.resize();
  }
}
