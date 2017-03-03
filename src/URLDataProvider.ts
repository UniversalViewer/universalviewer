import {IUVData} from "./IUVData";
import {UVDataProvider} from "./UVDataProvider";
import {Params} from "./Params";

export class URLDataProvider extends UVDataProvider {

    constructor() {
        super();
    }

    public data(): IUVData {
        return this.store = <IUVData>{
            // querystring params
            configUrl: Utils.Urls.getQuerystringParameter('config'),
            domain: Utils.Urls.getQuerystringParameter('domain'),
            embedDomain: Utils.Urls.getQuerystringParameter('embedDomain'),
            embedScriptUri: Utils.Urls.getQuerystringParameter('embedScriptUri'),
            isHomeDomain: Utils.Urls.getQuerystringParameter('isHomeDomain') === 'true',
            isLightbox: Utils.Urls.getQuerystringParameter('isLightbox') === 'true',
            isOnlyInstance: Utils.Urls.getQuerystringParameter('isOnlyInstance') === 'true',
            isReload: Utils.Urls.getQuerystringParameter('isReload') === 'true',
            iiifResourceUri: Utils.Urls.getQuerystringParameter('manifestUri') || Utils.Urls.getQuerystringParameter('iiifResourceUri'),
            locale: this.parseLocale(Utils.Urls.getQuerystringParameter('locale')),
            paramMap: ['c', 'm', 's', 'cv', 'xywh', 'r', 'h', 'a'], // todo: move xywh, r, h, a to OSDUrlDataProvider
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
            value = Utils.Urls.getHashParameter(this.store.paramMap[key], parent.document);
        }

        if (!value) {
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.getQuerystringParameter(this.store.paramMap[key]);
        }

        return value;
    }

    public isDeepLinkingEnabled(): boolean {
        return (this.store.isHomeDomain && this.store.isOnlyInstance);
    }

    private _hashParamsAvailable(): boolean {
        return (this.store.isHomeDomain && !this.store.isReload && this.store.isOnlyInstance);
    }
}