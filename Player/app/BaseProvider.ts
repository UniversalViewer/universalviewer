/// <reference path="../js/jquery.d.ts" />
import bp = module("app/BaseProvider");
import utils = module("app/Utils");

export class BaseProvider {
    
    config: any;
    pkg: any;
    assetSequenceIndex: number;
    assetSequence: any;
    type: string;

    options: any = {
        dataUriTemplate: '{0}/{1}',
        panelAnimationDuration: 250,
        leftPanelCollapsedWidth: 30,
        leftPanelExpandedWidth: 255,
        rightPanelCollapsedWidth: 30,
        rightPanelExpandedWidth: 255
    };

    constructor(config: any, pkg: any) {
        this.config = config;
        this.pkg = pkg;
        
        this.options.isHomeDomain = utils.Utils.getParameterByName('isHomeDomain');
        this.options.isOnlyInstance = utils.Utils.getParameterByName('isOnlyInstance');
        this.options.assetIndex = utils.Utils.getParameterByName('assetIndex');
        this.options.assetsBaseUri = utils.Utils.getParameterByName('assetsBaseUri');
        this.options.embedScriptUri = utils.Utils.getParameterByName('embedScriptUri');

        var hash = utils.Utils.getHashValues('/', parent.document);
        
        this.assetSequenceIndex = hash[0] || 0;
        
        this.assetSequence = pkg.assetSequences[this.assetSequenceIndex];

        this.type = this.getRootSection().sectionType.toLowerCase();

        this.parseSections(this.getRootSection(), this.assetSequence.assets, '');
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