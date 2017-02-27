import {Params} from "./Params";

export class BootstrapParams {
    canvasIndex: number;
    collectionIndex: number;
    config: string | null;
    domain: string | null;
    embedDomain: string | null;
    embedScriptUri: string | null;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    locale: string;
    localeName: string;
    locales: any[];
    manifestIndex: number;
    manifestUri: string | null;
    paramMap: string[] = ['c', 'm', 's', 'cv', 'xywh', 'r', 'h', 'a']; // todo: move xywh, r, h, a to their respective extensions
    sequenceIndex: number;

    constructor() {
        this.config = Utils.Urls.getQuerystringParameter('config');
        this.domain = Utils.Urls.getQuerystringParameter('domain');
        this.embedDomain = Utils.Urls.getQuerystringParameter('embedDomain');
        this.embedScriptUri = Utils.Urls.getQuerystringParameter('embedScriptUri');
        this.isHomeDomain = Utils.Urls.getQuerystringParameter('isHomeDomain') === 'true';
        this.isLightbox = Utils.Urls.getQuerystringParameter('isLightbox') === 'true';
        this.isOnlyInstance = Utils.Urls.getQuerystringParameter('isOnlyInstance') === 'true';
        this.isReload = Utils.Urls.getQuerystringParameter('isReload') === 'true';
        this.manifestUri = Utils.Urls.getQuerystringParameter('manifestUri');
        const locale: string = Utils.Urls.getQuerystringParameter('locale') || 'en-GB';
        this.setLocale(locale);

        this.collectionIndex = this.getParam(Params.collectionIndex);
        this.manifestIndex = this.getParam(Params.manifestIndex);
        this.sequenceIndex = this.getParam(Params.sequenceIndex);
        this.canvasIndex = this.getParam(Params.canvasIndex);
    }

    getLocaleName(): string {
        return this.localeName;
    }

    getParam(param: Params): number {
        if (this.hashParamsAvailable()) {
            // get param from parent document
            let p: any = Utils.Urls.getHashParameter(this.paramMap[param], parent.document);
            if (p) return parseInt(p);
        }

        // get param from iframe querystring
        const p: string | null = Utils.Urls.getQuerystringParameter(this.paramMap[param]);

        if (p) return parseInt(p)

        return 0;
    }

    hashParamsAvailable(): boolean {
        return (this.isHomeDomain && !this.isReload && this.isOnlyInstance);
    }

    // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' into array
    setLocale(locale: string): void {
        this.locale = locale;
        this.locales = [];
        const l: string[] = this.locale.split(',');

        for (let i = 0; i < l.length; i++) {
            const v: string[] = l[i].split(':');
            this.locales.push({
                name: v[0].trim(),
                label: (v[1]) ? v[1].trim() : ""
            });
        }

        this.localeName = this.locales[0].name;
    }
}