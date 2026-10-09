const $ = require("jquery");
require("jsviews")($);
import jQueryPlugins from "./JQueryPlugins";
jQueryPlugins($);
import {
  ExtensionLoader,
  IExtension,
} from "./modules/uv-shared-module/IExtension";
import { IIIFExtensionHost } from "./IIIFExtensionHost";
import { IUVData } from "@/IUVData";
import { EventHandlerWithName, PubSub } from "./PubSub";
import {
  RenderingFormat,
  MediaType,
  ExternalResourceType,
} from "@iiif/vocabulary/dist-commonjs/";
import { Helper, loadManifest, IManifoldOptions } from "@iiif/manifold";
import { Annotation, AnnotationBody, Canvas } from "manifesto.js";
import "../../uv.css";
import "./themes/theme.less";
import { IContentHandler } from "@/IContentHandler";
import { IUVOptions } from "@/UniversalViewer";
import { IIIFData } from "./IIIFData";
import { defaultLocale } from "../../Utils";
import BaseContentHandler, { EventListener } from "../../BaseContentHandler";
import { Events } from "../../Events";
import { UVAdapter } from "@/UVAdapter";
import { hlsMimeTypes } from "./modules/iiif-av-component-module/helpers/hls-media-types";

interface IExtensionRegistry {
  [key: string]: ExtensionLoader;
}

// Body types that @iiif/vocabulary doesn't list, as they're read (lower
// case): "Audio", from manifests made with drafts of IIIF Presentation 3,
// where IIIF Presentation 3 calls audio "Sound".
const UnlistedResourceType = {
  AUDIO: "audio",
};

// use static paths (not based on variable) so webpack can use publicPath: "auto"
const Extension: IExtensionRegistry = {
  AV: {
    name: "uv-av-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-av-extension/Extension"
      ),
  },
  ALEPH: {
    name: "uv-aleph-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-aleph-extension/Extension"
      ),
  },
  DEFAULT: {
    name: "uv-default-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-default-extension/Extension"
      ),
  },
  EBOOK: {
    name: "uv-ebook-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-ebook-extension/Extension"
      ),
  },
  MEDIAELEMENT: {
    name: "uv-mediaelement-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-mediaelement-extension/Extension"
      ),
  },
  MODELVIEWER: {
    name: "uv-model-viewer-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-model-viewer-extension/Extension"
      ),
  },
  OSD: {
    name: "uv-openseadragon-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-openseadragon-extension/Extension"
      ),
  },
  PDF: {
    name: "uv-pdf-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-pdf-extension/Extension"
      ),
  },
  SLIDEATLAS: {
    name: "uv-openseadragon-extension",
    loader: () =>
      /* webpackMode: "lazy" */ import(
        "./extensions/uv-openseadragon-extension/Extension"
      ),
  },
};

