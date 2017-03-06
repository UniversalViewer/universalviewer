import {BaseEvents} from "./modules/uv-shared-module/BaseEvents";
import {Extension as MediaElementExtension} from "./extensions/uv-mediaelement-extension/Extension";
import {Extension as OpenSeadragonExtension} from "./extensions/uv-seadragon-extension/Extension";
import {Extension as PDFExtension} from "./extensions/uv-pdf-extension/Extension";
import {Extension as VirtexExtension} from "./extensions/uv-virtex-extension/Extension";
import {IUVComponent} from "./IUVComponent";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";
import {IExtension} from "./modules/uv-shared-module/IExtension";

export default class UVComponent extends _Components.BaseComponent implements IUVComponent {

    public extension: IExtension;
    private _extensions: IExtension[];
    public isFullScreen: boolean = false;
    public socket: any;
    public URLDataProvider: IUVDataProvider;

    constructor(options: _Components.IBaseComponentOptions) {
        super(options);

        this._init();
        this._resize();
    }

    protected _init(): boolean {
        const success: boolean = super._init();

        if (!success) {
            console.error("UV failed to initialise");
        }
        
        $.subscribe(BaseEvents.RELOAD, (e: any, data?: IUVData) => {
            this.fire(BaseEvents.RELOAD, data);
        });

        this._extensions = <IExtension[]>{};

        this._extensions[manifesto.ElementType.canvas().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };

        this._extensions[manifesto.ElementType.movingimage().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.ElementType.physicalobject().toString()] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions[manifesto.ElementType.sound().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: PDFExtension,
            name: 'uv-pdf-extension'
        };

        this.set(this.options.data);

        return success;
    }
    
    public data(): IUVData {
        return <IUVData>{

        };
    }

    public set(data: IUVData): void {
        
        if (!data.iiifResourceUri) return;

        // empty app div
        $('#app').empty();

        // add loading class
        $('#app').addClass('loading');

        // remove any existing css
        $('link[type*="text/css"]').remove(); // todo: replace any inline styles with id #uvcomponent

        jQuery.support.cors = true;

        var that = this;

        Manifold.loadManifest(<Manifold.IManifoldOptions>{
            iiifResourceUri: data.iiifResourceUri,
            collectionIndex: data.collectionIndex,
            manifestIndex: data.manifestIndex,
            sequenceIndex: data.sequenceIndex,
            canvasIndex: data.canvasIndex,
            locale: data.locales[0].name
        }).then((helper: Manifold.IHelper) => {
            
            let trackingLabel: string = helper.getTrackingLabel();
            trackingLabel += ', URI: ' + data.embedDomain;
            window.trackingLabel = trackingLabel;

            const sequence: Manifesto.ISequence = helper.getSequenceByIndex(data.sequenceIndex);

            if (!sequence) {
                that._notFound();
                return;
            }

            const canvas: Manifesto.ICanvas = helper.getCanvasByIndex(data.canvasIndex);

            if (!canvas) {
                that._notFound();
                return;
            }

            const canvasType: Manifesto.ElementType = canvas.getType();

            // try using canvasType
            let extension: IExtension | null = that._extensions[canvasType.toString()];

            // if there isn't an extension for the canvasType, try the format
            if (!extension) {
                const format: any = canvas.getProperty('format');
                extension = that._extensions[format];
            }

            // if there still isn't a matching extension, show an error.
            if (!extension) {
                alert("No matching UV extension found.");
                return;
            }

            that._configure(data, extension, (config: any) => {
                data.config = config;
                that._injectCss(data, extension, () => {
                    that._createExtension(extension, data, helper);
                });
            });

        }).catch(function() {
            that._notFound();
        });
    }

    private _isCORSEnabled(): boolean {
        return Modernizr.cors;
    }

    private _notFound(): void {
        try{
            this.fire(BaseEvents.NOT_FOUND);
            return;
        } catch (e) {}
    }

    private _configure(data: IUVData, extension: any, cb: (config: any) => void): void {

        this._getConfigExtension(data, extension, (configExtension: any) => {

            // todo: use a compiler flag when available
            const configUri: string = 'lib/' + extension.name + '.' + data.locales[0].name + '.config.json';

            $.getJSON(configUri, (config) => {
                this._extendConfig(data, extension, config, configExtension, cb);
            });
        });
    }

    private _extendConfig(data: IUVData, extension: any, config: any, configExtension: any, cb: (config: any) => void): void {
        config.name = extension.name;

        // if data-config has been set, extend the existing config object.
        if (configExtension) {
            // save a reference to the config extension uri.
            config.uri = data.configUri;
            $.extend(true, config, configExtension);
        }

        cb(config);
    }

    private _getConfigExtension(data: IUVData, extension: any, cb: (configExtension: any) => void): void {

        const sessionConfig: string | null = sessionStorage.getItem(extension.name + '.' + data.locales[0].name);
        const configUri: string | null = data.configUri;

        if (sessionConfig) { // if config is stored in sessionstorage
            cb(JSON.parse(sessionConfig));
        } else if (configUri) { // if data-config has been set

            if (this._isCORSEnabled()) {
                $.getJSON(configUri, (configExtension) => {
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
        const cssPath: string = 'themes/' + data.config.options.theme + '/css/' + extension.name + '/theme.css';

        yepnope.injectCss(cssPath, function() {
            cb();
        });
    }

    private _createExtension(extension: any, data: IUVData, helper: Manifold.IHelper): void {
        this.extension = new extension.type();
        this.extension.component = this;
        this.extension.data = data;
        this.extension.helper = helper;
        this.extension.name = extension.name;
        this.extension.create();
    }
    
    protected _resize(): void {
        
    }
}