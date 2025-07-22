const $ = require("jquery");
import { Auth09 } from "./Auth09";
import { Auth1 } from "./Auth1";
import { AuthDialogue } from "../uv-dialogues-module/AuthDialogue";
import { ClickThroughDialogue } from "../uv-dialogues-module/ClickThroughDialogue";
import { ExtensionLoader, IExtension } from "./IExtension";
import { ILocale } from "./ILocale";
import { ISharePreview } from "./ISharePreview";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { IUVData } from "@/IUVData";
import { LoginDialogue } from "../uv-dialogues-module/LoginDialogue";
import { RestrictedDialogue } from "../uv-dialogues-module/RestrictedDialogue";
import { Shell } from "./Shell";
import {
  AnnotationGroup,
  ExternalResource,
  Helper,
  ILabelValuePair,
} from "@iiif/manifold";
// import { ExternalResource } from "./TestExternalResource";
import {
  Annotation,
  AnnotationBody,
  Canvas,
  Collection,
  IExternalResource,
  IExternalResourceData,
  IExternalResourceOptions,
  IExternalImageResourceData,
  IManifestoOptions,
  Manifest,
  Range,
} from "manifesto.js";
import { ViewingHint } from "@iiif/vocabulary/dist-commonjs/";
import * as KeyCodes from "../../KeyCodes";
import {
  Bools,
  Documents,
  Objects,
  Storage,
  StorageType,
  Urls,
  Strings,
} from "@edsilv/utils";
import { defaultLocale, isVisible } from "../../../../Utils";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import type { StoreApi } from "zustand/vanilla";
import { ExtensionState } from "./ExtensionState";
import { BaseConfig, Metric, MetricType } from "../../BaseConfig";

export class BaseExtension<T extends BaseConfig> implements IExtension {
  $authDialogue: JQuery;
  $clickThroughDialogue: JQuery;
  $element: JQuery;
  $loginDialogue: JQuery;
  $restrictedDialogue: JQuery;
  authDialogue: AuthDialogue;
  annotations: AnnotationGroup[] = [];
  clickThroughDialogue: ClickThroughDialogue;
  extensionHost: IIIFExtensionHost;
  data: IUVData<T>;
  extensions: any;
  helper: Helper;
  isCreated: boolean = false;
  isLoggedIn: boolean = false;
  lastCanvasIndex: number;
  loginDialogue: LoginDialogue;
  metric: MetricType;
  metrics: Metric[] = [];
  mouseX: number;
  mouseY: number;
  type: ExtensionLoader;
  resources: IExternalResourceData[] | null;
  restrictedDialogue: RestrictedDialogue;
  shell: Shell;
  shifted: boolean = false;
  store: StoreApi<ExtensionState | null>; // null for dispose()
  tabbing: boolean = false;
  browserDetect: BrowserDetect;
  locales = {};
  defaultConfig: T = {} as any;
  localeLoaders: Record<string, () => Promise<any>> = {
    "en-GB": () => import("../../../../locales/en-GB.json"),
    "cy-GB": () => import("../../../../locales/cy-GB.json"),
    "fr-FR": () => import("../../../../locales/fr-FR.json"),
    "pl-PL": () => import("../../../../locales/pl-PL.json"),
    "sv-SE": () => import("../../../../locales/sv-SE.json"),
  };

