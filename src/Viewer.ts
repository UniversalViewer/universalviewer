import {BaseEvents} from "./modules/uv-shared-module/BaseEvents";
import {IExtension} from "./modules/uv-shared-module/IExtension";
import {IUVComponent} from "./IUVComponent";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";
import {PubSub} from "./PubSub";
import { propertiesChanged } from "./Utils";
import { RenderingFormat, MediaType, ExternalResourceType } from "@iiif/vocabulary";
import { Helper, loadManifest, IManifoldOptions } from "@iiif/manifold";
import { Annotation, AnnotationBody, Canvas, Sequence } from "manifesto.js";
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";
import { URLDataProvider } from "./URLDataProvider";
import "./lib/";

interface IExtensionLoaderCollection {
    [key: string]: () => any;
}

interface IExtensionRegistry {
    [key: string]: { load: () => any };
}

enum Extension {
    AV = "uv-av-extension",
    DEFAULT = "uv-default-extension",
    MEDIAELEMENT = "uv-mediaelement-extension",
    OSD = "uv-openseadragon-extension",
    PDF = "uv-pdf-extension",
    VIRTEX = "uv-virtex-extension"
}

export class Viewer extends BaseComponent implements IUVComponent {

    private _extensions: IExtensionLoaderCollection;
    private _extensionRegistry: IExtensionRegistry;
    private _pubsub: PubSub;
    public extension: IExtension | null;
    public isFullScreen: boolean = false;
    public dataProvider: IUVDataProvider;

    constructor(options: IBaseComponentOptions) {
        super(options);

        this.dataProvider = new URLDataProvider();
        this._pubsub = new PubSub();

        this._init();
        this._resize();
    }

    protected _init(): boolean {

        super._init();

        this._extensions = {
            // [Extension.AV]: async () => {
            //     const m = await import("./extensions/uv-av-extension/Extension") as any;
            //     const extension = new m.default();
            //     extension.name = Extension.AV;
            //     return extension;
            // }
            // [Extension.MEDIAELEMENT]: async () => {
            //     const m = await import("./extensions/uv-mediaelement-extension/Extension") as any;
            //     const extension = new m.default();
            //     extension.name = Extension.MEDIAELEMENT;
            //     return extension;
            // },
            [Extension.OSD]: async () => {
                const m = await import(/* webpackChunkName: "uv-openseadragon-extension" *//* webpackMode: "lazy" */"./extensions/uv-openseadragon-extension/Extension") as any;
                const extension = new m.default();
                extension.name = Extension.OSD;
                return extension;
            },
            [Extension.PDF]: async () => {
                const m = await import(/* webpackChunkName: "uv-pdf-extension" *//* webpackMode: "lazy" */"./extensions/uv-pdf-extension/Extension") as any;
                const extension = new m.default();
                extension.name = Extension.PDF;
                return extension;
            }
            // [Extension.VIRTEX]: async () => {
            //     const m = await import("./extensions/uv-virtex-extension/Extension") as any;
            //     const extension = new m.default();
            //     extension.name = Extension.VIRTEX;
            //     return extension;
            // }
        };

        this._extensionRegistry = {};

        this._extensionRegistry[ExternalResourceType.CANVAS] = {
            load: this._extensions[Extension.OSD]
        };

        this._extensionRegistry[ExternalResourceType.IMAGE] = {
            load: this._extensions[Extension.OSD]
        };

        this._extensionRegistry[ExternalResourceType.MOVING_IMAGE] = {
            load: this._extensions[Extension.MEDIAELEMENT]
        };

        this._extensionRegistry[ExternalResourceType.PHYSICAL_OBJECT] = {
            load: this._extensions[Extension.VIRTEX]
        };

        this._extensionRegistry[ExternalResourceType.SOUND] = {
            load: this._extensions[Extension.MEDIAELEMENT]
        };

        this._extensionRegistry[RenderingFormat.PDF] = {
            load: this._extensions[Extension.PDF]
        };

        // presentation 3

        this._extensionRegistry[MediaType.JPG] = {
            load: this._extensions[Extension.OSD]
        };

        this._extensionRegistry[MediaType.PDF] = {
            load: this._extensions[Extension.PDF]
        };

        this._extensionRegistry[MediaType.AUDIO_MP4] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry[MediaType.VIDEO_MP4] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry[MediaType.WEBM] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry[MediaType.THREEJS] = {
            load: this._extensions[Extension.VIRTEX]
        };

        this._extensionRegistry[MediaType.MP3] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry[MediaType.M3U8] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry[MediaType.MPEG_DASH] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry["av"] = {
            load: this._extensions[Extension.AV]
        };

        this._extensionRegistry["default"] = {
            load: this._extensions[Extension.DEFAULT]
        };

        this.set(this.options.data);

        return true;
    }

