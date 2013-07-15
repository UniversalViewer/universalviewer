/// <reference path="../js/jquery.d.ts" />
import bp = module("app/BaseProvider");
import utils = module("app/Utils");

export class BaseProvider {
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

        // todo: get the assetSequence hash value index or default to 0.
        var index = 0;

        this.assetSequence = data.assetSequences[index];

        this.parseSections(this.getRootSection(), this.assetSequence.assets, '');

        var type = this.assetSequence.rootSection.sectionType.toLowerCase();

        var extension = this.extensions[type];

        // bootstrap extension provider.
        var provider: bp.BaseProvider = <bp.BaseProvider>$.extend(true, this, new extension.provider());

        // merge config and provider options.
        provider.options = $.extend(true, provider.options, this.config.options);

        // create extension.
        new extension.type(provider);
        (<any>provider).create();
    }

    parseSections(section, assets, path): void {

        section.path = path;

        for (var i = 0; i < section.assets.length; i++) {
            var index = section.assets[i];

            var asset = assets[index];

            if (!asset.sections) asset.sections = [];

            asset.sections.push(section);
        }

        if (section.sections) {
            for (var j = 0; j < section.sections.length; j++) {
                this.parseSections(section.sections[j], assets, path + '/' + j);
            }
        }
    }

    getRootSection(): any {
        return this.assetSequence.rootSection;
    }

    getTitle(): string {
        return this.getRootSection().title;
    }
}