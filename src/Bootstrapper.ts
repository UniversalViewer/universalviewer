import {BaseEvents} from "./modules/uv-shared-module/BaseEvents";
import {IUVData} from "./IUVData";
import {IExtension} from "./modules/uv-shared-module/IExtension";

// The Bootstrapper is concerned with loading the manifest/collection (iiifResource)
// then determining which extension to use and instantiating it.
export class Bootstrapper {

    extension: IExtension;
    extensions: IExtension[];
    iiifResource: Manifesto.IIIIFResource;
    isFullScreen: boolean = false;
    manifest: Manifesto.IManifest;
    socket: any;
    data: IUVData;

    constructor(extensions: any) {
        this.extensions = extensions;
    }

    bootstrap(data: IUVData): void {

        this.data = data;

        if (!this.data.iiifResourceUri) return;

        // empty app div
        $('#app').empty();

        // add loading class
        $('#app').addClass('loading');

        // remove any existing css
        $('link[type*="text/css"]').remove(); // todo: replace any inline styles with id #uvcomponent

        jQuery.support.cors = true;

        Manifold.loadManifest(<Manifold.IManifoldOptions>{
            iiifResourceUri: this.data.iiifResourceUri,
            collectionIndex: this.data.collectionIndex,
            manifestIndex: this.data.manifestIndex,
            sequenceIndex: this.data.sequenceIndex,
            canvasIndex: this.data.canvasIndex,
            locale: this.data.locale
        }).then((helper: Manifold.IHelper) => {
            
            let trackingLabel: string = helper.getTrackingLabel();
            trackingLabel += ', URI: ' + this.data.embedDomain;
            window.trackingLabel = trackingLabel;

            const sequence: Manifesto.ISequence = helper.getSequenceByIndex(this.data.sequenceIndex);

            if (!sequence) {
                this.notFound();
                return;
            }

            const canvas: Manifesto.ICanvas = helper.getCanvasByIndex(this.data.canvasIndex);

            if (!canvas) {
                this.notFound();
                return;
            }

            const canvasType: Manifesto.ElementType = canvas.getType();

            // try using canvasType
            let extension: IExtension | null = this.extensions[canvasType.toString()];

            // if there isn't an extension for the canvasType, try the format
            if (!extension) {
                const format: any = canvas.getProperty('format');
                extension = this.extensions[format];
            }

            // if there still isn't a matching extension, show an error.
            if (!extension) {
                alert("No matching UV extension found.");
                return;
            }

            extension.helper = helper;

            this.configure(extension, (config: any) => {
                this.data.config = config;
                this.injectCss(extension, () => {
                    this.createExtension(extension);
                });
            });

        }).catch(function() {
            this.notFound();
        });
    }

    isCORSEnabled(): boolean {
        return Modernizr.cors;
    }

    notFound(): void {
        try{
            parent.$(parent.document).trigger(BaseEvents.NOT_FOUND);
            return;
        } catch (e) {}
    }

    configure(extension: any, cb: (config: any) => void): void {
        const that = this;

        this.getConfigExtension(extension, (configExtension: any) => {

            // todo: use a compiler flag when available
            const configUri: string = 'lib/' + extension.name + '.' + that.data.locale + '.config.json';

            $.getJSON(configUri, (config) => {
                this.extendConfig(extension, config, configExtension, cb);
            });
        });
    }

    extendConfig(extension: any, config: any, configExtension: any, cb: (config: any) => void): void {
        config.name = extension.name;

        // if data-config has been set, extend the existing config object.
        if (configExtension) {
            // save a reference to the config extension uri.
            config.uri = this.data.configUri;
            $.extend(true, config, configExtension);
        }

        cb(config);
    }

    getConfigExtension(extension: any, cb: (configExtension: any) => void): void {

        const sessionConfig: string | null = sessionStorage.getItem(extension.name + '.' + this.data.locale);

        if (sessionConfig) { // if config is stored in sessionstorage
            cb(JSON.parse(sessionConfig));
        } else if (this.data.configUri) { // if data-config has been set

            if (this.isCORSEnabled()) {
                $.getJSON(this.data.configUri, (configExtension) => {
                    cb(configExtension);
                });
            } else {
                // use jsonp
                var settings: JQueryAjaxSettings = <JQueryAjaxSettings>{
                    url: this.data.configUri,
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

    injectCss(extension: any, cb: () => void): void {
        const cssPath: string = 'themes/' + this.data.config.options.theme + '/css/' + extension.name + '/theme.css';

        yepnope.injectCss(cssPath, function() {
            cb();
        });
    }

    createExtension(extension: any): void {
        const helper: Manifold.IHelper = extension.helper;
        this.extension = new extension.type(this);
        this.extension.helper = helper;
        this.extension.name = extension.name;
        this.extension.create();
    }
}