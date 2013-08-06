/// <reference path="../../../js/jquery.d.ts" />
import bp = module("app/modules/Shared/BaseProvider");
import utils = module("app/Utils");

export class BaseProvider {
    
    config: any;
    pkg: any;
    assetSequenceIndex: number;
    assetSequence: any;
    type: string;
    isHomeDomain: bool;
    isOnlyInstance: bool;
    initialAssetIndex: string;
    assetsBaseUri: string;
    embedScriptUri: string;
    initialZoom: string;

    options: any = {
        dataBaseUri: '/packagecore',
        dataUriTemplate: '{0}/{1}'
    };

    constructor(config: any, pkg: any) {
        this.config = config;
        this.pkg = pkg;
        
        this.isHomeDomain = utils.Utils.getParameterByName('isHomeDomain') === "true";
        this.isOnlyInstance = utils.Utils.getParameterByName('isOnlyInstance') === "true";
        this.initialAssetIndex = utils.Utils.getParameterByName('assetIndex');
        this.assetsBaseUri = utils.Utils.getParameterByName('assetsBaseUri');
        this.embedScriptUri = utils.Utils.getParameterByName('embedScriptUri');
        this.initialZoom = utils.Utils.getParameterByName('zoom');

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