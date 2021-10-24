import { BaseEvents } from "./modules/uv-shared-module/BaseEvents";
import { IExtension } from "./modules/uv-shared-module/IExtension";
import { IUVComponent } from "./IUVComponent";
import { IUVData } from "./IUVData";
import { IUVDataProvider } from "./IUVDataProvider";
import { PubSub } from "./PubSub";
import {
  RenderingFormat,
  MediaType,
  ExternalResourceType,
} from "@iiif/vocabulary/dist-commonjs/";
import { Helper, loadManifest, IManifoldOptions } from "@iiif/manifold";
import { Annotation, AnnotationBody, Canvas } from "manifesto.js";
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";
import { URLDataProvider } from "./URLDataProvider";
import "./uv.css";

interface IExtensionRegistry {
  [key: string]: string;
}

enum Extension {
  AV = "uv-av-extension",
  ALEPH = "uv-aleph-extension",
  DEFAULT = "uv-default-extension",
  EBOOK = "uv-ebook-extension",
  MEDIAELEMENT = "uv-mediaelement-extension",
  MODELVIEWER = "uv-model-viewer-extension",
  OSD = "uv-openseadragon-extension",
  PDF = "uv-pdf-extension",
  SLIDEATLAS = "uv-slideatlas-extension",
}

export class Viewer extends BaseComponent implements IUVComponent {
  private _extensionRegistry: IExtensionRegistry;
  private _pubsub: PubSub;
  public extension: IExtension | null;
  public isFullScreen: boolean = false;
  public dataProvider: IUVDataProvider;

  constructor(options: IBaseComponentOptions) {
    super(options);

    this.dataProvider = new URLDataProvider(
      !!options.data.readOnlyDataProvider
    );
    this._pubsub = new PubSub();

    this._init();
    this._resize();
  }

