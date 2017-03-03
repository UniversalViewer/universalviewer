import {ILocale} from "./ILocale";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";
import {Params} from "./Params";

export class UVDataProvider implements IUVDataProvider {
    
    public store: IUVData = <IUVData>{};

    constructor() {

    }

    public data(): IUVData {
        return this.store;
    }

    public assign(data: IUVData): void {
        this.store = Object.assign(this.store, data);
    }

    // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' into array
    public parseLocale(locale: string | null): void {
        
        if (!locale) {
            return;
        }
        
        this.store.locales = [];
        const l: string[] = locale.split(',');

        for (let i = 0; i < l.length; i++) {
            const v: string[] = l[i].split(':');
            this.store.locales.push(<ILocale>{
                name: v[0].trim(),
                label: (v[1]) ? v[1].trim() : ""
            });
        }

        this.store.locale = this.store.locales[0].name;
    }

    public getParam(key: Params): string | null {
        return null;
    }

    public isDeepLinkingEnabled(): boolean {
        return false;
    }
}