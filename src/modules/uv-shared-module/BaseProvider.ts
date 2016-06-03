import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ExternalResource = require("./ExternalResource");
import IMetadataItem = require("./IMetadataItem");
import IProvider = require("./IProvider");
import Params = require("../../Params");
import UriLabeller = require("./UriLabeller");
import IRange = require("./IRange");
import ICanvas = require("./ICanvas");

// providers contain methods that could be implemented differently according
// to factors like varying back end data provisioning systems.
// todo: expose the provider as an external API to the containing page.
class BaseProvider implements IProvider{

    bootstrapper: BootStrapper;
    //canvasIndex: number;
    collectionIndex: number;
    config: any;
    domain: string;
    embedDomain: string;
    embedScriptUri: string;
    //iiifResource: Manifesto.IIIIFResource;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    jsonp: boolean;
    lastCanvasIndex: number;
    //licenseFormatter: UriLabeller;
    locale: string;
    locales: any[];
    //manifest: Manifesto.IManifest;
    manifestIndex: number;
    manifestUri: string;
    resources: Manifesto.IExternalResource[];
    //sequenceIndex: number;

    options: any = {
        thumbsUriTemplate: "{0}{1}",
        timestampUris: false,
        mediaUriTemplate: "{0}{1}"
    };

    constructor(bootstrapper: BootStrapper) {
        this.bootstrapper = bootstrapper;
        this.config = this.bootstrapper.config;
        //this.iiifResource = this.bootstrapper.iiifResource;
        //this.manifest = this.bootstrapper.manifest;

        // get data-attributes that can't be overridden by hash params.
        // other data-attributes are retrieved through extension.getParam.

        // todo: make these getters when ES5 target is available
        this.manifestUri = this.bootstrapper.params.manifestUri;
        this.jsonp = this.bootstrapper.params.jsonp;
        this.locale = this.bootstrapper.params.getLocaleName();
        this.isHomeDomain = this.bootstrapper.params.isHomeDomain;
        this.isReload = this.bootstrapper.params.isReload;
        this.embedDomain = this.bootstrapper.params.embedDomain;
        this.isOnlyInstance = this.bootstrapper.params.isOnlyInstance;
        this.embedScriptUri = this.bootstrapper.params.embedScriptUri;
        this.domain = this.bootstrapper.params.domain;
        this.isLightbox = this.bootstrapper.params.isLightbox;

        this.collectionIndex = this.bootstrapper.params.collectionIndex;
        this.manifestIndex = this.bootstrapper.params.manifestIndex;
        //this.sequenceIndex = this.bootstrapper.params.sequenceIndex;
        //this.canvasIndex = this.bootstrapper.params.canvasIndex;
    }

    // re-bootstraps the application with new querystring params
    reload(params?: BootstrapParams): void {
        var p = new BootstrapParams();

        if (params){
            p = $.extend(p, params);
        }

        p.isReload = true;

        $.disposePubSub();

        this.bootstrapper.bootStrap(p);
    }

    getCanvasIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.canvasIndex);
    }

    getSequenceIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.sequenceIndex);
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getShareUrl(): string {
        if (Utils.Documents.isInIFrame() && this.isDeepLinkingEnabled()){
            return parent.document.location.href;
        }

        return document.location.href;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + Utils.Dates.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    getDomain(): string{
        var parts = Utils.Urls.getUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getSettings(): ISettings {
        if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {
            var settings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            
            if (settings)
                return $.extend(this.config.options, settings.value);
        }
        
        return this.config.options;
    }

    updateSettings(settings: ISettings): void {
        if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {
            var storedSettings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            if (storedSettings)
                settings = $.extend(storedSettings.value, settings);
                
            //store for ten years
            Utils.Storage.set("uv.settings", settings, 315360000, Utils.StorageType.local);
        }
        
        this.config.options = $.extend(this.config.options, settings);
    }

    sanitize(html: string): string {
        var elem = document.createElement('div');
        var $elem = $(elem);

        $elem.html(html);

        var s = new Sanitize({
            elements:   ['a', 'b', 'br', 'img', 'p', 'i', 'span'],
            attributes: {
                a: ['href'],
                img: ['src', 'alt']
            },
            protocols:  {
                a: { href: ['http', 'https'] }
            }
        });

        $elem.html(s.clean_node(elem));

        return $elem.html();
    }

    getLocales(): any[] {
        if (this.locales) return this.locales;

        // use data-locales to prioritise
        var items = this.config.localisation.locales.clone();
        var sorting = this.bootstrapper.params.locales;
        var result = [];

        // loop through sorting array
        // if items contains sort item, add it to results.
        // if sort item has a label, substitute it
        // mark item as added.
        // if limitLocales is disabled,
        // loop through remaining items and add to results.

        _.each(sorting, (sortItem: any) => {
            var match = _.filter(items, (item: any) => { return item.name === sortItem.name; });
            if (match.length){
                var m: any = match[0];
                if (sortItem.label) m.label = sortItem.label;
                m.added = true;
                result.push(m);
            }
        });

        var limitLocales: boolean = Utils.Bools.getBool(this.config.options.limitLocales, false);

        if (!limitLocales){
            _.each(items, (item: any) => {
                if (!item.added){
                    result.push(item);
                }
                delete item.added;
            });
        }

        return this.locales = result;
    }

    getAlternateLocale(): any {
        var locales = this.getLocales();

        var alternateLocale;

        for (var i = 0; i < locales.length; i++) {
            var l = locales[i];
            if (l.name !== this.locale) {
                alternateLocale = l;
            }
        }

        return l;
    }

    changeLocale(locale: string): void {
        // if the current locale is "en-GB:English,cy-GB:Welsh"
        // and "cy-GB" is passed, it becomes "cy-GB:Welsh,en-GB:English"

        // re-order locales so the passed locale is first
        var locales = this.locales.clone();

        var index = locales.indexOfTest((l: any) => {
            return l.name === locale;
        });

        locales.move(index, 0);

        // convert to comma-separated string
        var str = this.serializeLocales(locales);

        var p = new BootstrapParams();
        p.setLocale(str);
        this.reload(p);
    }

    serializeLocales(locales: any[]): string {
        var str = '';

        for (var i = 0; i < locales.length; i++){
            var l = locales[i];
            if (i > 0) str += ',';
            str += l.name;
            if (l.label){
                str += ':' + l.label;
            }
        }

        return str;
    }

    getSerializedLocales(): string {
        return this.serializeLocales(this.locales);
    }
}

export = BaseProvider;