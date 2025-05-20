import { IContentHandler } from "./IContentHandler";
import { IUVOptions } from "./UniversalViewer";
import { UVAdapter } from "./UVAdapter";
import { Events } from "./Events";
import { merge } from "./Utils";

export type EventListener = {
  name: string;
  cb: Function;
  ctx?: any;
};

type EventListenerDictionaryItem = Pick<EventListener, "cb" | "ctx">;

export default class BaseContentHandler<IUVData>
  implements IContentHandler<IUVData>
{
  protected _el: HTMLElement;
  private _eventListeners: {
    [key: string]: EventListenerDictionaryItem[];
  };

  constructor(
    public options: IUVOptions,
    public adapter?: UVAdapter,
    eventListeners?: EventListener[]
  ) {
    this._el = this.options.target;

    // add event listeners
    if (eventListeners) {
      eventListeners.forEach(({ name, cb }) => {
        this.on(name, cb);
      });
    }
  }

  public set(data: IUVData, initial?: boolean): void {}

  public on(name: string, cb: Function, ctx?: any): void {
    var e = this._eventListeners || (this._eventListeners = {});

    (e[name] || (e[name] = [])).push({
      cb,
      ctx,
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
      evtArr[i].cb.apply(evtArr[i].ctx, data);
    }
  }

  public showSpinner(): void {
    this._el.parentElement?.classList.remove("loaded");
  }

  public hideSpinner(): void {
    this._el.parentElement?.classList.add("loaded");
  }

  public async configure(config: any): Promise<any> {
    const promises: Promise<any>[] = [] as any;

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
