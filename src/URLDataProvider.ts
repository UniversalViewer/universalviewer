import {ILocale} from "./ILocale";
import {IUVData} from "./IUVData";
import {UVDataProvider} from "./UVDataProvider";

export default class URLDataProvider extends UVDataProvider {

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
            assetRoot: './uv/',
            config: {},
            configUri: this.get<string | null>('config', null),
            domain: this.get<string | null>('domain', null),
            embedDomain: this.get<string | null>('embedDomain', null),
            embedScriptUri: this.get<string | null>('embedScriptUri', null),
            isHomeDomain: this._isHomeDomain(),
            isLightbox: Boolean(this.get<boolean>('isLightbox', false)),
            isOnlyInstance: this._isOnlyInstance(),
            isReload: this._isReload(),
            iiifResourceUri: this.get<string | null>('iiifResourceUri', null),
            locales: locales,
            collectionIndex: Number(this.get<number>('c', 0)),
            manifestIndex: Number(this.get<number>('m', 0)),
            sequenceIndex: Number(this.get<number>('s', 0)),
            canvasIndex: Number(this.get<number>('cv', 0)),
            // non-generic params, move these to extension-specific data providers
            rotation: Number(this.get<number>('r', 0)),
            xywh: this.get<string | null>('xywh', '')
        }
    }

    private _isHomeDomain(): boolean {
        return Boolean(Utils.Urls.getQuerystringParameter('isHomeDomain'));
    }

    private _isOnlyInstance(): boolean {
        return Boolean(Utils.Urls.getQuerystringParameter('isOnlyInstance'));
    }

    private _isReload(): boolean {
        return Boolean(Utils.Urls.getQuerystringParameter('isReload'));
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