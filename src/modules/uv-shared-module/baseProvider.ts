/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import utils = require("../../utils");
import IProvider = require("./iProvider");
import TreeNode = require("./treeNode");
import Thumb = require("./thumb");
import BootStrapper = require("../../bootstrapper");
import BootstrapParams = require("../../bootstrapParams");
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

// todo: delete this legacy class, rename BaseIIIFProvider to BaseProvider
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
    sequence: any;
    sequenceIndex: number;
    sectionsRootNode: TreeNode;
    treeRoot: TreeNode;
    jsonp: boolean;
    locale: string;
    locales: any[];

    // map param names to enum indices.
    paramMap: string[] = ['asi', 'ai', 'z', 'r'];

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

        // nothing selected yet.
        this.canvasIndex = -1;

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

        var manifestUri = this.manifestUri;

        if (this.options.dataBaseUri){
            manifestUri = this.options.dataBaseUri + this.manifestUri;
        }

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

    getManifestType(): string{
        return this.getRootStructure().sectionType.toLowerCase();
    }

    getManifestation(type: string): string {
        var service = this.sequence.service;

        if (service && service["profile"] === "http://iiif.io/api/otherManifestations.json"){
            if (service.format.endsWith("pdf")){
                return service["@id"];
            }
        }
    }

    getSequenceType(): string{
        return this.sequence.assetType.replace('/', '-');
    }

    getAttribution(): string {
        return this.manifest.attribution;
    }

    getLicense(): string {
        return this.manifest.license;
    }

    getLogo(): string {
        return this.manifest.logo;
    }

    getRootStructure(): any {
        return this.sequence.rootSection;
    }

    getTitle(): string {
        return this.getRootStructure().title;
    }

    getSeeAlso(): any {
        return this.sequence.seeAlso;
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
        return this.sequence.assets[index];
    }

    // todo
    getCanvasIndexById(id: string): number {
        return null;
    }

    getCurrentCanvas(): any {
        return this.sequence.assets[this.canvasIndex];
    }

    getTotalCanvases(): number{
        return this.sequence.assets.length;
    }

    isMultiCanvas(): boolean{
        return this.sequence.assets.length > 1;
    }

    isMultiSequence(): boolean{
        return this.manifest.assetSequences.length > 1;
    }

    isPaged(): boolean{
        // not applicable to non-iiif manifest.
        return false;
    }

    getMediaUri(mediaUri: string): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, mediaUri);

        return uri;
    }

    setMediaUri(canvas: any): void{
        if (canvas.mediaUri){
            canvas.mediaUri = this.getMediaUri(canvas.mediaUri);
        } else {
            canvas.mediaUri = this.getMediaUri(canvas.fileUri);
        }
    }

    // todo
    getThumbUri(canvas: any, width: number, height: number): string {
        return null;
    }

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        if (this.isFirstCanvas() || this.isLastCanvas()){
            return [canvasIndex];
        } else if (canvasIndex % 2){
            return [canvasIndex, canvasIndex + 1];
        } else {
            return [canvasIndex - 1, canvasIndex];
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
            index = indices[0] - 1;
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
            index = indices.last() + 1;
        } else {
            index = canvasIndex + 1;
        }

        if (index > this.getTotalCanvases() - 1) {
            return -1;
        }

        return index;
    }

    getStartCanvasIndex(): number {
        return 0;
    }

    parseManifest(): void{
        this.parseManifestation(this.manifest.rootStructure, this.manifest.assetSequences, '');
    }

    // manifestations are called "structures" in the legacy format.
    parseManifestation(structure: any, sequences: any[], path: string): void {

        structure.path = path;

        if (typeof(structure.assetSequence) != 'undefined') {

            var sequence = sequences[structure.assetSequence];

            sequence.index = structure.sequence;
            sequence.structure = structure;
            structure.sequence = sequence;
        }

        if (structure.structures) {
            for (var j = 0; j < structure.structures.length; j++) {
                this.parseManifestation(structure.structures[j], sequences, path + '/' + j);
            }
        }
    }

    parseStructure(): void{
        this.parseStructures(this.getRootStructure(), this.sequence.assets, '');
    }

    // the purpose of this is to give each asset in assetSequence.assets
    // a collection of sections it belongs to.
    // it also builds a path string property for each section.
    // this can then be used when a section is clicked in the tree view
    // where getSectionIndex loops though all assets and their
    // associated sections until it finds one with a matching path.
    // (structures/ranges in iiif are called sections in the legacy format)
    parseStructures(structure: any, canvases: any[], path: string): void {

        structure.path = path;

        // replace structureType with config.js mapping (if exists).
        structure.sectionType = this.replaceStructureType(structure.sectionType);

        for (var i = 0; i < structure.assets.length; i++) {
            var index = structure.assets[i];

            var canvas = canvases[index];

            if (!canvas.structures) canvas.structures = [];

            canvas.structures.push(structure);
        }

        if (structure.sections) {
            for (var j = 0; j < structure.sections.length; j++) {
                this.parseStructures(structure.sections[j], canvases, path + '/' + j);
            }
        }
    }

    replaceStructureType(structureType: string): string {
        if (this.config.options.sectionMappings && this.config.options.sectionMappings[structureType]) {
            return this.config.options.sectionMappings[structureType];
        }

        return structureType;
    }

    getStructureByCanvasIndex(index: number): any {
        if (index == -1) return null;
        var canvas = this.getCanvasByIndex(index);
        return this.getCanvasStructure(canvas);
    }

    getStructureByIndex(structure: any, index: number): any{
        return structure.sections[index];
    }

    // todo
    getStructureByPath(path: string): any{
        return null;
    }

    getCanvasStructure(canvas: any): any {
        // get the deepest structure that this file belongs to.
        return canvas.structures.last();
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

    getStructureIndex(path: string): number {

        for (var i = 0; i < this.sequence.assets.length; i++) {
            var canvas = this.sequence.assets[i];
            for (var j = 0; j < canvas.structures.length; j++) {
                var structure = canvas.structures[j];

                if (structure.path == path) {
                    return i;
                }
            }
        }

        return null;
    }

    getCanvasIndexByLabel(label: string): number {

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

    getManifestSeeAlsoUri(manifest: any): string{
        if (manifest.seeAlso && manifest.seeAlso.tag && manifest.seeAlso.data){
            if (manifest.seeAlso.tag === 'OpenExternal'){
                return this.getMediaUri(manifest.seeAlso.data);
            }
        }
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + util.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    getTree(): TreeNode{
        this.treeRoot = new TreeNode('root');
        var rootStructure = this.manifest.rootStructure;

        if (rootStructure) {
            this.parseTreeStructure(this.treeRoot, rootStructure);
        }

        // if there aren't any structures then the sectionsRootNode won't have been created.
        if (!this.sectionsRootNode) {
            this.sectionsRootNode = this.treeRoot;
            this.sectionsRootNode.data = this.sequence.rootSection;
        }

        if (this.sequence.rootSection.sections){
            for (var i = 0; i < this.sequence.rootSection.sections.length; i++) {
                var section = this.sequence.rootSection.sections[i];

                var childNode = new TreeNode();
                this.sectionsRootNode.addNode(childNode);

                this.parseTreeSection(childNode, section);
            }
        }

        return this.treeRoot;
    }

    // manifestations
    parseTreeStructure(node: TreeNode, structure: any): void {
        node.label = structure.name || "root";
        node.data = structure;
        node.data.type = "manifest";
        node.data.treeNode = node;

        // if this is the structure node that contains the assetSequence.
        if (this.sequence.structure == structure) {
            this.sectionsRootNode = node;
            this.sectionsRootNode.selected = true;
            this.sectionsRootNode.expanded = true;
        }

        if (structure.structures) {

            for (var i = 0; i < structure.structures.length; i++) {
                var childStructure = structure.structures[i];

                var childNode = new TreeNode();
                node.addNode(childNode);

                this.parseTreeStructure(childNode, childStructure);
            }
        }
    }

    // structures
    parseTreeSection(node: TreeNode, section: any): void {
        node.label = section.sectionType;
        node.data = section;
        node.data.type = "structure";
        node.data.treeNode = node;

        if (section.sections) {

            for (var i = 0; i < section.sections.length; i++) {
                var childSection = section.sections[i];

                var childNode = new TreeNode();
                node.addNode(childNode);

                this.parseTreeSection(childNode, childSection);
            }
        }
    }

    // todo
    getThumbs(width: number, height: number): Thumb[]{
        return null;
    }

    getDomain(): string{
        var parts = util.getUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getMetaData(callback: (data: any) => any): void{
        callback(null);
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
        var elem = document.createDocumentFragment();
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

        return $elem.contents().html();
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

    getLabel(resource): string {
        return null;
    }

    getLocalisedValue(values: any[]): string {
        return null;
    }
}