// import {ILocale} from "./ILocale";
// import {UVDataProvider} from "./UVDataProvider";

// export default class IFrameURLDataProvider extends UVDataProvider {

//     public getLocales(): ILocale[] {
//         const localeParam: string | null = Utils.Urls.getQuerystringParameter('locale') || Utils.Urls.getQuerystringParameter('locales');

//         if (localeParam && localeParam !== 'undefined') {
//             return this.parseLocales(localeParam);
//         }

//         return [];
//     }

//     public get<T>(key: string, defaultValue: T): T {
//         let value: any = null;

//         if (this._hashParamsAvailable()) {
//             value = Utils.Urls.getHashParameter(key, (parent.document) ? parent.document : document);
//         }

//         if (!value) {
//             value = Utils.Urls.getQuerystringParameter(key);
//         }

//         if (value) {
//             return value;
//         }

//         return defaultValue;
//     }

//     public set<T>(key: string, value: T): void {
//         if (this._isDeepLinkingEnabled()) {
//             Utils.Urls.setHashParameter(key, value.toString(), (parent.document) ? parent.document : document);
//         }
//     }

//     public isHomeDomain(): boolean {
//         return Boolean(Utils.Urls.getQuerystringParameter('isHomeDomain'));
//     }

//     public isOnlyInstance(): boolean {
//         return Boolean(Utils.Urls.getQuerystringParameter('isOnlyInstance'));
//     }

//     public isReload(): boolean {
//         return Boolean(Utils.Urls.getQuerystringParameter('isReload'));
//     }

//     public isDeepLinkingEnabled(): boolean {
//         return (this.isHomeDomain() && this.isOnlyInstance());
//     }

//     public hashParamsAvailable(): boolean {
//         return (this.isHomeDomain() && !this._isReload() && this.isOnlyInstance());
//     }
// }