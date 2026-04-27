import { UVAdapter } from "../../UVAdapter";
import { Urls } from "../iiif/Utils";
import { UniversalViewer } from "../../UniversalViewer";
import { IUVData } from "../../IUVData";
import { IIIFEvents } from "./IIIFEvents";
import { defaultLocale } from "../../Utils";
import { parseContentStateParameter } from "./helpers";

export class URLAdapter extends UVAdapter {
  constructor(readonly: boolean = false) {
    super(readonly);
  }

  public get<T>(key: string, defaultValue?: T | undefined): T | undefined {
    const hashParameter: string | null = Urls.getHashParameter(key, document);

    if (hashParameter === null) {
      return defaultValue;
    }

    return hashParameter as unknown as T;
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
        const existing = Urls.getHashParameter(key);
        if (existing !== null) {
          Urls.setHashParameter(key, "", document);
        }
      }
    }
  }

  public getInitialData(overrides?: IUVData<any>): IUVData<any> {
    const formattedLocales: Array<{ label?: string; name: string }> = [];
    const locales = this.get<string>("locales", "");
    if (locales) {
      const names = locales.split(",");
      for (const i in names) {
        const parts = String(names[i]).split(":");
        formattedLocales[i] = { name: parts[0], label: parts[1] };
      }
    } else {
      formattedLocales.push(defaultLocale);
    }

    function numberOrUndefined(num) {
      if (num === undefined) {
        return undefined;
      }

      return Number(num);
    }

    // if there's a iiif_content param in the qs, parse out the components of it and use those
    const iiifContent = this.get<string>("iiif-content", "");

    if (iiifContent) {
      let iiifManifestId: string = "";
      let canvasId: string = "";
      let xywh: string = "";

      const contentState = parseContentStateParameter(iiifContent) as any;
      if (contentState.type === "remote-content-state") {
        iiifManifestId = contentState.id;
      } else if (contentState && contentState.target.length) {
        const firstTarget = contentState.target[0];
        if (
          firstTarget.type === "SpecificResource" &&
          firstTarget.source.type === "Canvas"
        ) {
          const manifestSource = (firstTarget.source.partOf || []).find(
            (s) => s.type === "Manifest"
          );

          // get canvas selector
          if (
            firstTarget.selector &&
            firstTarget.selector.type === "BoxSelector"
          ) {
            canvasId = firstTarget.source.id;

            xywh =
              firstTarget.selector.x +
              "," +
              firstTarget.selector.y +
              "," +
              firstTarget.selector.width +
              "," +
              firstTarget.selector.height;
          }

          if (manifestSource) {
            iiifManifestId = manifestSource.id;
          }
        }
      }

      return {
        iiifManifestId: iiifManifestId,
        collectionIndex: undefined,
        manifestIndex: 0,
        canvasId: canvasId,
        canvasIndex: 0,
        rotation: 0,
        rangeId: "",
        xywh: xywh,
        target: "",
        // cfi: this.get<string>("cfi", ""),
        // youTubeVideoId: this.get<string>("youTubeVideoId", ""),
        locales: formattedLocales.length ? formattedLocales : undefined,
        ...overrides,
      };
    }

    return {
      iiifManifestId:
        this.get<string>("iiifManifestId") || this.get<string>("manifest"),
      collectionIndex: numberOrUndefined(this.get<number>("c")),
      manifestIndex: Number(this.get<number>("m", 0)),
      canvasIndex: Number(this.get<number>("cv", 0)),
      rotation: Number(this.get<number>("r", 0)),
      rangeId: this.get<string>("rid", ""),
      xywh: this.get<string>("xywh", ""),
      target: this.get<string>("target", ""),
      // cfi: this.get<string>("cfi", ""),
      // youTubeVideoId: this.get<string>("youTubeVideoId", ""),
      locales: formattedLocales.length ? formattedLocales : undefined,
      ...overrides,
    };
  }

  public dispose(): void {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }

  public bindTo(uv: UniversalViewer) {
    uv.adapter = this;

    // Removing this for now, as t={time} does not line up with what the
    // user will see when they reload the page.
    // uv.on(
    //   IIIFEvents.PAUSE,
    //   (currentTime) => {
    //     if (currentTime > 0) {
    //       this.set("t", currentTime);
    //     }
    //   },
    //   false
    // );

    uv.on(
      IIIFEvents.COLLECTION_INDEX_CHANGE,
      (collectionIndex) => {
        this.set("c", collectionIndex);
      },
      false
    );

    uv.on(
      IIIFEvents.MANIFEST_INDEX_CHANGE,
      (manifestIndex) => {
        this.set("m", manifestIndex);
      },
      false
    );

    uv.on(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex) => {
        this.set("cv", canvasIndex);
      },
      false
    );

    uv.on(
      IIIFEvents.RANGE_CHANGE,
      (range) => {
        const rangeId = !range || typeof range === "string" ? range : range.id;
        this.set("rid", rangeId);
      },
      false
    );

    uv.on(
      IIIFEvents.TARGET_CHANGE,
      (target) => {
        this.set("xywh", this.getFragment("xywh", target));
      },
      false
    );
  }
}
