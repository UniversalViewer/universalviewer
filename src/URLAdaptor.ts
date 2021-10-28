import { UVAdaptor } from "./UVAdaptor";
import { Urls } from "@edsilv/utils";

export class URLAdaptor extends UVAdaptor {
  constructor(readonly: boolean = false) {
    super(readonly);
  }

  public get(key: string, defaultValue: string | null): string | null {
    return Urls.getHashParameter(key, document) || defaultValue;
  }

  public getFragment(key: string, url: string): string | null {
    const regex = new RegExp("#.*" + key + "=([^&]+)(&|$)");
    const match = regex.exec(url);
    return(match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
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
