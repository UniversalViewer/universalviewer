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
    dataUri: string;
    isHomeDomain: boolean;
    isOnlyInstance: boolean;
    embedScriptUri: string;
    isReload: boolean;
    configExtension: string;
    domain: string;
    isLightbox: boolean;

    // map param names to enum indexes.
    static paramMap: string[] = ['asi', 'ai', 'z'];

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
        this.sequence = this.manifest.assetSequences[this.sequenceIndex];

        // replace all ref sequences with an object that can store
        // its path and sub structures. they won't get used for anything
        // else without a reload.
        for (var i = 0; i < this.manifest.assetSequences.length; i++) {
            if (this.manifest.assetSequences[i].$ref) {
                this.manifest.assetSequences[i] = {};
            }
        }

        if (this.manifest.rootStructure) {
            this.parseManifest();
        }

        this.parseStructure();
    }

    reload(callback: any): void {

        var manifestUri = this.dataUri;

        if (this.options.dataBaseUri){
            manifestUri = this.options.dataBaseUri + this.dataUri;
        }

        manifestUri = this.addTimestamp(manifestUri);

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
        return this.sequence.assetType.replace('/', '-');
    }

    getRootSection(): any {
        return this.sequence.rootSection;
    }

    getTitle(): string {
        return this.getRootSection().title;
    }

    getSeeAlso(): any {
        return this.sequence.seeAlso;
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
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

    getMediaUri(mediaUri: string): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, mediaUri);

        return uri;
    }

    setMediaUri(canvas: any): void{
        canvas.mediaUri = this.getMediaUri(canvas.mediaUri);
    }

    getThumbUri(canvas: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.dataBaseUri || "";
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;
        var uri = String.prototype.format(template, baseUri, canvas.thumbnailPath);

        if (this.options.timestampUris) uri = this.addTimestamp(uri);

        return uri;
    }

    parseManifest(): void{
        this.parseManifestation(this.manifest.rootStructure, this.manifest.assetSequences, '');
    }

    // manifestations are called "structures" in the legacy format.
    parseManifestation(structure: any, sequences: any[], path: string): void {

        structure.path = path;

        if (typeof(structure.sequence) != 'undefined') {

            var sequence = sequences[structure.sequence];

            sequence.index = structure.sequence;
            sequence.structure = structure;

            // replace index with actual object ref.
            structure.sequence = sequence;
        }

        if (structure.structures) {
            for (var j = 0; j < structure.structures.length; j++) {
                this.parseManifestation(structure.structures[j], sequences, path + '/' + j);
            }
        }
    }

    parseStructure(): void{
        this.parseStructures(this.getRootSection(), this.sequence.assets, '');
    }

    // the purpose of this is to give each asset in assetSequence.assets
    // a collection of sections it belongs to.
    // it also builds a path string property for each section.
    // this can then be used when a section is clicked in the tree view
    // where getSectionIndex in baseExtension loops though all assets and their
    // associated sections until it finds one with a matching path.
    // (structures/ranges in iiif are called sections in the legacy format)
    parseStructures(section: any, assets: any[], path: string): void {

        section.path = path;

        // replace SectionType with config.js mapping (if exists).
        section.sectionType = this.replaceSectionType(section.sectionType);

        for (var i = 0; i < section.assets.length; i++) {
            var index = section.assets[i];

            var canvas = assets[index];

            if (!canvas.sections) canvas.sections = [];

            canvas.sections.push(section);
        }

        if (section.sections) {
            for (var j = 0; j < section.sections.length; j++) {
                this.parseStructures(section.sections[j], assets, path + '/' + j);
            }
        }
    }

    replaceSectionType(sectionType: string): string {
        if (this.config.options.sectionMappings && this.config.options.sectionMappings[sectionType]) {
            return this.config.options.sectionMappings[sectionType];
        }

        return sectionType;
    }

    getSectionByCanvasIndex(index: number): any {

        var canvas = this.getCanvasByIndex(index);

        return this.getCanvasSection(canvas);
    }

    getSectionIndex(path: string): number {

        for (var i = 0; i < this.sequence.assets.length; i++) {
            var canvas = this.sequence.assets[i];
            for (var j = 0; j < canvas.sections.length; j++) {
                var section = canvas.sections[j];

                if (section.path == path) {
                    return i;
                }
            }
        }

        return null;
    }

    getCanvasSection(canvas: any): any {
        // get the deepest section that this file belongs to.
        return canvas.sections.last();
    }

    getLastCanvasOrderLabel(): string {

        // get the last orderlabel that isn't empty or '-'.
        for (var i = this.sequence.assets.length - 1; i >= 0; i--) {
            var canvas = this.sequence.assets[i];

            var regExp = /\d/;

            if (regExp.test(canvas.orderLabel)) {
                return canvas.orderLabel;
            }
        }

        // none exists, so return '-'.
        return '-';
    }

    getCanvasIndexByOrderLabel(label: string): number {

        // label value may be double-page e.g. 100-101 or 100_101 or 100 101 etc
        var regExp = /(\d*)\D*(\d*)|(\d*)/;
        var match = regExp.exec(label);

        var labelPart1 = match[1];
        var labelPart2 = match[2];

        if (!labelPart1) return -1;

        var searchRegExp, regStr;

        if (labelPart2) {
            regStr = "^" + labelPart1 + "\\D*" + labelPart2 + "$";
        } else {
            regStr = "\\D*" + labelPart1 + "\\D*";
        }

        searchRegExp = new RegExp(regStr);

        // loop through files, return first one with matching orderlabel.
        for (var i = 0; i < this.sequence.assets.length; i++) {
            var canvas = this.sequence.assets[i];

            if (searchRegExp.test(canvas.orderLabel)) {
                return i;
            }
        }

        return -1;
    }

    getStructureSeeAlsoUri(structure: any): string{
        if (structure.seeAlso && structure.seeAlso.tag && structure.seeAlso.data){
            if (structure.seeAlso.tag === 'OpenExternal'){
                return this.getMediaUri(structure.seeAlso.data);
            }
        }
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }
}