  protected _init(): boolean {
    super._init();

    this._extensionRegistry = {};
    this._extensionRegistry[ExternalResourceType.CANVAS] = Extension.OSD;
    this._extensionRegistry[ExternalResourceType.DOCUMENT] = Extension.PDF;
    this._extensionRegistry[ExternalResourceType.IMAGE] = Extension.OSD;
    this._extensionRegistry[ExternalResourceType.MOVING_IMAGE] = Extension.MEDIAELEMENT;
    this._extensionRegistry[ExternalResourceType.PHYSICAL_OBJECT] = Extension.MODELVIEWER;
    this._extensionRegistry[ExternalResourceType.SOUND] = Extension.MEDIAELEMENT;
    this._extensionRegistry[MediaType.AUDIO_MP4] = Extension.AV;
    this._extensionRegistry[MediaType.DICOM] = Extension.ALEPH;
    this._extensionRegistry[MediaType.DRACO] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.EPUB] = Extension.EBOOK;
    this._extensionRegistry[MediaType.GIRDER] = Extension.SLIDEATLAS;
    this._extensionRegistry[MediaType.GLB] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.GLTF] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.JPG] = Extension.OSD;
    this._extensionRegistry[MediaType.MP3] = Extension.AV;
    this._extensionRegistry[MediaType.MPEG_DASH] = Extension.AV;
    this._extensionRegistry[MediaType.OPF] = Extension.EBOOK;
    this._extensionRegistry[MediaType.PDF] = Extension.PDF;
    this._extensionRegistry[MediaType.USDZ] = Extension.MODELVIEWER;
    this._extensionRegistry[MediaType.VIDEO_MP4] = Extension.AV;
    this._extensionRegistry[MediaType.WEBM] = Extension.AV;
    this._extensionRegistry[RenderingFormat.PDF] = Extension.PDF;

    this.set(this.options.data);

    return true;
  }

  private async _getExtensionByName(name: string): Promise<any> {
    // previously: /* webpackChunkName: "uv-av-extension" */ /* webpackMode: "lazy" */ "./extensions/uv-av-extension/Extension"
    const m = (await import(
      /* webpackMode: "lazy" */ `./extensions/${name}/Extension`
    )) as any;
    const extension = new m.default();
    extension.name = name;
    return extension;
  }

  private _getExtensionByFormat(format: string): any {
    if (!this._extensionRegistry[format]) {
      return this._getExtensionByName(Extension.DEFAULT);
    }

    return this._getExtensionByName(this._extensionRegistry[format]);
  }

  public data(): IUVData {
    return {
      assetsDir: "/uv-assets",
      canvasIndex: 0,
      embedded: false,
      isReload: false,
      limitLocales: false,
      manifestUri: "",
      locales: [
        {
          name: "en-GB",
        },
      ],
      target: "",
    } as IUVData;
  }

  public set(data: IUVData): void {
    // if this is the first set
    if (!this.extension) {
      if (!data.manifestUri) {
        console.warn(`manifestUri is required.`);
        return;
      }

      // remove '/' from assetsDir
      if (data.assetsDir && data.assetsDir.endsWith("/")) {
        data.assetsDir = data.assetsDir.substring(0, data.assetsDir.length - 1);
      }

      this._reload(data);
    } else {
      // changing any of these data properties forces the UV to reload.
      const newData: IUVData = Object.assign({}, this.extension.data, data);
      if (
        newData.isReload ||
        newData.manifestUri !== this.extension.data.manifestUri ||
        newData.manifestIndex !== this.extension.data.manifestIndex ||
        newData.collectionIndex !== this.extension.data.collectionIndex
      ) {
        this.extension.data = newData;
        this._reload(this.extension.data);
      } else {
        // no need to reload, just update.
        this.extension.data = newData;
        this.extension.render();
      }
    }
  }

  public get(key: string): any {
    if (this.extension) {
      return this.extension.data[key];
    }
  }

  public publish(event: string, args?: any): void {
    this._pubsub.publish(event, args);
  }

  public subscribe(event: string, cb: any): void {
    this._pubsub.subscribe(event, cb);
  }

  private async _reload(data: IUVData): Promise<void> {
    
    this.el.parentElement!.parentElement!.classList.remove("loaded");
    
    this._pubsub.dispose(); // remove any existing event listeners

    data.target = ""; // clear target

    this.subscribe(BaseEvents.RELOAD, (data?: IUVData) => {
      this.fire(BaseEvents.RELOAD, data);
    });

    const $elem: JQuery = $(this.options.target);

    // empty the containing element
    $elem.empty();

    const that = this;

    const helper: Helper = await loadManifest({
      manifestUri: data.manifestUri,
      collectionIndex: data.collectionIndex, // this has to be undefined by default otherwise it's assumed that the first manifest is within a collection
      manifestIndex: data.manifestIndex || 0,
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

    let canvas: Canvas | undefined;

    canvas = helper.getCurrentCanvas();

    if (!canvas) {
      that._error(`Canvas ${data.canvasIndex} not found.`);
      return;
    }

    let extension: IExtension | undefined;

    const content: Annotation[] = canvas.getContent();

    if (content.length) {
      const annotation: Annotation = content[0];
      const body: AnnotationBody[] = annotation.getBody();

      if (body && body.length) {
        const format: MediaType | null = body[0].getFormat();

        if (format) {
          extension = await that._getExtensionByFormat(format);

          if (!extension) {
            // try type
            const type: ExternalResourceType | null = body[0].getType();

            if (type) {
              extension = await that._getExtensionByFormat(type);
            }
          }
        } else {
          const type: ExternalResourceType | null = body[0].getType();

          if (type) {
            extension = await that._getExtensionByFormat(type);
          }
        }
      }
    } else {
      const canvasType: ExternalResourceType | null = canvas.getType();

      if (canvasType) {
        // try using canvasType
        extension = await that._getExtensionByFormat(canvasType);
      }

      // if there isn't an extension for the canvasType, try the format
      if (!extension) {
        const format: any = canvas.getProperty("format");
        extension = await that._getExtensionByFormat(format);
      }
    }

    // if using uv-av-extension and there is no structure, fall back to uv-mediaelement-extension
    const hasRanges: boolean = helper.getRanges().length > 0;

    if (extension!.name === Extension.AV && !hasRanges) {
      extension = await that._getExtensionByName(Extension.MEDIAELEMENT);
    }

    // if there still isn't a matching extension, use the default extension.
    if (!extension) {
      extension = await that._getExtensionByFormat(Extension.DEFAULT);
    }

    that._configure(data, extension, (config: any) => {
      data.config = config;
      that.el.parentElement!.parentElement!.classList.add("loaded");
      that._createExtension(extension, data, helper);
    });
  }

  private _error(message: string): void {
    this.fire(BaseEvents.ERROR, message);
  }

  private _configure(
    data: IUVData,
    extension: any,
    cb: (config: any) => void
  ): void {
    this._getConfigExtension(data, extension, (configExtension: any) => {
      if (data.locales) {
        const configPath: string =
          data.assetsDir +
          "/config/" +
          extension.name +
          "." +
          data.locales[0].name +
          ".config.json";

        $.getJSON(configPath, (config) => {
          this._extendConfig(data, extension, config, configExtension, cb);
        });
      }
    });
  }

  private _extendConfig(
    data: IUVData,
    extension: any,
    config: any,
    configExtension: any,
    cb: (config: any) => void
  ): void {
    config.name = extension.name;

    // if configUri has been set, extend the existing config object.
    if (configExtension) {
      // save a reference to the config extension uri.
      config.uri = data.configUri;
      $.extend(true, config, configExtension);
      //$.extend(true, config, configExtension, data.config);
    }

    cb(config);
  }

  private _getConfigExtension(
    data: IUVData,
    extension: any,
    cb: (configExtension: any) => void
  ): void {
    if (!data.locales) {
      return;
    }

    const sessionConfig: string | null = sessionStorage.getItem(
      extension.name + "." + data.locales[0].name
    );
    const configUri: string | undefined = data.configUri;

    if (sessionConfig) {
      // if config is stored in sessionstorage
      cb(JSON.parse(sessionConfig));
    } else if (configUri) {
      // if data.configUri has been set
      $.getJSON(configUri, (configExtension: any) => {
        cb(configExtension);
      });
    } else {
      cb(null);
    }
  }

  private _createExtension(
    extension: any,
    data: IUVData,
    helper: Helper
  ): void {
    this.extension = extension;
    if (this.extension) {
      this.extension.component = this;
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
    if (this.extension) {
      this.extension.resize();
    }
  }
}
