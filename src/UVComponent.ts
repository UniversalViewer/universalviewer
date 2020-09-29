import {BaseEvents} from "./modules/uv-shared-module/BaseEvents";
import {Extension as AVExtension} from "./extensions/uv-av-extension/Extension";
import {Extension as DefaultExtension} from "./extensions/uv-default-extension/Extension";
import {Extension as EbookExtension} from "./extensions/uv-ebook-extension/Extension";
import {Extension as MediaElementExtension} from "./extensions/uv-mediaelement-extension/Extension";
import {Extension as OpenSeadragonExtension} from "./extensions/uv-seadragon-extension/Extension";
import {Extension as PDFExtension} from "./extensions/uv-pdf-extension/Extension";
import {Extension as VirtexExtension} from "./extensions/uv-virtex-extension/Extension";
import {IExtension} from "./modules/uv-shared-module/IExtension";
import {IUVComponent} from "./IUVComponent";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";
import {UVUtils} from "./Utils";
import {PubSub} from "./PubSub";
import "./Polyfills";

export default class UVComponent extends _Components.BaseComponent implements IUVComponent {

    private _extensions: IExtension[];
    private _pubsub: PubSub;
    public extension: IExtension | null;
    public isFullScreen: boolean = false;
    public URLDataProvider: IUVDataProvider;

    constructor(options: _Components.IBaseComponentOptions) {
        super(options);

        this._pubsub = new PubSub();

        this._init();
        this._resize();
    }

