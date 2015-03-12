/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import BootStrapper = require("../../bootstrapper");
import BootstrapParams = require("../../bootstrapParams");
import utils = require("../../utils");
import IProvider = require("./iProvider");
import TreeNode = require("./treeNode");
import Thumb = require("./thumb");
import util = utils.Utils;

export enum params {
    sequenceIndex,
    canvasIndex,
    zoom,
    rotation
}

// providers contain methods that could be implemented differently according
// to factors like varying back end data provision systems.
// they provide a consistent interface and set of data structures
// for extensions to operate against.
export class BaseProvider implements IProvider{

    bootstrapper: BootStrapper;
    canvasIndex: number;
    config: any;
    manifestUri: string;
    domain: string;
    embedScriptUri: string;
    embedDomain: string;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    manifest: any;
    rootStructure: any;
    sequence: any;
    sequenceIndex: number;
    treeRoot: TreeNode;
    jsonp: boolean;
    locale: string;
    locales: any[];

    // map param names to enum indices.
    paramMap: string[] = ['si', 'ci', 'z', 'r'];

    options: any = {
        thumbsUriTemplate: "{0}{1}",
        timestampUris: false,
        mediaUriTemplate: "{0}{1}"
    };

    constructor(bootstrapper: BootStrapper, config: any, manifest: any) {
        this.bootstrapper = bootstrapper;
        this.config = config;
        this.manifest = manifest;

        // get data-attributes that can't be overridden by hash params.
        // other data-attributes are retrieved through app.getParam.

        // todo: make these getters when ES5 target is available
        this.manifestUri = this.bootstrapper.params.manifestUri;
        this.jsonp = this.bootstrapper.params.jsonp;
        this.locale = this.bootstrapper.params.getLocale();
        this.isHomeDomain = this.bootstrapper.params.isHomeDomain;
        this.isReload = this.bootstrapper.params.isReload;
        this.embedDomain = this.bootstrapper.params.embedDomain;
        this.isOnlyInstance = this.bootstrapper.params.isOnlyInstance;
        this.embedScriptUri = this.bootstrapper.params.embedScriptUri;
        this.domain = this.bootstrapper.params.domain;
        this.isLightbox = this.bootstrapper.params.isLightbox;

        if (this.isHomeDomain && !this.isReload){
            this.sequenceIndex = parseInt(util.getHashParameter(this.paramMap[params.sequenceIndex], parent.document));
        }

        if (!this.sequenceIndex){
            this.sequenceIndex = parseInt(util.getQuerystringParameter(this.paramMap[params.sequenceIndex])) || 0;
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

        //this.parseManifest();

        this.parseStructure();
    }

    // re-bootstraps the application with new querystring params
    reload(params?: BootstrapParams): void {
        var p = new BootstrapParams();
        p.isReload = true;

        if (params){
            p = $.extend(p, params);
        }

        this.bootstrapper.bootStrap(p);
    }

    corsEnabled(): boolean {
        return Modernizr.cors && !this.jsonp
    }

    reloadManifest(callback: any): void {

        this.rootStructure = null;
        var manifestUri = this.manifestUri;

        manifestUri = this.addTimestamp(manifestUri);

        if (this.corsEnabled()){
            $.getJSON(manifestUri, (data) => {
                this.manifest = data;

                this.load();

                callback();
            });
        } else {
            // use jsonp
            window.manifestCallback = (data: any) => {
                this.manifest = data;

                this.load();

                callback();
            };

            $.ajax(<JQueryAjaxSettings>{
                url: manifestUri,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'manifestCallback'
            });
        }
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

    getAttribution(): string {
        return this.getLocalisedValue(this.manifest.attribution);
    }

    getLicense(): string {
        return this.manifest.license;
    }

    getLogo(): string {
        return this.manifest.logo;
    }

    getTitle(): string {
        return this.manifest.label;
    }

    getSeeAlso(): any {
        return this.manifest.seeAlso;
    }

    getLastCanvasLabel(): string {
        // get the last label that isn't empty or '-'.
        for (var i = this.sequence.canvases.length - 1; i >= 0; i--) {
            var canvas = this.sequence.canvases[i];

            var regExp = /\d/;

            if (regExp.test(canvas.label)) {
                return this.getLocalisedValue(canvas.label);
            }
        }

        // none exists, so return '-'.
        return '-';
    }

    isCanvasIndexOutOfRange(canvasIndex: number): boolean {
        return canvasIndex > this.getTotalCanvases() - 1;
    }

    isFirstCanvas(canvasIndex?: number): boolean {
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;
        return canvasIndex == 0;
    }

    isLastCanvas(canvasIndex?: number): boolean {
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;
        return canvasIndex == this.getTotalCanvases() - 1;
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getCanvasByIndex(index: number): any {
        return this.sequence.canvases[index];
    }

    getStructureByCanvasIndex(index: number): any {
        if (index == -1) return null;
        var canvas = this.getCanvasByIndex(index);
        return this.getCanvasStructure(canvas);
    }

    getCanvasStructure(canvas: any): any {
        // get the deepest structure that this asset belongs to.
        if (canvas.structures){
            return canvas.structures.last();
        }

        return null;
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

    isPaged(): boolean{
        return this.sequence.viewingHint && (this.sequence.viewingHint == "paged") && this.getSettings().pagingEnabled;
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

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        var indices = [];

        if (this.isFirstCanvas(canvasIndex) || this.isLastCanvas(canvasIndex)){
            indices = [canvasIndex];
        } else if (canvasIndex % 2){
            indices = [canvasIndex, canvasIndex + 1];
        } else {
            indices = [canvasIndex - 1, canvasIndex];
        }

        if (this.getViewingDirection() === "right-to-left"){
            return indices.reverse();
        } else {
            return indices;
        }
    }

    getViewingDirection(): string {
        return this.sequence.viewingDirection || "left-to-right";
    }

    getFirstPageIndex(): number {
        return 0;
    }

    getLastPageIndex(): number {
        return this.getTotalCanvases() - 1;
    }

    getPrevPageIndex(canvasIndex?: number): number {
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        var index;

        if (this.isPaged()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.getViewingDirection() == "right-to-left"){
                index = indices.last() - 1;
            } else {
                index = indices[0] - 1;
            }

        } else {
            index = canvasIndex - 1;
        }

        return index;
    }

    getNextPageIndex(canvasIndex?: number): number {
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        var index;

        if (this.isPaged()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.getViewingDirection() == "right-to-left"){
                index = indices[0] + 1;
            } else {
                index = indices.last() + 1;
            }

        } else {
            index = canvasIndex + 1;
        }

        if (index > this.getTotalCanvases() - 1) {
            return -1;
        }

        return index;
    }

    getStartCanvasIndex(): number {
        if (this.sequence.startCanvas) {
            // if there's a startCanvas attribute, loop through the canvases and return the matching index.
            for (var i = 0; i < this.sequence.canvases.length; i++) {
                var canvas = this.sequence.canvases[i];

                if (canvas["@id"] == this.sequence.startCanvas) return i;
            }
        }

        // default to first canvas.
        return 0;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + util.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    getThumbUri(canvas: any, width: number, height: number): string {

        var uri;

        if (canvas.resources){
            uri = canvas.resources[0].resource.service['@id'];
        } else if (canvas.images && canvas.images[0].resource.service){
            uri = canvas.images[0].resource.service['@id'];
        } else {
            return "";
        }

        var tile = 'full/' + width + ',' + height + '/0/default.jpg';

        if (uri.endsWith('/')){
            uri += tile;
        } else {
            uri += '/' + tile;
        }

        return uri;
    }

    getThumbs(width: number, height: number): Thumb[] {
        var thumbs: Thumb[] = [];

        for (var i = 0; i < this.getTotalCanvases(); i++) {
            var canvas = this.sequence.canvases[i];

            var heightRatio = canvas.height / canvas.width;

            if (heightRatio){
                height = Math.floor(width * heightRatio);
            }

            var uri = this.getThumbUri(canvas, width, height);

            thumbs.push(new Thumb(i, uri, this.getLocalisedValue(canvas.label), width, height, true));
        }

        return thumbs;
    }

    getLocalisedValue(prop: any): string {

        if (!(prop instanceof Array)){
            return prop;
        }

        // test for exact match
        for (var i = 0; i < prop.length; i++){
            var value = prop[i];
            var language = value['@language'];

            if (this.locale === language){
                return <string>value['@value'];
            }
        }

        // test for inexact match
        for (var i = 0; i < prop.length; i++){
            var value = prop[i];
            var language = value['@language'];

            var match = this.locale.substr(0, this.locale.indexOf('-'));

            if (language === match){
                return <string>value['@value'];
            }
        }

        return null;
    }

    parseManifest(): void{

    }

    getStructureIndex(path: string): number {
        for (var i = 0; i < this.sequence.canvases.length; i++) {
            var canvas = this.sequence.canvases[i];

            if (!canvas.structures) continue;

            for (var j = 0; j < canvas.structures.length; j++) {
                var structure = canvas.structures[j];

                if (structure.path == path) {
                    return i;
                }
            }
        }

        return null;
    }

    getStructureByPath(path: string): any{
        for (var i = 0; i < this.sequence.canvases.length; i++) {
            var canvas = this.sequence.canvases[i];

            if (!canvas.structures) continue;

            for (var j = 0; j < canvas.structures.length; j++) {
                var structure = canvas.structures[j];

                if (structure.path == path) {
                    return structure;
                }
            }
        }

        return null;
    }

    getCanvasById(id: string): any{
        for (var i = 0; i < this.sequence.canvases.length; i++) {
            var c = this.sequence.canvases[i];

            if (c['@id'] === id){
                return c;
            }
        }

        return null;
    }

    getCanvasIndexById(id: string): number {
        for (var i = 0; i < this.sequence.canvases.length; i++) {
            var c = this.sequence.canvases[i];

            if (c['@id'] === id){
                return i;
            }
        }

        return null;
    }

    getStructureByIndex(structure: any, index: number): any{
        return structure.structures[index];
    }

    getStructureById(id: string): any {
        for (var i = 0; i < this.manifest.structures.length; i++) {
            var s = this.manifest.structures[i];

            if (s['@id'] === id){
                return s;
            }
        }

        return null;
    }

    getCanvasIndexByLabel(label: string): number {
        label = label.trim();

        // trim any preceding zeros.
        if ($.isNumeric(label)) {
            label = parseInt(label, 10).toString();
        }

        var doublePageRegExp = /(\d*)\D+(\d*)/;
        var match, regExp, regStr, labelPart1, labelPart2;

        for (var i = 0; i < this.sequence.canvases.length; i++) {
            var canvas = this.sequence.canvases[i];

            // check if there's a literal match
            if (canvas.label === label) {
                return i;
            }

            // check if there's a match for double-page spreads e.g. 100-101, 100_101, 100 101
            match = doublePageRegExp.exec(label);

            if (!match) continue;

            labelPart1 = match[1];
            labelPart2 = match[2];

            if (!labelPart2) continue;

            regStr = "^" + labelPart1 + "\\D+" + labelPart2 + "$";

            regExp = new RegExp(regStr);

            if (regExp.test(canvas.label)) {
                return i;
            }
        }

        return -1;
    }

    // todo
    getManifestSeeAlsoUri(manifest: any): string{
        return null;
    }

    getRootStructure(): any {

        // loop through structures looking for viewingHint="top"
        if (this.manifest.structures){
            for (var i = 0; i < this.manifest.structures.length; i++){
                var s = this.manifest.structures[i];
                if (s.viewingHint == "top"){
                    this.rootStructure = s;
                    break;
                }
            }
        }

        if (!this.rootStructure){
            this.rootStructure = {
                path: "",
                ranges: this.manifest.structures
            };
        }

        return this.rootStructure;
    }

    parseStructure(): void {
        if (!this.manifest.structures || !this.manifest.structures.length) return;

        this.parseStructures(this.getRootStructure(), '');
    }

    // the purpose of this is to give each canvas in sequence.canvases
    // a collection of structures it belongs to.
    // it also builds a path string property for each structure
    // that can be used when a node is clicked in the tree view
    parseStructures(structure: any, path: string): void{

        structure.path = path;

        if (structure.canvases){
            // loop through canvases and associate with matching @id
            for (var j = 0; j < structure.canvases.length; j++){

                //console.log("canvas");

                var canvas = structure.canvases[j];

                if (typeof(canvas) === "string"){
                    canvas = this.getCanvasById(canvas);
                }

                if (!canvas){
                    // canvas not found - json invalid.
                    structure.canvases[j] = null;
                    continue;
                }

                if (!canvas.structures) canvas.structures = [];

                canvas.structures.push(structure);
                // create two-way relationship
                structure.canvases[j] = canvas;
            }
        }

        if (structure.ranges) {
            structure.structures = [];

            for (var k = 0; k < structure.ranges.length; k++) {
                var s = structure.ranges[k];

                //console.log("range: ", s);

                // if it's a url ref
                if (typeof(s) === "string"){
                    s = this.getStructureById(s);
                }

                // if this structure already has a parent, continue.
                if (s.parentStructure) continue;

                s.parentStructure = structure;

                structure.structures.push(s);

                this.parseStructures(s, path + '/' + k);
            }
        }
    }

    getTree(): TreeNode{
        var rootStructure = this.getRootStructure();

        this.treeRoot = new TreeNode('root');
        this.treeRoot.label = "root";
        this.treeRoot.data = rootStructure;
        this.treeRoot.data.type = "manifest";
        rootStructure.treeNode = this.treeRoot;

        if (rootStructure.structures){
            for (var i = 0; i < rootStructure.structures.length; i++){
                var structure = rootStructure.structures[i];

                var node = new TreeNode();
                this.treeRoot.addNode(node);

                this.parseTreeNode(node, structure);
            }
        }

        return this.treeRoot;
    }

    parseTreeNode(node: TreeNode, structure: any): void {
        node.label = this.getLocalisedValue(structure.label);
        node.data = structure;
        node.data.type = "structure";
        structure.treeNode = node;

        if (structure.structures) {

            for (var i = 0; i < structure.structures.length; i++) {
                var childStructure = structure.structures[i];

                var childNode = new TreeNode();
                node.addNode(childNode);

                this.parseTreeNode(childNode, childStructure);
            }
        }
    }

    getDomain(): string{
        var parts = util.getUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getMetaData(callback: (data: any) => any, includeRootProperties?: boolean): void{
        var metaData: Object[] = this.manifest.metadata;

        if (metaData && includeRootProperties){
            if (this.manifest.description) metaData.push({ "label": "description", "value": this.manifest.description});
            if (this.manifest.attribution) metaData.push({ "label": "attribution", "value": this.manifest.attribution});
            if (this.manifest.license) metaData.push({ "label": "license", "value": this.manifest.license});
            if (this.manifest.logo) metaData.push({ "label": "logo", "value": '<img src="' + this.manifest.logo + '"/>'});
        }

        callback(this.manifest.metadata);
    }

    defaultToThumbsView(): boolean{
        var manifestType = this.getManifestType();

        switch (manifestType){
            case 'monograph':
                if (!this.isMultiSequence()) return true;
                break;
            case 'archive':
                return true;
                break;
            case 'boundmanuscript':
                return true;
                break;
            case 'artwork':
                return true;

        }

        var sequenceType = this.getSequenceType();

        switch (sequenceType){
            case 'application-pdf':
                return true;
                break;
        }

        return false;
    }

    getSettings(): ISettings {
        return this.config.options;
    }

    updateSettings(settings: ISettings): void {
        this.config.options = settings;
    }

    sanitize(html: string): string {
        var elem = document.createElement('div');
        var $elem = $(elem);

        $elem.html(html);

        var s = new Sanitize({
            elements:   ['a', 'b', 'br', 'img', 'p', 'i', 'span'],
            attributes: {
                a: ['href'],
                img: ['src', 'alt']
            },
            protocols:  {
                a: { href: ['http', 'https'] }
            }
        });

        $elem.html(s.clean_node(elem));

        return $elem.html();
    }

    getLocales(): any[] {
        if (this.locales) return this.locales;

        // use data-locales to prioritise
        var items = this.config.localisation.locales.clone();
        var sorting = this.bootstrapper.params.locales;
        var result = [];

        // loop through sorting array
        // if items contains sort item, add it to results.
        // if sort item has a label, substitute it
        // mark item as added.
        // loop through remaining items and add to results.

        _.each(sorting, (sortItem: any) => {
            var match = _.filter(items, (item: any) => { return item.name === sortItem.name; });
            if (match.length){
                var m: any = match[0];
                if (sortItem.label) m.label = sortItem.label;
                m.added = true;
                result.push(m);
            }
        });

        _.each(items, (item: any) => {
            if (!item.added){
                result.push(item);
            }
            delete item.added;
        });

        return this.locales = result;
    }

    getAlternateLocale(): any {
        var locales = this.getLocales();

        var alternateLocale;

        for (var i = 0; i < locales.length; i++) {
            var l = locales[i];
            if (l.name !== this.locale) {
                alternateLocale = l;
            }
        }

        return l;
    }

    changeLocale(locale: string): void {
        // if the current locale is "en-GB:English,cy-GB:Welsh"
        // and "cy-GB" is passed, it becomes "cy-GB:Welsh,en-GB:English"

        // re-order locales so the passed locale is first
        var locales = this.locales.clone();

        var index = locales.indexOfTest((l: any) => {
            return l.name === locale;
        });

        locales.move(index, 0);

        // convert to comma-separated string
        var str = this.serializeLocales(locales);

        var p = new BootstrapParams();
        p.setLocale(str);
        this.reload(p);
    }

    serializeLocales(locales: any[]): string {
        var str = '';

        for (var i = 0; i < locales.length; i++){
            var l = locales[i];
            if (i > 0) str += ',';
            str += l.name;
            if (l.label){
                str += ':' + l.label;
            }
        }

        return str;
    }

    getSerializedLocales(): string {
        return this.serializeLocales(this.locales);
    }
}