/// <reference path="../js/jquery.d.ts" />
import dp = module("app/IDataProvider");

export class DataProvider implements dp.IDataProvider {
    data: any;

    getData(dataUri: string, callbackFunc: (data: any) => any): any{
        $.getJSON(dataUri, (data) => {
            this.data = data;
            callbackFunc(this.data);
        });
    }
}