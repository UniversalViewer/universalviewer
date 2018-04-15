import {UVDataProvider} from "./UVDataProvider";

export default class URLDataProvider extends UVDataProvider {

    constructor(readonly: boolean) {
        super(readonly);
    }

    public get(key: string, defaultValue: string | null): string | null {
        return Utils.Urls.getHashParameter(key, document) || defaultValue;
    }

    public set(key: string, value: string): void {
        if (!this.readonly) {
            if (value) {
                Utils.Urls.setHashParameter(key, value.toString(), document);
            } else {
                Utils.Urls.setHashParameter(key, '', document);
            }
        }
    }
}