    protected _init(): boolean {

        const success: boolean = super._init();

        if (!success) {
            console.error("UV failed to initialise");
        }

        this._extensions = <IExtension[]>{};

        this._extensions[manifesto.ResourceType.canvas().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };

        this._extensions[manifesto.ResourceType.image().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };

        this._extensions[manifesto.ResourceType.movingimage().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.ResourceType.physicalobject().toString()] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions["Model"] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions[manifesto.ResourceType.sound().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: PDFExtension,
            name: 'uv-pdf-extension'
        };

        // presentation 3

        this._extensions[manifesto.MediaType.jpg().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };
        
        this._extensions[manifesto.MediaType.pdf().toString()] = {
            type: PDFExtension,
            name: 'uv-pdf-extension'
        };

        this._extensions[manifesto.MediaType.mp4().toString()] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions[manifesto.MediaType.webm().toString()] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions[manifesto.MediaType.threejs().toString()] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions['model/gltf+json'] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions['model/gltf+json'] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions['model/gltf-binary'] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions['av'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['video'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['audio/mp3'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['audio/mp4'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['application/vnd.apple.mpegurl'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['application/dash+xml'] = {
            type: AVExtension,
            name: 'uv-av-extension'
        };

        this._extensions['application/epub+zip'] = {
            type: EbookExtension,
            name: 'uv-ebook-extension'
        };

        this._extensions['application/oebps-package+xml'] = {
            type: EbookExtension,
            name: 'uv-ebook-extension'
        };

        this._extensions['default'] = {
            type: DefaultExtension,
            name: 'uv-default-extension'
        };

        this.set(this.options.data);

        return success;
    }
    
    public data(): IUVData {
        return <IUVData>{
            annotations: undefined,
            root: "./uv",
            canvasIndex: 0,
            collectionIndex: undefined,
            config: undefined,
            configUri: undefined,
            embedded: false,
            iiifResourceUri: '',
            isLightbox: false,
            isReload: false,
            limitLocales: false,
            locales: [
                {
                    name: 'en-GB'
                }
            ],
            manifestIndex: 0,
            rangeId: undefined,
            rotation: 0,
            sequenceIndex: 0,
            xywh: ''
        };
    }

    public set(data: IUVData): void {

        // if this is the first set
        if (!this.extension) {

            if (!data.iiifResourceUri) {
                this._error(`iiifResourceUri is required.`);
                return;
            }

            // remove '/' from root
            if (data.root && data.root.endsWith('/')) {
                data.root = data.root.substring(0, data.root.length - 1);
            }

            this._reload(data);

        } else {

            // changing any of these data properties forces the UV to reload.
            if (UVUtils.propertiesChanged(data, this.extension.data, ['collectionIndex', 'manifestIndex', 'config', 'configUri', 'domain', 'embedDomain', 'embedScriptUri', 'iiifResourceUri', 'isHomeDomain', 'isLightbox', 'isOnlyInstance', 'isReload', 'locales', 'root'])) {
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

    private _reload(data: IUVData): void {
        
        this._pubsub.dispose(); // remove any existing event listeners

        this.subscribe(BaseEvents.RELOAD, (data?: IUVData) => {
            this.fire(BaseEvents.RELOAD, data);
        });

        const $elem: JQuery = $(this.options.target);

        // empty the containing element
        $elem.empty();

        // add loading class
        $elem.addClass('loading');

        jQuery.support.cors = true;

        const that = this;

        Manifold.loadManifest(<Manifold.IManifoldOptions>{
            iiifResourceUri: data.iiifResourceUri,
            collectionIndex: data.collectionIndex, // this has to be undefined by default otherwise it's assumed that the first manifest is within a collection
            manifestIndex: data.manifestIndex || 0,
            sequenceIndex: data.sequenceIndex || 0,
            canvasIndex: data.canvasIndex || 0,
            rangeId: data.rangeId,
            locale: (data.locales) ? data.locales[0].name : undefined
        }).then((helper: Manifold.IHelper) => {
            
            let trackingLabel: string = helper.getTrackingLabel();
            trackingLabel += ', URI: ' + (window.location !== window.parent.location) ? document.referrer : document.location;
            window.trackingLabel = trackingLabel;

            let sequence: Manifesto.ISequence | undefined;

            if (data.sequenceIndex !== undefined) {
                sequence = helper.getSequenceByIndex(data.sequenceIndex);

                if (!sequence) {
                    that._error(`Sequence ${data.sequenceIndex} not found.`);
                    return;
                }
            }

            let canvas: Manifesto.ICanvas | undefined;

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
                const content: Manifesto.IAnnotation[] = canvas.getContent();
                
                if (content.length) {
                    const annotation: Manifesto.IAnnotation = content[0];
                    const body: Manifesto.IAnnotationBody[] = annotation.getBody();

                    if (body && body.length) {
                        const format: Manifesto.MediaType | null = body[0].getFormat();

                        if (format) {
                            extension = that._extensions[format.toString()];

                            if (!extension) {
                                // try type
                                const type: Manifesto.ResourceType | null = body[0].getType();
                            
                                if (type) {
                                    extension = that._extensions[type.toString()];
                                }
                            }
                        } else {
                            const type: Manifesto.ResourceType | null = body[0].getType();

                            if (type) {
                                extension = that._extensions[type.toString()];
                            }
                        }
                    }

                } else {
                    const canvasType: Manifesto.ResourceType | null = canvas.getType();

                    if (canvasType) {
                        // try using canvasType
                        extension = that._extensions[canvasType.toString()];
                    }

                    // if there isn't an extension for the canvasType, try the format
                    if (!extension) {
                        const format: any = canvas.getProperty('format');
                        extension = that._extensions[format];
                    }
                }
            //}

            // if there still isn't a matching extension, use the default extension.
            if (!extension) {
                extension = that._extensions['default'];
            }

            that._configure(data, extension, (config: any) => {
                data.config = config;
                that._injectCss(data, extension, () => {
                    that._createExtension(extension, data, helper);
                });
            });

        }).catch(function() {
            that._error('Failed to load manifest.');
        });
    }

    private _isCORSEnabled(): boolean {
        return Modernizr.cors;
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

            if (this._isCORSEnabled()) {
                $.getJSON(configUri, (configExtension: any) => {
                    cb(configExtension);
                });
            } else {
                // use jsonp
                const settings: JQueryAjaxSettings = <JQueryAjaxSettings>{
                    url: configUri,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    jsonpCallback: 'configExtensionCallback'
                };

                $.ajax(settings);

                window.configExtensionCallback = (configExtension: any) => {
                    cb(configExtension);
                };
            }
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

    private _createExtension(extension: any, data: IUVData, helper: Manifold.IHelper): void {
        this.extension = new extension.type();
        if (this.extension) {
            this.extension.component = this;
            this.extension.data = data;
            this.extension.helper = helper;
            this.extension.name = extension.name;
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