export default class IIIFContentHandler
  extends BaseContentHandler<IIIFData>
  implements IIIFExtensionHost, IContentHandler<IIIFData>
{
  private _extensionRegistry: IExtensionRegistry;
  private _pubsub: PubSub;
  public extension: IExtension | undefined;
  public isFullScreen: boolean = false;
  public disposed = false;
  private extra = { initial: false };

  constructor(
    public options: IUVOptions,
    public adapter?: UVAdapter,
    eventListeners?: EventListener[]
  ) {
    super(options, adapter, eventListeners);
    // console.log("create IIIFContentHandler");
    this.extra.initial = true;
    this._pubsub = new PubSub();
    this._init();
    this.resize();
    this.extra.initial = false;
  }

  protected _init(): boolean {
    this._extensionRegistry = {};
    this._extensionRegistry[ExternalResourceType.CANVAS] = Extension.OSD;
    this._extensionRegistry[ExternalResourceType.DOCUMENT] = Extension.PDF;
    this._extensionRegistry[ExternalResourceType.IMAGE] = Extension.OSD;
    this._extensionRegistry[ExternalResourceType.MOVING_IMAGE] =
      Extension.MEDIAELEMENT;
    this._extensionRegistry[ExternalResourceType.PHYSICAL_OBJECT] =
      Extension.MODELVIEWER;
    this._extensionRegistry[ExternalResourceType.SOUND] =
      Extension.MEDIAELEMENT;
    this._extensionRegistry[UnlistedResourceType.AUDIO] =
      Extension.MEDIAELEMENT;
    this._extensionRegistry[ExternalResourceType.VIDEO] =
      Extension.MEDIAELEMENT;
    this._extensionRegistry[MediaType.AUDIO_MP4] = Extension.AV;
    this._extensionRegistry[MediaType.AUDIO_OGG] = Extension.AV;
    this._extensionRegistry[MediaType.DICOM] = Extension.ALEPH;
    this._extensionRegistry[MediaType.DRACO] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.EPUB] = Extension.EBOOK;
    this._extensionRegistry[MediaType.GIRDER] = Extension.SLIDEATLAS;
    this._extensionRegistry[MediaType.GLB] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.GLTF] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.JPG] = Extension.OSD;
    this._extensionRegistry[MediaType.MP3] = Extension.AV;
    this._extensionRegistry[MediaType.MPEG] = Extension.AV;
    this._extensionRegistry[MediaType.MPEG_DASH] = Extension.AV;
    this._extensionRegistry[MediaType.OPF] = Extension.EBOOK;
    this._extensionRegistry[MediaType.PDF] = Extension.PDF;
    this._extensionRegistry[MediaType.PNG] = Extension.OSD;
    this._extensionRegistry[MediaType.USDZ] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.VIDEO_MP4] = Extension.AV;
    this._extensionRegistry[MediaType.VIDEO_OGG] = Extension.AV;
    this._extensionRegistry[MediaType.WAV] = Extension.AV;
    this._extensionRegistry[MediaType.WEBM] = Extension.AV;
    // HLS, in any of its formats.
    hlsMimeTypes.forEach((format: string) => {
      this._extensionRegistry[format] = Extension.AV;
    });
    this._extensionRegistry[RenderingFormat.PDF] = Extension.PDF;

    this.on(
      Events.CREATED,
      (_obj) => {
        this.hideSpinner();
      },
      false
    );

    this.on(
      Events.RELOAD,
      (data) => {
        data.isReload = true;
        this.set(data);
      },
      false
    );

    this.extra.initial = true;
    this.set(this.options.data);
    this.extra.initial = false;

    return true;
  }

  private async _getExtensionByType(
    type: ExtensionLoader,
    format?: string
  ): Promise<any> {
    const m = await type.loader();
    const extension: IExtension = new m.default();
    extension.format = format;
    extension.type = type;
    return extension;
  }

  // The extension registered for a format or type, if any.
  private _registeredExtension(
    formatOrType: string | null | undefined
  ): ExtensionLoader | undefined {
    return formatOrType
      ? this._extensionRegistry[formatOrType.toString()]
      : undefined;
  }

  public set(data: IUVData<any>, initial?: boolean): void {
    if (initial) {
      this.extra.initial = true;
    }
    // if this is the first set
    if (!this.extension) {
      if (!data.iiifManifestId) {
        console.warn(`iiifManifestId is required.`);
        return;
      }

      this._reload(data);
    } else {
      // changing any of these data properties forces the UV to reload.
      const newData: IUVData<any> = Object.assign(
        {},
        this.extension.data,
        data
      );
      if (
        newData.isReload ||
        newData.iiifManifestId !== this.extension.data.iiifManifestId ||
        newData.manifestIndex !== this.extension.data.manifestIndex ||
        newData.collectionIndex !== this.extension.data.collectionIndex
      ) {
        this.extension.data = newData;
        this.showSpinner();
        this._reload(this.extension.data);
      } else {
        // no need to reload, just update.
        this.extension.data = newData;
        this.extension.render();
      }
    }

    this.extra.initial = false;
  }

  // public get<T>(key: string): T | undefined {
  //   if (this.extension) {
  //     return this.extension.data[key];
  //   }
  //   return undefined;
  // }

  public publish(event: string, args?: any, extra?: any): void {
    this._pubsub.publish(event, args, { ...this.extra, ...extra });
  }

  public subscribe(event: string, handler: any) {
    this._pubsub.subscribe(event, handler);

    return () => {
      this._pubsub.unsubscribe(event, handler);
    };
  }

  public subscribeAll(handler: EventHandlerWithName) {
    this._pubsub.subscribeAll(handler);

    return () => {
      this._pubsub.unsubscribeAll();
    };
  }

  public dispose() {
    super.dispose();
    this._pubsub.dispose();
    this.extension?.dispose();
    this.disposed = true;
  }

  private async _loadAndApplyConfigToExtension(
    that: IIIFContentHandler,
    data: IUVData<any>,
    extension: any
  ): Promise<void> {
    // import the config file
    if (!data.locales) {
      data.locales = [];
      data.locales.push(defaultLocale);
    }
    const config = await extension.loadConfig(
      data.locales[0].name,
      extension?.type.name
    );

    data.config = await that.configure(config);
  }

  private async _reload(data: IUVData<any>): Promise<void> {
    this._pubsub.dispose(); // remove any existing event listeners

    data.target = ""; // clear target

    this.subscribe(Events.RELOAD, (data?: IUVData<any>) => {
      this.fire(Events.RELOAD, data);
    });

    const $elem: JQuery = $(this.options.target);

    // empty the containing element
    $elem.empty();

    const that = this;

    let helper: Helper;

    try {
      helper = await loadManifest({
        manifestUri: data.iiifManifestId,
        collectionIndex: data.collectionIndex, // this has to be undefined by default otherwise it's assumed that the first manifest is within a collection
        manifestIndex: data.manifestIndex || 0,
        canvasId: data.canvasId,
        canvasIndex: data.canvasIndex || 0,
        rangeId: data.rangeId,
        locale: data.locales ? data.locales[0].name : undefined,
      } as IManifoldOptions);

      let trackingLabel: string | null = helper.getTrackingLabel();

      if (trackingLabel) {
        trackingLabel +=
          ", URI: " + (window.location !== window.parent.location)
            ? document.referrer
            : document.location;
        window.trackingLabel = trackingLabel;
      }

      const canvas: Canvas | undefined = helper.getCurrentCanvas();

      if (!canvas) {
        that._error(`Canvas ${data.canvasIndex} not found.`);
        return;
      }

      // The extension for the canvas' content: by its first painting
      // annotation body's format, else its type. A canvas without content
      // (as in IIIF v2 IxIF manifests, whose media are offered as canvases)
      // by its own type, else its format.
      const content: Annotation[] = canvas.getContent();
      let format: string | undefined;
      let loader: ExtensionLoader | undefined;

      if (content.length) {
        const body: AnnotationBody | undefined = content[0].getBody()[0];

        if (body) {
          format = (body.getFormat() as string) || undefined;
          loader =
            that._registeredExtension(format) ||
            that._registeredExtension(body.getType());
        }
      } else {
        loader =
          that._registeredExtension(canvas.getType()) ||
          that._registeredExtension(canvas.getProperty("format"));
      }

      // The AV extension plays manifests with ranges, which it shows as a
      // table of contents, and canvases with more than one clip (painting
      // annotation), which it plays in turn or together. The MediaElement
      // extension plays the others, each a single clip.
      if (
        loader === Extension.AV &&
        !helper.getRanges().length &&
        content.length <= 1
      ) {
        loader = Extension.MEDIAELEMENT;
      }

      let extension: IExtension = await that._getExtensionByType(
        loader || Extension.DEFAULT,
        format
      );
      await this._loadAndApplyConfigToExtension(that, data, extension);

      // A host may prefer the MediaElement extension for manifests with
      // ranges too (preferMediaElementExtension), which is only known once
      // the extension is configured.
      if (
        loader === Extension.AV &&
        data.config.options.preferMediaElementExtension
      ) {
        extension = await that._getExtensionByType(
          Extension.MEDIAELEMENT,
          format
        );
        await this._loadAndApplyConfigToExtension(that, data, extension);
      }

      that._createExtension(extension, data, helper);
    } catch (e) {
      this.hideSpinner();
      alert("Unable to load manifest");
      console.error(e);
    }
  }

  private _error(message: string): void {
    this.fire(Events.ERROR, message);
  }

  private _createExtension(
    extension: any,
    data: IUVData<any>,
    helper: Helper
  ): void {
    this.extension = extension;
    if (this.extension) {
      this.extension.extensionHost = this;
      this.extension.data = data;
      this.extension.helper = helper;
      this.extension.create();
    }
  }

  public exitFullScreen(): void {
    if (this.extension) {
      this.extension.exitFullScreen();
    }
  }

  public resize(): void {
    if (this.extension && !this.disposed) {
      this.extension.resize();
    }
  }
}
