import {ILocale} from "./ILocale";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";

export class UVDataProvider implements IUVDataProvider {
    
    constructor() {

    }

    // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' and return ILocale array.
    public parseLocales(locales: string): ILocale[] {

        const parsedLocales: ILocale[] = [];
        const l: string[] = locales.split(',');

        for (let i = 0; i < l.length; i++) {
            const v: string[] = l[i].split(':');
            parsedLocales.push(<ILocale>{
                name: v[0].trim(),
                label: (v[1]) ? v[1].trim() : ""
            });
        }

        return parsedLocales;
    }

    // private _parseLocales(): void {

    //     // use data-locales to prioritise
    //     const items: any[] = this.data.config.localisation.locales.slice(0);
    //     const sorting: any[] = this.data.locales;
    //     const result: ILocale[] = [];

    //     // loop through sorting array
    //     // if items contains sort item, add it to results.
    //     // if sort item has a label, substitute it
    //     // mark item as added.
    //     // if limitLocales is disabled,
    //     // loop through remaining items and add to results.

    //     $.each(sorting, (index: number, sortItem: any) => {
    //         const match = items.filter((item: any) => { return item.name === sortItem.name; });
    //         if (match.length){
    //             var m: any = match[0];
    //             if (sortItem.label) m.label = sortItem.label;
    //             m.added = true;
    //             result.push(m);
    //         }
    //     });

    //     const limitLocales: boolean = Utils.Bools.getBool(this.data.config.options.limitLocales, false);

    //     if (!limitLocales) {
    //         $.each(items, (index: number, item: any) => {
    //             if (!item.added){
    //                 result.push(item);
    //             }
    //             delete item.added;
    //         });
    //     }

    // }

    public data(): IUVData {
        return <IUVData>{};
    }

    public get<T>(key: string, defaultValue: T): T {
        return <T>new Object();
    }

    public set<T>(key: string, value: T): void {

    }
}