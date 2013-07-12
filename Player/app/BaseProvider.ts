/// <reference path="../js/jquery.d.ts" />
import ip = module("app/IProvider");
import utils = module("app/Utils");

export class BaseProvider implements ip.IProvider {
    config: any;
    extensions: any;
    assetSequence: any;
    content: any;

    options: any = {
        panelAnimationDuration: 250,
        leftPanelCollapsedWidth: 30,
        leftPanelExpandedWidth: 255,
        rightPanelCollapsedWidth: 30,
        rightPanelExpandedWidth: 255
    };

    constructor(configUri: string, extensions: any) {

        this.extensions = extensions;

        // get config.
        this.getData(configUri, (config) => {
            this.config = config;
            this.content = config.content;

            var dataUri = utils.Utils.getParameterByName('dataUri');

            this.getData(dataUri, (data) => {
                this.create(data);
            });
        });
    }

    getData(dataUri: string, callbackFunc: (data: any) => any): any {
        $.getJSON(dataUri, (data) => {
            callbackFunc(data);
        });
    }

    create(data: any): void {

        // get the assetSequence index or default to 0.
        var index = utils.Utils.getParameterByName('index') || 0;
        this.assetSequence = data.assetSequences[index];
        var type = this.assetSequence.rootSection.sectionType.toLowerCase();
        var extension = this.extensions[type];

        // bootstrap extension provider.
        var provider: ip.IProvider = <ip.IProvider>$.extend(true, this, new extension.provider());

        // merge config and provider options.
        provider.options = $.extend(true, provider.options, this.config.options);

        // create extension.
        new extension.type(provider);
    }

    getRootSection(): any {
        return this.assetSequence.rootSection;
    }

    getTitle(): string {
        return this.getRootSection().title;
    }
}