    public data(): IUVData {
        return {
            annotations: undefined,
            root: "./uv",
            canvasIndex: 0,
            collectionIndex: undefined,
            config: undefined,
            configUri: undefined,
            embedded: false,
            manifestUri: "",
            isLightbox: false,
            isReload: false,
            limitLocales: false,
            locales: [
                {
                    name: "en-GB"
                }
            ],
            manifestIndex: 0,
            rangeId: undefined,
            rotation: 0,
            sequenceIndex: 0,
            xywh: ""
        } as IUVData;
    }

    public set(data: IUVData): void {

        // if this is the first set
        if (!this.extension) {

            if (!data.manifestUri) {
                this._error(`manifestUri is required.`);
                return;
            }

            // remove '/' from root
            if (data.root && data.root.endsWith('/')) {
                data.root = data.root.substring(0, data.root.length - 1);
            }

            this._reload(data);

        } else {

            // changing any of these data properties forces the UV to reload.
            if (propertiesChanged(data, this.extension.data, ['collectionIndex', 'manifestIndex', 'config', 'configUri', 'domain', 'embedDomain', 'embedScriptUri', 'manifestUri', 'isHomeDomain', 'isLightbox', 'isOnlyInstance', 'isReload', 'locales', 'root'])) {
                this.extension.data = Object.assign({}, this.extension.data, data);
                this._reload(this.extension.data);
            } else {
                // no need to reload, just update.
                this.extension.data = Object.assign({}, this.extension.data, data);
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

        this._pubsub.dispose(); // remove any existing event listeners

        this.subscribe(BaseEvents.RELOAD, (data?: IUVData) => {
            this.fire(BaseEvents.RELOAD, data);
        });

        const $elem: JQuery = $(this.options.target);

        // empty the containing element
        $elem.empty();

        // add loading class
        $elem.addClass('loading');

        const that = this;

        const helper: Helper = await loadManifest({
            manifestUri: data.manifestUri,
            collectionIndex: data.collectionIndex, // this has to be undefined by default otherwise it's assumed that the first manifest is within a collection
            manifestIndex: data.manifestIndex || 0,
            sequenceIndex: data.sequenceIndex || 0,
            canvasIndex: data.canvasIndex || 0,
            rangeId: data.rangeId,
            locale: (data.locales) ? data.locales[0].name : undefined
        } as IManifoldOptions);

        let trackingLabel: string | null = helper.getTrackingLabel();

        if (trackingLabel) {
            trackingLabel += ', URI: ' + (window.location !== window.parent.location) ? document.referrer : document.location;
            window.trackingLabel = trackingLabel;
        }

        let sequence: Sequence | undefined;

        if (data.sequenceIndex !== undefined) {
            sequence = helper.getSequenceByIndex(data.sequenceIndex);

            if (!sequence) {
                that._error(`Sequence ${data.sequenceIndex} not found.`);
                return;
            }
        }

        let canvas: Canvas | undefined;

        if (data.canvasIndex !== undefined) {
            canvas = helper.getCanvasByIndex(data.canvasIndex);
        }

        if (!canvas) {
            that._error(`Canvas ${data.canvasIndex} not found.`);
            return;
        }

        let extension: IExtension | undefined = undefined;

        // if the canvas has a duration, use the uv-av-extension
        // const duration: number | null = canvas.getDuration();

        // if (typeof(duration) !== 'undefined') {
        //     extension = that._extensions["av"];
        // } else {
        // canvasType will always be "canvas" in IIIF presentation 3.0
        // to determine the correct extension to use, we need to inspect canvas.content.items[0].format
        // which is an iana media type: http://www.iana.org/assignments/media-types/media-types.xhtml
        const content: Annotation[] = canvas.getContent();

        if (content.length) {
            const annotation: Annotation = content[0];
            const body: AnnotationBody[] = annotation.getBody();

            if (body && body.length) {
                const format: MediaType | null = body[0].getFormat();

                if (format) {
                    extension = await that._extensionRegistry[format].load();

                    if (!extension) {
                        // try type
                        const type: ExternalResourceType | null = body[0].getType();

                        if (type) {
                            extension = await that._extensionRegistry[type].load();
                        }
                    }
                } else {
                    const type: ExternalResourceType | null = body[0].getType();

                    if (type) {
                        extension = await that._extensionRegistry[type].load();
                    }
                }
            }

        } else {
            const canvasType: ExternalResourceType | null = canvas.getType();

            if (canvasType) {
                // try using canvasType
                extension = await that._extensionRegistry[canvasType].load();
            }

            // if there isn't an extension for the canvasType, try the format
            if (!extension) {
                const format: any = canvas.getProperty('format');
                extension = await that._extensionRegistry[format].load();
            }
        }

        // if there still isn't a matching extension, use the default extension.
        if (!extension) {
            extension = await that._extensionRegistry['default'].load();
        }

        that._configure(data, extension, (config: any) => {
            data.config = config;
            that._injectCss(data, extension, () => {
                that._createExtension(extension, data, helper);
            });
        });
    }

    private _error(message: string): void {
        this.fire(BaseEvents.ERROR, message);
    }

    private _configure(data: IUVData, extension: any, cb: (config: any) => void): void {

        this._getConfigExtension(data, extension, (configExtension: any) => {

            if (data.locales) {
                const configPath: string = data.root + '/lib/' + extension.name + '.' + data.locales[0].name + '.config.json';

                $.getJSON(configPath, (config) => {
                    this._extendConfig(data, extension, config, configExtension, cb);
                });
            }
        });
    }

    private _extendConfig(data: IUVData, extension: any, config: any, configExtension: any, cb: (config: any) => void): void {
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

    private _getConfigExtension(data: IUVData, extension: any, cb: (configExtension: any) => void): void {

        if (!data.locales) {
            return;
        }

        const sessionConfig: string | null = sessionStorage.getItem(extension.name + '.' + data.locales[0].name);
        const configUri: string | undefined = data.configUri;

        if (sessionConfig) { // if config is stored in sessionstorage
            cb(JSON.parse(sessionConfig));
        } else if (configUri) { // if data.configUri has been set
            $.getJSON(configUri, (configExtension: any) => {
                cb(configExtension);
            });
        } else {
            cb(null);
        }
    }

    private _injectCss(data: IUVData, extension: any, cb: () => void): void {

        if (!data.locales) {
            return;
        }

        const cssPath: string = data.root + '/themes/' + data.config.options.theme + '/css/' + extension.name + '/theme.css';
        const locale: string = data.locales[0].name;
        const themeName: string = extension.name.toLowerCase() + '-theme-' + locale.toLowerCase();
        const $existingCSS: JQuery = $('#' + themeName.toLowerCase());

        if (!$existingCSS.length) {
            $('head').append('<link rel="stylesheet" id="' + themeName + '" href="' + cssPath.toLowerCase() + '" />');
            cb();
        } else {
            cb();
        }
    }

    private _createExtension(extension: any, data: IUVData, helper: manifold.Helper): void {
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