  public create(): void {
    const that = this;

    this.browserDetect = new BrowserDetect();
    this.browserDetect.init();

    Auth09.publish = this.extensionHost.publish.bind(this.extensionHost);
    Auth1.publish = this.extensionHost.publish.bind(this.extensionHost);

    this.$element = $(this.extensionHost.options.target);
    this.$element.data("component", this.extensionHost);

    this._parseMetrics();
    this._updateMetric();
    this._initLocales();

    // add/remove classes.
    this.$element.empty();
    this.$element.removeClass();
    this.$element.addClass("uv-iiif-extension-host");
    this.$element.addClass("loading");
    if (this.data.locales) {
      this.$element.addClass(this.data.locales[0].name.toLowerCase());
      this.$element.prop("lang", this.data.locales[0].name.substring(0, 2));
    } else {
      this.$element.prop("lang", defaultLocale[0].name.substring(0, 2));
    }

    if (this.isRightPanelEnabled()) {
      this.$element.addClass("right-panel-enabled");
    }
    if (this.isLeftPanelEnabled()) {
      this.$element.addClass("left-panel-enabled");
    }
    if (this.isFooterPanelEnabled()) {
      this.$element.addClass("footer-panel-enabled");
    }

    this.$element.addClass(this.type.name);
    this.$element.addClass("browser-" + this.browserDetect.browser);
    this.$element.addClass("browser-version-" + this.browserDetect.version);
    this.$element.prop("tabindex", -1);

    if (this.data.embedded) {
      this.$element.addClass("embedded");
    }

    if (this.isMobile()) {
      this.$element.addClass("mobile");
    }

    if (Documents.supportsFullscreen()) {
      this.$element.addClass("fullscreen-supported");
    }

    if (this.isFullScreen()) {
      this.$element.addClass("fullscreen");
    }

    this.$element.on("mousemove", (e) => {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    });

    // if this is the first load
    if (!this.data.isReload) {
      const visibilityProp: string | null = Documents.getHiddenProp();

      if (visibilityProp) {
        const event: string =
          visibilityProp.replace(/[H|h]idden/, "") + "visibilitychange";
        document.addEventListener(event, () => {
          // resize after a tab has been shown (fixes safari layout issue)
          if (!Documents.isHidden()) {
            this.resize();
          }
        });
      }

      if (Bools.getBool(this.data.config!.options.dropEnabled, true)) {
        this.$element.on("drop", (e) => {
          e.preventDefault();
          const dropUrl: any = (<any>e.originalEvent).dataTransfer.getData(
            "URL"
          );
          const a: HTMLAnchorElement = Urls.getUrlParts(dropUrl);
          let manifestUri: string | null =
            Urls.getQuerystringParameterFromString("manifest", a.search);

          if (!manifestUri) {
            // look for collection param
            manifestUri = Urls.getQuerystringParameterFromString(
              "collection",
              a.search
            );
          }
          //var canvasUri = Urls.getQuerystringParameterFromString('canvas', url.search);

          if (manifestUri) {
            this.fire(Events.DROP, manifestUri);
            const data: IUVData<T> = <IUVData<T>>{};
            data.iiifManifestId = manifestUri;
            this.reload(data);
          }
        });
      }

      this.$element.on("dragover", (e) => {
        // allow drop
        e.preventDefault();
      });

      // keyboard events.

      this.$element.on("keyup keydown", (e: any) => {
        this.shifted = e.shiftKey;
        this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
      });

      this.$element.on("keydown", (e: any) => {
        let event: string | null = null;
        let preventDefault: boolean = true;

        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
          if (e.keyCode === KeyCodes.KeyDown.Enter) {
            event = IIIFEvents.RETURN;
            preventDefault = false;
          }
          if (e.keyCode === KeyCodes.KeyDown.Escape) event = IIIFEvents.ESCAPE;
          if (e.keyCode === KeyCodes.KeyDown.PageUp) event = IIIFEvents.PAGE_UP;
          if (e.keyCode === KeyCodes.KeyDown.PageDown)
            event = IIIFEvents.PAGE_DOWN;
          if (e.keyCode === KeyCodes.KeyDown.End) event = IIIFEvents.END;
          if (e.keyCode === KeyCodes.KeyDown.Home) event = IIIFEvents.HOME;
          if (
            e.keyCode === KeyCodes.KeyDown.NumpadPlus ||
            e.keyCode === 171 ||
            e.keyCode === KeyCodes.KeyDown.Equals
          ) {
            event = IIIFEvents.PLUS;
            preventDefault = false;
          }
          if (
            e.keyCode === KeyCodes.KeyDown.NumpadMinus ||
            e.keyCode === 173 ||
            e.keyCode === KeyCodes.KeyDown.Dash
          ) {
            event = IIIFEvents.MINUS;
            preventDefault = false;
          }

          if (that.useArrowKeysToNavigate()) {
            if (e.keyCode === KeyCodes.KeyDown.LeftArrow)
              event = IIIFEvents.LEFT_ARROW;
            if (e.keyCode === KeyCodes.KeyDown.UpArrow)
              event = IIIFEvents.UP_ARROW;
            if (e.keyCode === KeyCodes.KeyDown.RightArrow)
              event = IIIFEvents.RIGHT_ARROW;
            if (e.keyCode === KeyCodes.KeyDown.DownArrow)
              event = IIIFEvents.DOWN_ARROW;
          }
        }

        if (event) {
          if (preventDefault) {
            e.preventDefault();
          }
          this.extensionHost.publish(event);
        }
      });
    }

