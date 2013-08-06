/// <reference path="../../../js/jquery.d.ts" />
import utils = require("app/Utils");

export class BaseProvider {
    
    config: any;
    pkg: any;
    assetSequenceIndex: number;
    assetSequence: any;
    type: string;
    isHomeDomain: boolean;
    isOnlyInstance: boolean;
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

    // the purpose of this is to give each asset in this.assetSequence.assets
    // a collection of sections it belongs to.
    // it also builds a path string property for each section.
    // this can then be used when a section is clicked in the tree view
    // where getSectionIndex in BaseApp loops though all assets and their
    // associated sections until it finds one with a matching path.
    parseSections(section, assets, path): void {

        section.path = path;

        // replace SectionType with config.js mapping (if exists).
        section.sectionType = this.replaceSectionType(section.sectionType);

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

    replaceSectionType(sectionType: string): string {
        if (this.config.options.sectionMappings[sectionType]) {
            return this.config.options.sectionMappings[sectionType];
        }

        return sectionType;
    }

    getRootSection(): any {
        return this.assetSequence.rootSection;
    }

    getTitle(): string {
        return this.getRootSection().title;
    }
}