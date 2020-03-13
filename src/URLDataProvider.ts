import { UVDataProvider } from "./UVDataProvider";
import { Urls } from "@edsilv/utils";

export class URLDataProvider extends UVDataProvider {
  constructor(readonly: boolean = false) {
    super(readonly);
  }

  public get(key: string, defaultValue: string | null): string | null {
    return Urls.getHashParameter(key, document) || defaultValue;
  }

  public set(key: string, value: string): void {
    if (!this.readonly) {
      if (value) {
        Urls.setHashParameter(key, value.toString(), document);
      } else {
        Urls.setHashParameter(key, "", document);
      }
    }
  }
}
