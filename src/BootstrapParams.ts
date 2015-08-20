import Params = require("./Params");

class BootstrapParams {
    canvasIndex: number;
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
    paramMap: string[] = ['mi', 'si', 'ci', 'z', 'r'];
    sequenceIndex: number;

    constructor() {
        this.config = Utils.Urls.GetQuerystringParameter('config');
        this.domain = Utils.Urls.GetQuerystringParameter('domain');
        this.embedDomain = Utils.Urls.GetQuerystringParameter('embedDomain');
        this.embedScriptUri = Utils.Urls.GetQuerystringParameter('embedScriptUri');
        this.isHomeDomain = Utils.Urls.GetQuerystringParameter('isHomeDomain') === "true";
        this.isLightbox = Utils.Urls.GetQuerystringParameter('isLightbox') === "true";
        this.isOnlyInstance = Utils.Urls.GetQuerystringParameter('isOnlyInstance') === "true";
        this.isReload = Utils.Urls.GetQuerystringParameter('isReload') === "true";
        var jsonpParam = Utils.Urls.GetQuerystringParameter('jsonp');
        this.jsonp = jsonpParam === null ? null : !(jsonpParam === "false" || jsonpParam === "0");
        this.manifestUri = Utils.Urls.GetQuerystringParameter('manifestUri');
        this.setLocale(Utils.Urls.GetQuerystringParameter('locale'));

        this.manifestIndex = this.getManifestIndexParam();
        this.sequenceIndex = this.getSequenceIndexParam();
        this.canvasIndex = this.getCanvasIndexParam();
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

    getLocaleName(): string {
        return this.localeName;
    }

    getManifestIndexParam(): number {
        // if the hash param is available and is first load
        if (this.isHomeDomain && !this.isReload){
            return parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.manifestIndex], parent.document)) || 0;
        }

        // get param from iframe querystring
        return parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.manifestIndex])) || 0;
    }

    getSequenceIndexParam(): number {
        // if the hash param is available and is first load
        if (this.isHomeDomain && !this.isReload){
            return parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.sequenceIndex], parent.document)) || 0;
        }

        // get param from iframe querystring
        return parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.sequenceIndex])) || 0;
    }

    getCanvasIndexParam(): number {
        return parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.canvasIndex], parent.document)) || 0;
    }
}

export = BootstrapParams;