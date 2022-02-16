import { IContentHandler } from "./IContentHandler";
import { YouTubeData } from "./IUVData";
import { IUVOptions } from "./UniversalViewer";
import { merge } from "lodash";

export class YouTubeContentHandler implements IContentHandler<YouTubeData> {
  public el: HTMLElement;
  private _e: any;

  private _defaultData = {};

  constructor(private options: IUVOptions) {
    this.mergeDefaults(this.options.data);
    console.log("create YouTubeContentHandler");
  }

  private mergeDefaults(data: YouTubeData): void {
    merge(data, this._defaultData);
  }

  public set(data: YouTubeData): void {
    this.mergeDefaults(data);
  }

  public get<T>(key: string): T | undefined {
    return undefined;
  }

  public on(name: string, callback: Function, ctx: any): void {
    var e = this._e || (this._e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx,
    });
  }

  public resize(): void {}

  public dispose(): void {
    console.log("dispose YouTubeContentHandler");
  }
}
