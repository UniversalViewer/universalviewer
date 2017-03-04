import {IUVData} from "./IUVData";
import {UVDataProvider} from "./UVDataProvider";
import {Params} from "./Params";

export default class URLDataProvider extends UVDataProvider {

    private _paramMap: string[] = ['c', 'm', 's', 'cv', 'xywh', 'r', 'h', 'a']; // todo: move xywh, r, h, a to OSDUrlDataProvider

    constructor() {
        super();
    }

    public data(): IUVData {
        return this.data = <any>{
            // querystring params
            config: {},
            configUri: Utils.Urls.getQuerystringParameter('config'),
            domain: Utils.Urls.getQuerystringParameter('domain'),
            embedDomain: Utils.Urls.getQuerystringParameter('embedDomain'),
            embedScriptUri: Utils.Urls.getQuerystringParameter('embedScriptUri'),
            isHomeDomain: Utils.Urls.getQuerystringParameter('isHomeDomain') === 'true',
            isLightbox: Utils.Urls.getQuerystringParameter('isLightbox') === 'true',
            isOnlyInstance: Utils.Urls.getQuerystringParameter('isOnlyInstance') === 'true',
            isReload: Utils.Urls.getQuerystringParameter('isReload') === 'true',
            iiifResourceUri: Utils.Urls.getQuerystringParameter('manifestUri') || Utils.Urls.getQuerystringParameter('iiifResourceUri'),
            locale: this.parseLocale(Utils.Urls.getQuerystringParameter('locale')),
            // querystring or hash params
            collectionIndex: this.getParam(Params.collectionIndex),
            manifestIndex: this.getParam(Params.manifestIndex),
            sequenceIndex: this.getParam(Params.sequenceIndex),
            canvasIndex: this.getParam(Params.canvasIndex)
        }
    }

    // get hash or data-attribute params depending on whether the UV is embedded.
    public getParam(key: Params): string | null {
        let value: string | null = null;

        // deep linking is only allowed when hosted on home domain.
        if (this._hashParamsAvailable()) {
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.getHashParameter(this._paramMap[key], parent.document);
        }

        if (!value) {
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.getQuerystringParameter(this._paramMap[key]);
        }

        return value;
    }

    // set hash params depending on whether the UV is embedded.
    public setParam(key: Params, value: string): void {
        if (this._isDeepLinkingEnabled()) {
            Utils.Urls.setHashParameter(this._paramMap[key], value, parent.document);
        }
    }

    private _isDeepLinkingEnabled(): boolean {
        return (this.data.isHomeDomain && this.data.isOnlyInstance);
    }

    private _hashParamsAvailable(): boolean {
        return (this.data.isHomeDomain && !this.data.isReload && this.data.isOnlyInstance);
    }
}