    this.extensionHost.subscribe(Events.EXIT_FULLSCREEN, () => {
      if (this.isOverlayActive()) {
        this.extensionHost.publish(IIIFEvents.ESCAPE);
      }
      this.extensionHost.publish(IIIFEvents.ESCAPE);
      this.extensionHost.publish(Events.RESIZE);
    });

    // this.$element.append('<a href="/" id="top"></a>');
    this.$element.append('<iframe id="commsFrame"></iframe>');

    this.extensionHost.subscribeAll((event, args) => {
      // subscribe to all UV events except those handled below with their own fire() calls
      const exceptions = [
        Events.LOAD,
        // IIIFEvents.CREATE,
        Events.DROP,
        Events.TOGGLE_FULLSCREEN,
        Events.EXTERNAL_RESOURCE_OPENED,
        Events.RELOAD,
      ];

      if (!exceptions.includes(event)) {
        this.fire(event, args);
      }
    });

    this.extensionHost.subscribe(Events.EXTERNAL_RESOURCE_OPENED, () => {
      this.fire(Events.EXTERNAL_RESOURCE_OPENED);
    });

    this.extensionHost.subscribe(IIIFEvents.LOGIN_FAILED, () => {
      this.showMessage(this.data.config!.content.authorisationFailedMessage);
    });

    this.extensionHost.subscribe(IIIFEvents.LOGIN, () => {
      this.isLoggedIn = true;
    });

    this.extensionHost.subscribe(IIIFEvents.LOGOUT, () => {
      this.isLoggedIn = false;
    });

