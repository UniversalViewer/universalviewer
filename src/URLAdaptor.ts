import { UVAdaptor } from "./UVAdaptor";
import { Urls } from "@edsilv/utils";
import { UniversalViewer } from "./UniversalViewer";

export class URLAdaptor extends UVAdaptor {
  options: {
    withoutLocales?: boolean,
    withDynamicManifest?: boolean;
    withConfig?: boolean
  };

  constructor(readonly: boolean = false, options: { withoutLocales?: boolean, withDynamicManifest?: boolean; withConfig?: boolean } = {}) {
    super(readonly);
    this.options = options;
  }

  public get(key: string, defaultValue?: string | number | null): string | null {
    return Urls.getHashParameter(key, document) || ((defaultValue || '').toString()) || null;
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
    const formattedLocales: Array<{ label?: string; name: string }> = [];
    const extraData: any = {};

    // Option to skip the locales.
    if (!this.options.withoutLocales) {
      const locales = this.get("locales", "");
      if (locales) {
        const names = locales.split(",");
        for (let i in names) {
          const parts = String(names[i]).split(":");
          formattedLocales[i] = { name: parts[0], label: parts[1] };
        }
      } else {
        formattedLocales.push({
          name: "en-GB"
        })
      }
    }

    if (this.options.withDynamicManifest) {
      extraData.manifestUri = this.get('manifest', defaults?.manifestUri);
    }

    if (this.options.withConfig) {
      extraData.configUri = this.get('config', defaults?.configUri);
    }

    return {
      ...(defaults || {}),
      collectionIndex:
          this.get("c") !== undefined
              ? Number(this.get("c", defaults?.collectionIndex))
              : undefined,
      manifestIndex: Number(this.get("m", defaults?.manifest || 0)),
      canvasIndex: Number(this.get("cv", defaults?.canvasIndex || 0)),
      rotation: Number(this.get("r", defaults?.rotation || 0)),
      rangeId: this.get("rid", defaults?.rangeId || ""),
      xywh: this.get("xywh", defaults?.xywh || ""),
      target: this.get("target", defaults?.target ||  ""),
      cfi: this.get("cfi", defaults?.cfi ||  ""),
      locales: formattedLocales.length ? formattedLocales : undefined,
    };
  }

  public bindTo(uv: UniversalViewer) {
    uv.on('pause', (currentTime) => {
      if (currentTime > 0) {
        this.set('t', currentTime);
      }
    }, false);

    uv.on('collectionIndexChanged', (collectionIndex) => {
      this.set('c', collectionIndex);
    }, false);

    uv.on('manifestIndexChanged', (manifestIndex) => {
      this.set('m', manifestIndex);
    }, false);

    uv.on('sequenceIndexChanged', (sequenceIndex) => {
      this.set('s', sequenceIndex);
    }, false);

    uv.on('canvasIndexChanged', (canvasIndex) => {
      this.set('cv', canvasIndex);
    }, false);

    uv.on('rangeChanged', (rangeId) => {
      this.set('rid', rangeId);
    }, false);

    uv.on('openseadragonExtension.rotationChanged', (rotation) => {
      this.set('r', rotation);
    }, false);

    uv.on('openseadragonExtension.xywhChanged', (xywh) => {
      this.set('xywh', xywh);
    }, false);

    uv.on('ebookExtension.cfiFragmentChanged', (cfi) => {
      this.set('cfi', cfi);
    }, false);
  }
}
