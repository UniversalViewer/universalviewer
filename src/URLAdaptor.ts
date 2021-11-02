import { UVAdaptor } from "./UVAdaptor";
import { Urls } from "@edsilv/utils";
import {UniversalViewer} from "./UniversalViewer";

export class URLAdaptor extends UVAdaptor {
  constructor(readonly: boolean = false) {
    super(readonly);
  }

  public get(key: string, defaultValue?: string | null): string | null {
    return Urls.getHashParameter(key, document) || defaultValue || null;
  }

  public getFragment(key: string, url: string): string | null {
    const regex = new RegExp("#.*" + key + "=([^&]+)(&|$)");
    const match = regex.exec(url);
    return(match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
  }

  public set(key: string, value: string | number | null): void {
    if (!this.readonly) {
      if (value) {
        Urls.setHashParameter(key, value.toString(), document);
      } else {
        Urls.setHashParameter(key, "", document);
      }
    }
  }

  public getInitialData(defaults?: any) {
    return {
      ...(defaults || {}),
      collectionIndex:
          this.get("c") !== undefined
              ? Number(this.get("c"))
              : undefined,
      manifestIndex: Number(this.get("m", 0)),
      canvasIndex: Number(this.get("cv", 0)),
      rotation: Number(this.get("r", 0)),
      rangeId: this.get("rid", ""),
      xywh: this.get("xywh", ""),
      target: this.get("target", "")
    };
  }

  public bindTo(uv: UniversalViewer) {
    uv.on(
        "collectionIndexChange",
         (collectionIndex) => {
          this.set("c", collectionIndex);
        },
        false
    );

    uv.on(
        "manifestIndexChange",
         (manifestIndex) => {
          this.set("m", manifestIndex);
        },
        false
    );

    uv.on(
        "canvasIndexChange",
         (canvasIndex) => {
          this.set("cv", canvasIndex);
        },
        false
    );

    uv.on(
        "rangeChange",
         (rangeId) => {
          this.set("rid", rangeId);
        },
        false
    );

    uv.on(
        "targetChange",
        (target) => {
        this.set("xywh", this.getFragment("xywh", target));
      },
      false
    );
  }
}