    this.extensionHost.subscribe(IIIFEvents.BOOKMARK, () => {
      this.bookmark();
    });

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.data.canvasIndex = canvasIndex;
        this.lastCanvasIndex = this.helper.canvasIndex;
        this.helper.canvasIndex = canvasIndex;
      }
    );

    this.extensionHost.subscribe(IIIFEvents.CLOSE_LEFT_PANEL, () => {
      if (that.$element.hasClass("loading"))
        that.$element.removeClass("loading");
      this.resize();
    });

    this.extensionHost.subscribe(IIIFEvents.CLOSE_RIGHT_PANEL, () => {
      this.resize();
    });

    this.extensionHost.subscribe(
      IIIFEvents.COLLECTION_INDEX_CHANGE,
      (collectionIndex: number) => {
        this.data.collectionIndex = collectionIndex;
      }
    );

    this.extensionHost.subscribe(Events.CREATED, () => {
      this.isCreated = true;
    });

    this.extensionHost.subscribe(IIIFEvents.ESCAPE, () => {
      if (this.isFullScreen() && !this.isOverlayActive()) {
        this.extensionHost.publish(Events.TOGGLE_FULLSCREEN);
      }
    });

    this.extensionHost.subscribe(Events.LOAD, () => {
      setTimeout(() => {
        this.extensionHost.publish(Events.RESIZE);
        this.fire(Events.LOAD, this.helper.getCurrentCanvas().id);
        this.$element.removeClass("loading");
      }, 100); // firefox needs this :-(
    });

    this.extensionHost.subscribe(IIIFEvents.FEEDBACK, () => {
      this.feedback();
    });

    this.extensionHost.subscribe(IIIFEvents.FORBIDDEN, () => {
      this.extensionHost.publish(IIIFEvents.OPEN_EXTERNAL_RESOURCE);
    });

    this.extensionHost.subscribe(Events.LOAD_FAILED, () => {
      if (
        !that.lastCanvasIndex == null &&
        that.lastCanvasIndex !== that.helper.canvasIndex
      ) {
        this.extensionHost.publish(
          IIIFEvents.CANVAS_INDEX_CHANGE,
          that.lastCanvasIndex
        );
      }
    });

    this.extensionHost.subscribe(
      IIIFEvents.MANIFEST_INDEX_CHANGE,
      (manifestIndex: number) => {
        this.data.manifestIndex = manifestIndex;
      }
    );

    this.extensionHost.subscribe(IIIFEvents.OPEN, () => {
      const openUri: string = Strings.format(
        this.data.config!.options.openTemplate,
        this.helper.manifestUri
      );
      window.open(openUri);
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_LEFT_PANEL, () => {
      if (!this.$element.hasClass("loading")) {
        this.resize();
      }
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_RIGHT_PANEL, () => {
      if (!this.$element.hasClass("loading")) {
        this.resize();
      }
    });

    this.extensionHost.subscribe(
      IIIFEvents.RANGE_CHANGE,
      (range: Range | null) => {
        if (range) {
          this.data.rangeId = range.id;
          this.helper.rangeId = range.id;
        } else {
          this.data.rangeId = undefined;
          this.helper.rangeId = undefined;
        }
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.RESOURCE_DEGRADED,
      (resource: IExternalResource) => {
        Auth09.handleDegraded(resource);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.SHOW_MESSAGE, (message: string) => {
      this.showMessage(message);
    });

    this.extensionHost.subscribe(IIIFEvents.SHOW_TERMS_OF_USE, () => {
      let terms: string | null = this.helper.getLicense();

      if (!terms) {
        const requiredStatement: ILabelValuePair | null =
          this.helper.getRequiredStatement();

        if (requiredStatement && requiredStatement.value) {
          terms = requiredStatement.value;
        }
      }

      if (terms) {
        this.showMessage(terms);
      }
    });

    this.extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, () => {
      const overrideFullScreen: boolean =
        this.data.config!.options.overrideFullScreen;

      this.extensionHost.isFullScreen = !this.extensionHost.isFullScreen;

      if (!overrideFullScreen) {
        $("#top").focus();

        if (this.extensionHost.isFullScreen) {
          this.$element.addClass("fullscreen");
        } else {
          this.$element.removeClass("fullscreen");
        }
      }

      this.fire(Events.TOGGLE_FULLSCREEN, {
        isFullScreen: this.extensionHost.isFullScreen,
        overrideFullScreen: overrideFullScreen,
      });
    });

    // create shell and shared views.
    this.shell = new Shell(this.$element);

    this.createModules();
    this.extensionHost.publish(Events.RESIZE); // initial sizing

    setTimeout(() => {
      this.render();
      this.extensionHost.publish(Events.CREATED);
      this._setDefaultFocus();
    }, 1);
  }

  public async loadConfig(locale: string, extension: string): Promise<any> {
    return this.translateLocale(this.defaultConfig, locale);
  }

  private async translateLocale(
    config: Object,
    locale: String
  ): Promise<Object> {
    const loader =
      this.localeLoaders[locale as any] || this.localeLoaders["en-GB"];
    const localeStrings = (await loader()) || {};
    let conf = JSON.stringify(config);

    for (const str in localeStrings) {
      const replaceStr = str.replace("$", "");
      const re = new RegExp(`\\$${replaceStr}\\b`, "g");
      conf = conf.replace(re, localeStrings[str]);
    }

    conf = JSON.parse(conf);

    return conf;
  }

  createModules(): void {
    this.$authDialogue = $(
      '<div class="overlay auth" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$authDialogue);
    this.authDialogue = new AuthDialogue(this.$authDialogue);

    this.$clickThroughDialogue = $(
      '<div class="overlay clickthrough" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$clickThroughDialogue);
    this.clickThroughDialogue = new ClickThroughDialogue(
      this.$clickThroughDialogue
    );

    this.$restrictedDialogue = $(
      '<div class="overlay login" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$restrictedDialogue);
    this.restrictedDialogue = new RestrictedDialogue(this.$restrictedDialogue);

    this.$loginDialogue = $(
      '<div class="overlay login" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$loginDialogue);
    this.loginDialogue = new LoginDialogue(this.$loginDialogue);
  }

  private _setDefaultFocus(): void {
    setTimeout(() => {
      if (this.data.config!.options.allowStealFocus) {
        $("[tabindex=0]").focus();
      }
    }, 1);
  }

  width(): number {
    return this.$element.width();
  }

  height(): number {
    return this.$element.height();
  }

  exitFullScreen(): void {
    this.extensionHost.publish(Events.EXIT_FULLSCREEN);
  }

  fire(name: string, ...args: any[]): void {
    if (this.data.debug) {
      console.log(name, arguments[1]);
    }
    this.extensionHost.fire(name, arguments[1]);
  }

  redirect(uri: string): void {
    this.fire(IIIFEvents.REDIRECT, uri);
  }

  refresh(): void {
    this.fire(IIIFEvents.REFRESH, null);
  }

  render(): void {
    if (
      !this.isCreated ||
      this.data.collectionIndex !== this.helper.collectionIndex
    ) {
      this.extensionHost.publish(
        IIIFEvents.COLLECTION_INDEX_CHANGE,
        this.data.collectionIndex
      );
    }

    if (
      !this.isCreated ||
      this.data.manifestIndex !== this.helper.manifestIndex
    ) {
      if (this.data.iiifManifestId !== undefined) {
        this.extensionHost.publish(
          IIIFEvents.MANIFEST_INDEX_CHANGE,
          this.data.manifestIndex
        );
      }
    }

    if (!this.isCreated || this.data.canvasIndex !== this.helper.canvasIndex) {
      if (this.data.canvasIndex === undefined) {
        this.data.canvasIndex = 0;
      }

      if (this.data.canvasId) {
        this.data.canvasIndex = this.helper.canvasIndex;
      }

      this.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.data.canvasIndex
      );
    }

    if (!this.isCreated || this.data.rangeId !== this.helper.rangeId) {
      if (this.data.rangeId) {
        const range: Range | null = this.helper.getRangeById(this.data.rangeId);

        if (range) {
          this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);
        } else {
          console.warn("range id not found:", this.data.rangeId);
        }
      }
    }
  }

  private _initLocales(): void {
    const availableLocales: any[] =
      this.data.config!.localisation.locales.slice(0);
    const configuredLocales: ILocale[] | undefined = this.data.locales;
    const finalLocales: ILocale[] = [];

    // loop through configuredLocales array (those passed in when initialising the UV component)
    // if availableLocales (those available in each extension's l10n directory) contains a configured locale, add it to finalLocales.
    // if the configured locale has a label, substitute it
    // mark locale as added.
    // if limitLocales is disabled,
    // loop through remaining availableLocales and add to finalLocales.

    if (configuredLocales) {
      configuredLocales.forEach((configuredLocale: ILocale) => {
        const match: any[] = availableLocales.filter((item: any) => {
          return item.name === configuredLocale.name;
        });
        if (match.length) {
          var m: any = match[0];
          if (configuredLocale.label) m.label = configuredLocale.label;
          m.added = true;
          finalLocales.push(m);
        }
      });

      const limitLocales: boolean = Bools.getBool(
        this.data.config!.options.limitLocales,
        false
      );

      if (!limitLocales) {
        availableLocales.forEach((availableLocale: any) => {
          if (!availableLocale.added) {
            finalLocales.push(availableLocale);
          }
          delete availableLocale.added;
        });
      }

      this.data.locales = finalLocales;
    } else {
      console.warn("No locales configured");
    }
  }

  private _parseMetrics(): void {
    const metrics: Metric[] = this.data.config!.options.metrics;

    if (metrics) {
      for (let i = 0; i < metrics.length; i++) {
        const m: Metric = metrics[i];
        this.metrics.push(m);
      }
    }
  }

  private _updateMetric(): void {
    // loop through all metrics
    // find one that matches the current dimensions
    // when a metric is found that isn't the current metric, set it to be the current metric and publish a METRIC_CHANGE event

    for (let i = this.metrics.length - 1; i >= 0; i--) {
      const metric: Metric = this.metrics[i];

      const width: number = window.innerWidth;

      if (width >= metric.minWidth) {
        if (this.metric !== metric.type) {
          this.metric = metric.type;
          // remove current metric class
          for (var j = 0; j < this.metrics.length; j++) {
            this.$element.removeClass(this.metrics[j].type);
          }
          this.$element.addClass(metric.type);
          this.extensionHost.publish(IIIFEvents.METRIC_CHANGE);
        }
        break;
      }
    }
  }

  resize(): void {
    this._updateMetric();
    this.extensionHost.publish(Events.RESIZE);
  }

  // re-bootstraps the application with new querystring params
  reload(data?: IUVData<T>): void {
    this.extensionHost.publish(Events.RELOAD, data);
  }

  getShareUrl(): string | null {
    // If not embedded on an external domain (this causes CORS errors when fetching parent url)
    if (!this.data.embedded) {
      // Use the current page URL with hash params
      if (Documents.isInIFrame()) {
        return (<any>parent.document).location.href;
      } else {
        return (<any>document).location.href;
      }
    } else {
      // If there's a `related` property of format `text/html` in the manifest
      if (this.helper.hasRelatedPage()) {
        // Use the `related` property in the URL box
        var related: any = this.helper.getRelated();
        if (related && related.length) {
          related = related[0];
        }
        return related["@id"];
      }

      // If there's a `homepage` property in the manifest
      const manifest = this.helper.manifest;
      const homepage = manifest && manifest.getHomepage();
      if (homepage) {
        // Use the `homepage` property in the URL box
        return homepage;
      }
    }

    return null;
  }

  getIIIFShareUrl(shareManifests: boolean = false): string {
    let manifestUri: string | undefined;

    if (shareManifests) {
      if (this.helper.manifest) {
        manifestUri = this.helper.manifest.id;
      } else {
        manifestUri = this.helper.manifestUri;
      }
    }

    return `${manifestUri}?manifest=${manifestUri}`;
  }

  // addTimestamp(uri: string): string {
  //   return uri + "?t=" + Dates.getTimeStamp();
  // }

  getDomain(): string {
    const parts: any = Urls.getUrlParts(this.helper.manifestUri);
    return parts.host;
  }

  getSettings(): ISettings {
    if (Bools.getBool(this.data.config!.options.saveUserSettings, false)) {
      const settings: any = Storage.get("uv.settings", StorageType.LOCAL);

      if (settings) {
        return $.extend(this.data.config!.options, settings.value);
      }
    }

    return this.data.config!.options;
  }

  updateSettings(settings: ISettings): void {
    if (Bools.getBool(this.data.config!.options.saveUserSettings, false)) {
      const storedSettings: any = Storage.get("uv.settings", StorageType.LOCAL);

      if (storedSettings) {
        settings = $.extend(storedSettings.value, settings);
      }

      // store for ten years
      Storage.set("uv.settings", settings, 315360000, StorageType.LOCAL);
    }

    this.data.config!.options = $.extend(this.data.config!.options, settings);
  }

  getLocale(): string {
    return this.helper.options.locale as string;
  }

  getSharePreview(): ISharePreview {
    const title: string | null = this.helper.getLabel();

    // todo: use getThumb (when implemented)

    const canvas: Canvas = this.helper.getCurrentCanvas();
    let thumbnail: string = canvas.getProperty("thumbnail");

    if (!thumbnail || !(typeof thumbnail === "string")) {
      thumbnail = canvas.getCanonicalImageUri(
        this.data.config!.options.bookmarkThumbWidth
      );
    }

    return <ISharePreview>{
      title: title,
      image: thumbnail,
    };
  }

  getAppUri(): string {
    const options = this.data.config!.modules.shareDialogue.options;

    const host =
      options?.embedHost ??
      `${window.location.protocol}//${window.location.hostname}`;
    const port = options?.embedPort ?? window.location.port;
    const path = options?.embedPath ?? "/uv.html";

    return `${host}${port ? `:${port}` : ""}${path}`;
  }

  buildEmbedScript(
    template: string,
    width: number,
    height: number,
    hashParams: URLSearchParams
  ): string {
    let appUri: string = this.getAppUri();
    const title: string = this.helper.getLabel() ?? "";

    if ((hashParams?.size ?? 0) > 0) {
      appUri += `#?${hashParams.toString()}`;
    }

    const script: string = Strings.format(
      template,
      appUri,
      width.toString(),
      height.toString(),
      title
    );

    return script;
  }

  public getPagedIndices(
    canvasIndex: number = this.helper.canvasIndex
  ): number[] {
    return [canvasIndex];
  }

  public getCurrentCanvases(): Canvas[] {
    const indices: number[] = this.getPagedIndices(this.helper.canvasIndex);
    const canvases: Canvas[] = [];

    for (let i = 0; i < indices.length; i++) {
      const index: number = indices[i];
      const canvas: Canvas = this.helper.getCanvasByIndex(index);
      if (canvas) {
        canvases.push(canvas);
      }
    }

    return canvases;
  }

  public getCanvasLabels(label: string): string {
    const indices: number[] = this.getPagedIndices();
    let labels: string = "";

    if (indices.length === 1) {
      labels = label;
    } else {
      for (let i = 1; i <= indices.length; i++) {
        if (labels.length) labels += ",";
        labels += label + " " + i;
      }
    }

    return labels;
  }

  public getCurrentCanvasRange(): Range | null {
    //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
    //var range: manifesto.Range = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
    const range: Range | null = this.helper.getCanvasRange(
      this.helper.getCurrentCanvas()
    );
    return range;
  }

  // todo: move to manifold?
  public getExternalResources(
    resources?: IExternalResource[]
  ): Promise<IExternalResourceData[]> {
    const indices: number[] = this.getPagedIndices();
    const resourcesToLoad: IExternalResource[] = [];

    indices.forEach((index: number) => {
      const canvas: Canvas = this.helper.getCanvasByIndex(index);
      let r: IExternalResource;

      if (!canvas.externalResource) {
        r = new ExternalResource(canvas, <IExternalResourceOptions>{
          authApiVersion: this.data.config!.options.authAPIVersion,
        });
      } else {
        r = canvas.externalResource;
      }

      // reload resources if passed
      if (resources) {
        const found: IExternalResource | undefined = resources.find(
          (f: IExternalResource) => {
            return f.dataUri === r.dataUri;
          }
        );

        if (found) {
          resourcesToLoad.push(found);
        } else {
          resourcesToLoad.push(r);
        }
      } else {
        resourcesToLoad.push(r);
      }
    });

    const storageStrategy: StorageType = this.data.config!.options
      .tokenStorage as StorageType;
    const authAPIVersion: number = this.data.config!.options.authAPIVersion;

    // if using auth api v1
    if (authAPIVersion === 1) {
      return new Promise<IExternalResourceData[]>((resolve) => {
        const options: IManifestoOptions = <IManifestoOptions>{
          locale: this.helper.options.locale,
        };

        Auth1.loadExternalResources(
          resourcesToLoad,
          storageStrategy,
          options
        ).then((r: IExternalResource[]) => {
          this.resources = r.map((resource: IExternalResource) => {
            return this._prepareResourceData(resource);
          });

          resolve(this.resources);
        });
      });
    } else {
      return new Promise<any[]>((resolve) => {
        Auth09.loadExternalResources(resourcesToLoad, storageStrategy).then(
          (r: any[]) => {
            this.resources = r.map((resource: IExternalResource) => {
              return this._prepareResourceData(resource);
            });

            resolve(this.resources);
          }
        );
      });
    }
  }

  // copy useful properties over to the data object to be opened in center panel's openMedia method
  // this is the info.json if there is one, which can be opened natively by openseadragon.
  private _prepareResourceData(resource: IExternalResource): any {
    resource.data.hasServiceDescriptor = resource.hasServiceDescriptor();

    // if the data isn't an info.json, give it the necessary viewing properties
    if (!resource.hasServiceDescriptor()) {
      resource.data.id = <string>resource.dataUri;
      (<IExternalImageResourceData>resource.data).width = resource.width;
      (<IExternalImageResourceData>resource.data).height = resource.height;
    }

    resource.data.index = resource.index;

    return Objects.toPlainObject(resource.data);
  }

  getMediaFormats(canvas: Canvas): AnnotationBody[] {
    const annotations: Annotation[] = canvas.getContent();

    if (annotations && annotations.length) {
      const annotation: Annotation = annotations[0];
      return annotation.getBody();
    } else {
      // legacy IxIF compatibility
      const body: AnnotationBody = <any>{
        id: canvas.id,
        type: canvas.getType(),
        getFormat: function () {
          return "";
        },
      };

      return [body];
    }
  }

  viewCanvas(canvasIndex: number): void {
    if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
      this.showMessage(this.data.config!.content.canvasIndexOutOfRange);
      return;
    }

    this.extensionHost.publish(IIIFEvents.OPEN_EXTERNAL_RESOURCE);
  }

  showMessage(
    message: string,
    acceptCallback?: Function,
    buttonText?: string,
    allowClose?: boolean
  ): void {
    this.closeActiveDialogue();

    this.extensionHost.publish(IIIFEvents.SHOW_GENERIC_DIALOGUE, {
      message: message,
      acceptCallback: acceptCallback,
      buttonText: buttonText,
      allowClose: allowClose,
    });
  }

  closeActiveDialogue(): void {
    this.extensionHost.publish(IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
  }

  isOverlayActive(): boolean {
    return isVisible(this.shell.$overlays);
  }

  isDesktopMetric(): boolean {
    return this.metric === "lg" || this.metric === "xl";
  }

  isMobileMetric(): boolean {
    return this.metric === "sm" || this.metric === "md";
  }

  isMetric(metric: string | string[]): boolean {
    if (typeof metric === "string") {
      return this.metric === metric;
    }

    return metric.some((item) => this.metric === item);
  }

  // todo: use redux in manifold to get reset state
  viewManifest(manifest: Manifest): void {
    const data: IUVData<T> = <IUVData<T>>{};
    data.iiifManifestId = this.helper.manifestUri;
    data.collectionIndex = <number>this.helper.getCollectionIndex(manifest);
    data.manifestIndex = <number>manifest.index;
    data.canvasIndex = 0;

    this.reload(data);
  }

  // todo: use redux in manifold to get reset state
  viewCollection(collection: Collection): void {
    const data: IUVData<T> = <IUVData<T>>{};
    //data.manifestUri = this.helper.manifestUri;
    data.iiifManifestId = collection.parentCollection
      ? collection.parentCollection.id
      : this.helper.manifestUri;
    data.collectionIndex = collection.index;
    data.manifestIndex = 0;
    data.canvasIndex = 0;

    this.reload(data);
  }

  isFullScreen(): boolean {
    return this.extensionHost.isFullScreen;
  }

  isHeaderPanelEnabled(): boolean {
    return Bools.getBool(this.data.config!.options.headerPanelEnabled, true);
  }

  isLeftPanelEnabled(): boolean {
    if (Bools.getBool(this.data.config!.options.leftPanelEnabled, true)) {
      if (this.helper.hasParentCollection()) {
        return true;
      } else if (this.helper.isMultiCanvas()) {
        const viewingHint: ViewingHint | null = this.helper.getViewingHint();

        if (
          !viewingHint ||
          (viewingHint && viewingHint !== ViewingHint.CONTINUOUS)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isRightPanelEnabled(): boolean {
    return Bools.getBool(this.data.config!.options.rightPanelEnabled, true);
  }

  isFooterPanelEnabled(): boolean {
    return Bools.getBool(this.data.config!.options.footerPanelEnabled, true);
  }

  // isMobile(): boolean {
  //   return $.browser.mobile;
  //   // let check = false;
  //   // (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  //   // return check;
  // }

  isMobile(): boolean {
    const a = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile =
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|android|ipad|playbook|silk|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      );

    //console.log("is mobile", isMobile);
    return isMobile;
  }

  useArrowKeysToNavigate(): boolean {
    return Bools.getBool(
      this.data.config!.options.useArrowKeysToNavigate,
      true
    );
  }

  bookmark(): void {
    // override for each extension
  }

  feedback(): void {
    this.fire(IIIFEvents.FEEDBACK, this.data);
  }

  getAlternateLocale(): ILocale | null {
    let alternateLocale: ILocale | null = null;

    if (this.data.locales && this.data.locales.length > 1) {
      alternateLocale = this.data.locales[1];
    }

    return alternateLocale;
  }

  getSerializedLocales(): string | null {
    if (this.data.locales) {
      return this.serializeLocales(this.data.locales);
    }

    return null;
  }

  serializeLocales(locales: ILocale[]): string {
    let serializedLocales: string = "";

    for (let i = 0; i < locales.length; i++) {
      const l = locales[i];
      if (i > 0) serializedLocales += ",";
      serializedLocales += l.name;
      if (l.label) {
        serializedLocales += ":" + l.label;
      }
    }

    return serializedLocales;
  }

  changeLocale(locale: string): void {
    // re-order locales so the passed locale is first
    const data: IUVData<T> = <IUVData<T>>{};

    if (this.data.locales) {
      data.locales = this.data.locales.slice(0);

      const fromIndex: number = data.locales.findIndex((l: any) => {
        return l.name === locale;
      });

      const toIndex: number = 0;
      data.locales.splice(toIndex, 0, data.locales.splice(fromIndex, 1)[0]);

      this.reload(data);
    }
  }

  dispose(): void {
    this.store?.setState(null);
  }
}

class BrowserDetect {
  browser: string;
  version: number | unknown;
  versionSearchString: string;

  dataBrowser = [
    { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
    { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
    { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
    { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
    { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
    { string: navigator.userAgent, subString: "Opera", identity: "Opera" },
  ];

  public init() {
    this.browser = this.searchString(this.dataBrowser) || "Other";
    this.version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      "Unknown";
    // detect IE 11
    if (
      this.browser == "Explorer" &&
      this.version == "7" &&
      navigator.userAgent.match(/Trident/i)
    ) {
      this.version = this.searchVersionIE();
    }
  }

  searchString(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      this.versionSearchString = data[i].subString;

      if (dataString.indexOf(data[i].subString) != -1) {
        return data[i].identity;
      }
    }
  }

  searchVersion(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return undefined;
    return parseFloat(
      dataString.substring(index + this.versionSearchString.length + 1)
    );
  }

  searchVersionIE() {
    var ua = navigator.userAgent.toString().toLowerCase(),
      match = /(trident)(?:.*rv:([\w.]+))?/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) || ["", null, -1],
      ver = "unknown";

    if (match !== null && match.length === 3 && match[2]) {
      ver = (match[2] as string).split(".")[0]; // version
    }

    return ver;
  }
}
