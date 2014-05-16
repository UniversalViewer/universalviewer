/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import utils = require("../../utils");
import IProvider = require("./iProvider");
import TreeNode = require("./treeNode");
import Thumb = require("./thumb");

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

    canvasIndex: number;
    config: any;
    configExtension: string;
    dataUri: string;
    domain: string;
    embedScriptUri: string;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    manifest: any;
    sequence: any;
    sequenceIndex: number;
    treeRoot: TreeNode;

    // map param names to enum indexes.
    paramMap: string[] = ['si', 'ci', 'z'];

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
            this.sequenceIndex = parseInt(utils.Utils.getHashParameter(this.paramMap[params.sequenceIndex], parent.document));
        }

        if (!this.sequenceIndex){
            this.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(this.paramMap[params.sequenceIndex])) || 0;
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

        this.parseManifest();

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

    // todo
    getManifestType(): string{
        return 'monograph';
    }

    getSequenceType(): string{
        // todo: perhaps use viewingHint attribute
        // default to 'seadragon-iiif'
        return 'seadragon-iiif';
    }

    getTitle(): string {
        return this.manifest.label;
    }

    getSeeAlso(): any {
        return this.manifest.seeAlso;
    }

    // todo
    getCanvasOrderLabel(canvas: any): string{
        return null;
    }

    // todo
    getLastCanvasOrderLabel(): string {
        return '-';
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getCanvasByIndex(index: number): any {
        return this.sequence.canvases[index];
    }

    // todo
    getStructureByCanvasIndex(index: number): any {
        return null;
        //var canvas = this.getCanvasByIndex(index);

        //return this.getCanvasStructure(canvas);
    }

    getCanvasStructure(canvas: any): any {
        //return canvas.structures.last();
    }

    getCurrentCanvas(): any {
        return this.sequence.canvases[this.canvasIndex];
    }

    getTotalCanvases(): number{
        return this.sequence.canvases.length;
    }

    isMultiCanvas(): boolean{
        return this.sequence.canvases.length > 1;
    }

    isMultiSequence(): boolean{
        return this.manifest.sequences.length > 1;
    }

    getMediaUri(mediaUri: string): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, mediaUri);

        return uri;
    }

    setMediaUri(canvas: any): void{
        //canvas.mediaUri = this.getMediaUri(canvas.resources[0].resource['@id'] + '/info.json');
    }

    // todo
    getThumbUri(canvas: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.dataBaseUri || "";
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;

        //if (this.options.timestampUris) uri = this.addTimestamp(uri);

        //return uri;

        return null;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    // todo
    getThumbs(): Array<Thumb> {
        var thumbs = new Array<Thumb>();

        for (var i = 0; i < this.getTotalCanvases(); i++) {
            var canvas = this.sequence.canvases[i];

            var heightRatio = canvas.height / canvas.width;

            var width = 90;
            var height = 150;

            if (heightRatio){
                height = Math.floor(width * heightRatio);
            }

            var uri;

            if (canvas.resources){
                uri = canvas.resources[0].resource.service['@id'];
            } else if (canvas.images){
                uri = canvas.images[0].resource.service['@id'];
            }

            var tile = 'full/'+ width + ',' + height + '/0/native.jpg';

            if (uri.endsWith('/')){
                uri += tile;
            } else {
                uri += '/' + tile;
            }

            thumbs.push(new Thumb(i, uri, canvas.label, height, true));
        }

        return thumbs;
    }

    parseManifest(): void{

    }

    parseStructure(): void{

    }

    getRootStructure(): any {
        return null;
    }

    getStructureIndex(path: string): number {
        return null;
    }

    getStructureByIndex(structure: any, index: number): any{
        return null;
    }

    getCanvasIndexByOrderLabel(label: string): number {
        return null;
    }

    getManifestSeeAlsoUri(manifest: any): string{
        return null;
    }

    getTree(): TreeNode{
        return null;
    }

    getDomain(): string{
        var parts = utils.Utils.getUrlParts(this.dataUri);
        return parts.domain;
    }
}