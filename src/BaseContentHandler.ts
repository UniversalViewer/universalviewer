import { IContentHandler } from "./IContentHandler";
import { IUVOptions } from "./UniversalViewer";
import { UVAdapter } from "./UVAdapter";
import { Events } from "./Events";
const merge = require("lodash/merge");

export default class BaseContentHandler<IUVData>
  implements IContentHandler<IUVData> {
  protected _el: HTMLElement;
  private _eventListeners: any;
  public adapter: UVAdapter | undefined;

  constructor(public options: IUVOptions) {
    // console.log("create YouTubeContentHandler");
    this._el = this.options.target;
  }

  public set(data: IUVData): void {}

  public on(name: string, callback: Function, ctx: any): void {
    var e = this._eventListeners || (this._eventListeners = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx,
    });
  }

  public fire(name: string, ...args: any[]): void {
    var data = [].slice.call(arguments, 1);
    var evtArr = (
      (this._eventListeners || (this._eventListeners = {}))[name] || []
    ).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
  }

  public showSpinner(): void {
    this._el.parentElement!.classList.remove("loaded");
  }

  public hideSpinner(): void {
    this._el.parentElement!.classList.add("loaded");
  }

  public async configure(config: any): Promise<any> {
    let promises: Promise<any>[] = [] as any;

    this.fire(Events.CONFIGURE, {
      config,
      cb: (promise) => {
        promises.push(promise);
      },
    });

    if (promises.length) {
      const configs = await Promise.all(promises);

      const mergedConfigs = configs.reduce((previous, current) => {
        return merge(previous, current);
      });

      config = merge(config, mergedConfigs);
    }

    return config;
  }

  public exitFullScreen(): void {}

  public resize(): void {}

  public dispose(): void {
    this._el.innerHTML = "";
    this._el.className = "";
    this.adapter?.dispose();
  }
}
