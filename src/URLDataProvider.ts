import {UVDataProvider} from "./UVDataProvider";

export default class URLDataProvider extends UVDataProvider {

    public get(key: string, defaultValue: string | null): string | null {
        return Utils.Urls.getHashParameter(key, document) || defaultValue;
    }

    public set(key: string, value: string): void {
        Utils.Urls.setHashParameter(key, value.toString(), document);
    }
}