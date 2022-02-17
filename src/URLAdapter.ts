import { UVAdapter } from "./UVAdapter";
import { Urls } from "@edsilv/utils";
import { UniversalViewer } from "./UniversalViewer";
import { IUVData } from "./IUVData";
import { BaseEvents } from "./modules/uv-shared-module/BaseEvents";

export class URLAdapter extends UVAdapter {
  constructor(readonly: boolean = false) {
    super(readonly);
  }

  public get<T>(key: string, defaultValue?: T | undefined): T | undefined {
    const hashParameter: string | null = Urls.getHashParameter(key, document);

    if (hashParameter === null) {
      return defaultValue;
    }

    return (hashParameter as unknown) as T;
  }

  public getFragment(key: string, url: string): string | null {
    const regex = new RegExp("#.*" + key + "=([^&]+)(&|$)");
    const match = regex.exec(url);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
  }

  public set<T>(key: string, value: T): void {
    if (!this.readonly) {
      if (value) {
        Urls.setHashParameter(key, value, document);
      } else {
        Urls.setHashParameter(key, "", document);
      }
    }
  }

  public getInitialData(overrides?: IUVData): IUVData {
    console.log("getInitialData");
    const formattedLocales: Array<{ label?: string; name: string }> = [];
    const locales = this.get<string>("locales", "");
    if (locales) {
      const names = locales.split(",");
      for (let i in names) {
        const parts = String(names[i]).split(":");
        formattedLocales[i] = { name: parts[0], label: parts[1] };
      }
    } else {
      formattedLocales.push({
        name: "en-GB",
      });
    }

    return {
      manifest: this.get<string>("manifest"),
      collectionIndex: this.get<number>("c"),
      manifestIndex: this.get<number>("m", 0),
      canvasIndex: this.get<number>("cv", 0),
      rotation: this.get<number>("r", 0),
      rangeId: this.get<string>("rid", ""),
      xywh: this.get<string>("xywh", ""),
      target: this.get<string>("target", ""),
      cfi: this.get<string>("cfi", ""),
      youTubeVideoId: this.get<string>("youTubeVideoId", ""),
      locales: formattedLocales.length ? formattedLocales : undefined,
      ...overrides,
    };
  }

  public bindTo(uv: UniversalViewer) {
    uv.on(BaseEvents.PAUSE, (currentTime) => {
      if (currentTime > 0) {
        this.set("t", currentTime);
      }
    });

    uv.on(BaseEvents.COLLECTION_INDEX_CHANGE, (collectionIndex) => {
      this.set("c", collectionIndex);
    });

    uv.on(BaseEvents.MANIFEST_INDEX_CHANGE, (manifestIndex) => {
      this.set("m", manifestIndex);
    });

    uv.on(BaseEvents.CANVAS_INDEX_CHANGE, (canvasIndex) => {
      this.set("cv", canvasIndex);
    });

    uv.on(BaseEvents.RANGE_CHANGE, (rangeId) => {
      this.set("rid", rangeId);
    });

    uv.on(BaseEvents.TARGET_CHANGE, (target) => {
      this.set("xywh", this.getFragment("xywh", target));
    });
  }
}
