import Params = require("./Params");

class BootstrapParams {
    canvasIndex: number;
    collectionIndex: number;
    config: string;
    domain: string;
    embedDomain: string;
    embedScriptUri: string;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    jsonp: boolean;
    locale: string;
    localeName: string;
    locales: any[];
    manifestIndex: number;
    manifestUri: string;
    paramMap: string[] = ['c', 'm', 's', 'cv', 'z', 'r', 'h', 'a']; // todo: move z, r, h, a to their respective extensions
    sequenceIndex: number;

    constructor() {
        this.config = Utils.Urls.GetQuerystringParameter('config');
        this.domain = Utils.Urls.GetQuerystringParameter('domain');
        this.embedDomain = Utils.Urls.GetQuerystringParameter('embedDomain');
        this.embedScriptUri = Utils.Urls.GetQuerystringParameter('embedScriptUri');
        this.isHomeDomain = Utils.Urls.GetQuerystringParameter('isHomeDomain') === 'true';
        this.isLightbox = Utils.Urls.GetQuerystringParameter('isLightbox') === 'true';
        this.isOnlyInstance = Utils.Urls.GetQuerystringParameter('isOnlyInstance') === 'true';
        this.isReload = Utils.Urls.GetQuerystringParameter('isReload') === 'true';
        var jsonpParam = Utils.Urls.GetQuerystringParameter('jsonp');
        this.jsonp = jsonpParam === null ? null : !(jsonpParam === 'false' || jsonpParam === '0');
        this.manifestUri = Utils.Urls.GetQuerystringParameter('manifestUri');
        var locale = Utils.Urls.GetQuerystringParameter('locale') || 'en-GB';
        this.setLocale(locale);

        this.collectionIndex = this.getParam(Params.collectionIndex);
        this.manifestIndex = this.getParam(Params.manifestIndex);
        this.sequenceIndex = this.getParam(Params.sequenceIndex);
        this.canvasIndex = this.getParam(Params.canvasIndex);
    }

    getLocaleName(): string {
        return this.localeName;
    }

    getParam(param: Params): any {
        if (this.hashParamsAvailable()){
            // get param from parent document
            var p = parseInt(Utils.Urls.GetHashParameter(this.paramMap[param], parent.document));
            if (p || p === 0) return p;
        }

        // get param from iframe querystring
        return parseInt(Utils.Urls.GetQuerystringParameter(this.paramMap[param])) || 0;
    }

    hashParamsAvailable(): boolean {
        // if reloading,
        return (this.isHomeDomain && !this.isReload && this.isOnlyInstance);
    }

    // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' into array
    setLocale(locale: string): void {
        this.locale = locale;
        this.locales = [];
        var l = this.locale.split(',');

        for (var i = 0; i < l.length; i++) {
            var v = l[i].split(':');
            this.locales.push({
                name: v[0].trim(),
                label: (v[1]) ? v[1].trim() : ""
            });
        }

        this.localeName = this.locales[0].name;
    }
}

export = BootstrapParams;