/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import utils = require("../../utils");
import IProvider = require("./iProvider");

export enum params {
    sequenceIndex,
    canvasIndex,
    zoom
}

// providers contain methods that could be implemented differently according
// to factors like varying back end data provision systems.
// they provide a consistent interface and set of data structures
// for extensions to operate against.
export class BaseProvider implements IProvider{

    config: any;
    manifest: any;
    sequenceIndex: number;
    sequence: any;
    canvasIndex: number;
    type: string;
    dataUri: string;
    isHomeDomain: boolean;
    isOnlyInstance: boolean;
    embedScriptUri: string;
    isReload: boolean;
    configExtension: string;
    domain: string;
    isLightbox: boolean;

    // map param names to enum indexes.
    // (implemented in descendant).
    static paramMap: string[];

    options: any = {
        thumbsUriTemplate: "{0}{1}",
        timestampUris: false,
        mediaUriTemplate: "{0}{1}"
    };

    constructor(config: any, manifest: any) {
        this.config = config;
        this.manifest = manifest;

        // add dataBaseUri to options so it can be overridden.
        this.options.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');

        // get data-attributes that can't be overridden by hash params.
        // other data-attributes are retrieved through app.getParam.
        this.dataUri = utils.Utils.getQuerystringParameter('du');
        this.isHomeDomain = utils.Utils.getQuerystringParameter('hd') === "true";
        this.isOnlyInstance = utils.Utils.getQuerystringParameter('oi') === "true";
        this.embedScriptUri = utils.Utils.getQuerystringParameter('esu');
        this.isReload = utils.Utils.getQuerystringParameter('rl') === "true";
        this.domain = utils.Utils.getQuerystringParameter('d');
        this.isLightbox = utils.Utils.getQuerystringParameter('lb') === "true";

        if (this.isHomeDomain && !this.isReload){
            this.sequenceIndex = parseInt(utils.Utils.getHashParameter(BaseProvider.paramMap[params.sequenceIndex], parent.document));
        }

        if (!this.sequenceIndex){
            this.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(BaseProvider.paramMap[params.sequenceIndex])) || 0;
        }

        this.load();
    }

    load(): void{
        // we know that this sequence exists because the bootstrapper
        // will have loaded it already.
        this.sequence = this.manifest.sequences[this.sequenceIndex];

        // replace all ref sequences with an object that can store
        // its path and sub structures. they won't get used for anything
        // else without a reload.
        for (var i = 0; i < this.manifest.sequences.length; i++) {
            if (!this.manifest.sequences[i].canvases) {
                this.manifest.sequences[i] = {};
            }
        }

        /*
        this.type = this.getRootSection().sectionType.toLowerCase();


        if (this.manifest.rootStructure) {
            this.parseStructures(this.manifest.rootStructure, this.manifest.sequences, '');
        }
        */
        //this.parseSections(this.getRootSection(), this.sequence.assets, '');
    }

    reload(callback: any): void {

        var manifestUri = this.dataUri;

        if (this.options.dataBaseUri){
            manifestUri = this.options.dataBaseUri + this.dataUri;
        }

        manifestUri += "?t=" + utils.Utils.getTimeStamp();

        window.manifestCallback = (data: any) => {
            this.manifest = data;

            this.load();

            callback();
        };

        $.ajax({
            url: manifestUri,
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'manifestCallback'
        });
    }

    getType(): string{
        // todo: perhaps use viewingHint attribute
        // default to 'seadragon-iiif'
        if (this.sequence.assetType){
            return this.sequence.assetType.replace('/', '-');
        } else {
            return 'seadragon-iiif';
        }
    }

    getCanvasByIndex(index: number): any {
        return this.sequence.canvases[index];
    }

    getCurrentCanvas(): any {
        return this.sequence.canvases[this.currentCanvasIndex];
    }

    isMultiCanvas(): boolean{
        return this.sequence.canvases.length > 1;
    }

    getMediaUri(fileUri: string): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, fileUri);

        return uri;
    }

    getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.dataBaseUri || "";
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;
        var uri = String.prototype.format(template, baseUri, asset.thumbnailPath);

        if (this.options.timestampUris) uri = this.addTimestamp(uri);

        return uri;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }

    /*
    // the purpose of this is to give each asset in assetSequence.assets
    // a collection of sections it belongs to.
    // it also builds a path string property for each section.
    // this can then be used when a section is clicked in the tree view
    // where getSectionIndex in baseExtension loops though all assets and their
    // associated sections until it finds one with a matching path.
    parseSections(section: any, assets: any[], path: string): void {

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

    parseStructures(structure: any, assetSequences: any[], path: string): void {

        structure.path = path;

        if (typeof(structure.assetSequence) != 'undefined') {

            var assetSequence = assetSequences[structure.assetSequence];

            assetSequence.index = structure.assetSequence;
            assetSequence.structure = structure;

            // replace index with actual object ref.
            structure.assetSequence = assetSequence;
        }

        if (structure.structures) {
            for (var j = 0; j < structure.structures.length; j++) {
                this.parseStructures(structure.structures[j], assetSequences, path + '/' + j);
            }
        }
    }

    replaceSectionType(sectionType: string): string {
        if (this.config.options.sectionMappings && this.config.options.sectionMappings[sectionType]) {
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

    getSeeAlso(): any {
        return this.assetSequence.seeAlso;
    }
    */

}