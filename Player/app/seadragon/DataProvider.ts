/// <reference path="../../js/jquery.d.ts" />
import dp = module("app/IDataProvider");

export class DataProvider implements dp.IDataProvider {
    data: any;
    
    options: any = {
        panelAnimationDuration: 250,
        leftPanelCollapsedWidth: 20,
        leftPanelExpandedWidth: 300,
        rightPanelCollapsedWidth: 20,
        rightPanelExpandedWidth: 300
    };

    getData(dataUri: string, callbackFunc: (data: any) => any): any{
        $.getJSON(dataUri, (data) => {
            this.data = data;
            callbackFunc(this.data);
        });
    }

    setData(data: any) {
        // put any custom parsing here.
        this.data = data;
    }

    getRootSection(): any{
        return this.data.assetSequences[0].rootSection;
    }

    getTitle(): string{
        return this.getRootSection().title;
    }
}