import {ILocale} from "./ILocale";
import {IUVData} from "./IUVData";
import {UVDataProvider} from "./UVDataProvider";

export default class URLDataProvider extends UVDataProvider {

    //private _paramMap: string[] = ['c', 'm', 's', 'cv', 'xywh', 'r', 'h', 'a']; // todo: move xywh, r, h, a to OSDUrlDataProvider?

    constructor() {
        super();
    }

    public data(): IUVData {

        let locales: ILocale[] = [
            {
                name: 'en-GB',
                label: 'English'
            }
        ];

        const localeParam: string | null = Utils.Urls.getQuerystringParameter('locale') || Utils.Urls.getQuerystringParameter('locales');

        if (localeParam && localeParam !== 'undefined') {
            locales = this.parseLocales(localeParam);
        }

        return <IUVData>{
            config: {},
            configUri: this.get<string | null>('config', null),
            domain: this.get<string | null>('domain', null),
            embedDomain: this.get<string | null>('embedDomain', null),
            embedScriptUri: this.get<string | null>('embedScriptUri', null),
            isHomeDomain: this._isHomeDomain(),
            isLightbox: this.get<boolean>('isLightbox', false),
            isOnlyInstance: this._isOnlyInstance(),
            isReload: this._isReload(),
            iiifResourceUri: this.get<string | null>('manifestUri', null),
            locales: locales,
            collectionIndex: this.get<number>('c', 0),
            manifestIndex: this.get<number>('m', 0),
            sequenceIndex: this.get<number>('s', 0),
            canvasIndex: this.get<number>('cv', 0)
        }
    }

    private _isHomeDomain(): boolean {
        return !!Utils.Urls.getQuerystringParameter('isHomeDomain');
    }

    private _isOnlyInstance(): boolean {
        return !!Utils.Urls.getQuerystringParameter('isOnlyInstance');
    }

    private _isReload(): boolean {
        return !!Utils.Urls.getQuerystringParameter('isReload');
    }

    // get hash or data-attribute params depending on whether the UV is embedded.
    public get<T>(key: string, defaultValue: T): T {
        let value: any = null;

        // deep linking is only allowed when hosted on home domain.
        if (this._hashParamsAvailable()) {
            value = Utils.Urls.getHashParameter(key, (parent.document) ? parent.document : document);
        }

        if (!value) {
            value = Utils.Urls.getQuerystringParameter(key);
        }

        if (value) {
            return value;
        }

        return defaultValue;
    }

    // set hash params depending on whether the UV is embedded.
    public set<T>(key: string, value: T): void {
        if (this._isDeepLinkingEnabled()) {
            Utils.Urls.setHashParameter(key, value.toString(), (parent.document) ? parent.document : document);
        }
    }

    private _isDeepLinkingEnabled(): boolean {
        return (this._isHomeDomain() && this._isOnlyInstance());
    }

    private _hashParamsAvailable(): boolean {
        return (this._isHomeDomain() && !this._isReload() && this._isOnlyInstance());
    }
}