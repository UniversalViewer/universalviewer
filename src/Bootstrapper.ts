import {BaseCommands} from "./modules/uv-shared-module/BaseCommands";
import {BootstrapParams} from "./BootstrapParams";
import {IExtension} from "./modules/uv-shared-module/IExtension";

// The Bootstrapper is concerned with loading the manifest/collection (iiifResource)
// then determining which extension to use and instantiating it.
export class Bootstrapper{

    config: any;
    extension: IExtension;
    extensions: IExtension[];
    iiifResource: Manifesto.IIIIFResource;
    isFullScreen: boolean = false;
    manifest: Manifesto.IManifest;
    params: BootstrapParams;
    socket: any;

    constructor(extensions: any) {
        this.extensions = extensions;
    }

    bootstrap(params?: BootstrapParams): void {

        this.params = new BootstrapParams();

        // merge new params
        if (params){
            this.params = $.extend(true, this.params, params);
        }

        if (!this.params.manifestUri) return;

        // empty app div
        $('#app').empty();

        // add loading class
        $('#app').addClass('loading');

        // remove any existing css
        $('link[type*="text/css"]').remove();

        jQuery.support.cors = true;

        Manifold.loadManifest(<Manifold.IManifoldOptions>{
            iiifResourceUri: this.params.manifestUri,
            collectionIndex: this.params.collectionIndex,
            manifestIndex: this.params.manifestIndex,
            sequenceIndex: this.params.sequenceIndex,
            canvasIndex: this.params.canvasIndex,
            locale: this.params.localeName
        }).then((helper: Manifold.IHelper) => {
            
            let trackingLabel: string = helper.getTrackingLabel();
            trackingLabel += ', URI: ' + this.params.embedDomain;
            window.trackingLabel = trackingLabel;

            const sequence: Manifesto.ISequence = helper.getSequenceByIndex(this.params.sequenceIndex);

            if (!sequence) {
                this.notFound();
                return;
            }

            const canvas: Manifesto.ICanvas = helper.getCanvasByIndex(this.params.canvasIndex);

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

            this.featureDetect(() => {
                this.configure(extension, (config: any) => {
                    this.injectCss(extension, config, () => {
                        this.createExtension(extension, config);
                    });
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
            parent.$(parent.document).trigger(BaseCommands.NOT_FOUND);
            return;
        } catch (e) {}
    }

    featureDetect(cb: () => void): void {
        yepnope({
            test: window.btoa && window.atob,
            nope: 'lib/base64.min.js',
            complete: function () {
                cb();
            }
        });
    }

    configure(extension: any, cb: (config: any) => void): void {
        const that = this;

        this.getConfigExtension(extension, (configExtension: any) => {

            // todo: use a compiler flag when available
            const configPath: string = 'lib/' + extension.name + '.' + that.params.getLocaleName() + '.config.json';

            $.getJSON(configPath, (config) => {
                this.extendConfig(extension, config, configExtension, cb);
            });
        });
    }

    extendConfig(extension: any, config: any, configExtension: any, cb: (config: any) => void): void {
        config.name = extension.name;

        // if data-config has been set, extend the existing config object.
        if (configExtension) {
            // save a reference to the config extension uri.
            config.uri = this.params.config;

            $.extend(true, config, configExtension);
        }

        cb(config);
    }

    getConfigExtension(extension: any, cb: (configExtension: any) => void): void {

        const sessionConfig: string | null = sessionStorage.getItem(extension.name + '.' + this.params.localeName);

        if (sessionConfig) { // if config is stored in sessionstorage
            cb(JSON.parse(sessionConfig));
        } else if (this.params.config) { // if data-config has been set

            if (this.isCORSEnabled()) {
                $.getJSON(this.params.config, (configExtension) => {
                    cb(configExtension);
                });
            } else {
                // use jsonp
                var settings: JQueryAjaxSettings = <JQueryAjaxSettings>{
                    url: this.params.config,
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

    injectCss(extension: any, config: any, cb: () => void): void {
        // todo: use a compiler flag when available
        const cssPath: string = 'themes/' + config.options.theme + '/css/' + extension.name + '/theme.css';

        yepnope.injectCss(cssPath, function() {
            cb();
        });
    }

    createExtension(extension: any, config: any): void {
        this.config = config;
        var helper = extension.helper;
        this.extension = new extension.type(this);
        this.extension.helper = helper;
        this.extension.name = extension.name;
        this.extension.create();
    }
}