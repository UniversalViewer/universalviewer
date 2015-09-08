import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ExternalResource = require("./ExternalResource");
import IProvider = require("./IProvider");
import Params = require("../../Params");
import Storage = require("./Storage");

// providers contain methods that could be implemented differently according
// to factors like varying back end data provision systems.
// they provide a consistent interface and set of data structures
// for extensions to operate against.
class BaseProvider implements IProvider{

    bootstrapper: BootStrapper;
    canvasIndex: number;
    collectionIndex: number;
    config: any;
    domain: string;
    embedDomain: string;
    embedScriptUri: string;
    iiifResource: Manifesto.IIIIFResource;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    jsonp: boolean;
    locale: string;
    locales: any[];
    manifest: Manifesto.IManifest;
    manifestIndex: number;
    manifestUri: string;
    resources: Manifesto.IExternalResource[];
    sequenceIndex: number;

    options: any = {
        thumbsUriTemplate: "{0}{1}",
        timestampUris: false,
        mediaUriTemplate: "{0}{1}"
    };

    constructor(bootstrapper: BootStrapper) {
        this.bootstrapper = bootstrapper;
        this.config = this.bootstrapper.config;
        this.iiifResource = this.bootstrapper.iiifResource;
        this.manifest = this.bootstrapper.manifest;

        // get data-attributes that can't be overridden by hash params.
        // other data-attributes are retrieved through extension.getParam.

        // todo: make these getters when ES5 target is available
        this.manifestUri = this.bootstrapper.params.manifestUri;
        this.jsonp = this.bootstrapper.params.jsonp;
        this.locale = this.bootstrapper.params.getLocaleName();
        this.isHomeDomain = this.bootstrapper.params.isHomeDomain;
        this.isReload = this.bootstrapper.params.isReload;
        this.embedDomain = this.bootstrapper.params.embedDomain;
        this.isOnlyInstance = this.bootstrapper.params.isOnlyInstance;
        this.embedScriptUri = this.bootstrapper.params.embedScriptUri;
        this.domain = this.bootstrapper.params.domain;
        this.isLightbox = this.bootstrapper.params.isLightbox;

        this.collectionIndex = this.bootstrapper.params.collectionIndex;
        this.manifestIndex = this.bootstrapper.params.manifestIndex;
        this.sequenceIndex = this.bootstrapper.params.sequenceIndex;
        this.canvasIndex = this.bootstrapper.params.canvasIndex;
    }

    // re-bootstraps the application with new querystring params
    reload(params?: BootstrapParams): void {
        var p = new BootstrapParams();

        if (params){
            p = $.extend(p, params);
        }

        p.isReload = true;

        $.disposePubSub();

        this.bootstrapper.bootStrap(p);
    }

    getCollectionIndex(iiifResource: Manifesto.IIIIFResource): number {
        // todo: support nested collections. walk up parents adding to array and return csv string.
        return iiifResource.parentCollection.index;
    }

    getManifestType(): Manifesto.ManifestType{
        var manifestType = this.manifest.getManifestType();

        // default to monograph
        if (manifestType.toString() === ""){
            manifestType = manifesto.ManifestType.monograph();
        }

        return manifestType;
    }

    getCanvasIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.canvasIndex);
    }

    getSequenceIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.sequenceIndex);
    }

    getCanvasType(canvas?: Manifesto.ICanvas): Manifesto.CanvasType {
        if (!canvas){
            canvas = this.getCurrentCanvas();
        }
        return canvas.getType();
    }

    getAttribution(): string {
        return this.manifest.getAttribution();
    }

    getLicense(): string {
        return this.manifest.getLicense();
    }

    getLogo(): string {
        return this.manifest.getLogo();
    }

    getTitle(): string {
        return this.manifest.getTitle();
    }

    getSeeAlso(): any {
        return this.manifest.getSeeAlso();
    }

    isMultiSequence(): boolean{
        return this.manifest.isMultiSequence();
    }

    getLastCanvasLabel(): string {
        return this.getCurrentSequence().getLastCanvasLabel();
    }

    isCanvasIndexOutOfRange(index: number): boolean {
        return this.getCurrentSequence().isCanvasIndexOutOfRange(index);
    }

    isTotalCanvasesEven(): boolean {
        return this.getCurrentSequence().isTotalCanvasesEven();
    }

    isFirstCanvas(index?: number): boolean {
        return this.getCurrentSequence().isFirstCanvas(index);
    }

    isLastCanvas(index?: number): boolean {
        return this.getCurrentSequence().isLastCanvas(index);
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getCanvasByIndex(index: number): Manifesto.ICanvas {
        return this.getCurrentSequence().getCanvasByIndex(index);
    }

    getSequenceByIndex(index: number): Manifesto.ISequence {
        return this.manifest.getSequenceByIndex(index);
    }

    getCurrentCanvas(): any {
        return this.getCurrentSequence().getCanvasByIndex(this.canvasIndex);
    }

    getCurrentSequence(): any {
        return this.getSequenceByIndex(this.sequenceIndex);
    }

    getTotalCanvases(): number{
        return this.getCurrentSequence().getTotalCanvases();
    }

    isMultiCanvas(): boolean{
        return this.getCurrentSequence().isMultiCanvas();
    }

    isPagingAvailable(): boolean {
        // paged mode is useless unless you have at least 3 pages...
        return this.isPagingEnabled() && this.getTotalCanvases() > 2;
    }

    isPagingEnabled(): boolean{
        return this.getCurrentSequence().isPagingEnabled();
    }

    isPagingSettingEnabled(): boolean {
        if (this.isPagingAvailable()){
            return this.getSettings().pagingEnabled;
        }

        return false;
    }

    getInfoUri(canvas: Manifesto.ICanvas): string{
        // default to IxIF
        var service = canvas.getService(manifesto.ServiceProfile.ixif());
        return service.getInfoUri();
    }

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        return [canvasIndex];
    }

    getViewingDirection(): Manifesto.ViewingDirection {
        return this.getCurrentSequence().getViewingDirection();
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

        if (this.isPagingSettingEnabled()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.getViewingDirection().toString() === manifesto.ViewingDirection.rightToLeft().toString()){
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

        if (this.isPagingSettingEnabled()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.getViewingDirection().toString() === manifesto.ViewingDirection.rightToLeft().toString()){
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
        return this.getCurrentSequence().getStartCanvasIndex();
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + Utils.Dates.GetTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    getThumbs(width: number, height: number): Manifesto.Thumb[] {
        return this.getCurrentSequence().getThumbs(width, height);
    }

    getRangeByPath(path: string): any{
        return this.manifest.getRangeByPath(path);
    }

    getCanvasIndexById(id: string): number {
        return this.getCurrentSequence().getCanvasIndexById(id);
    }

    getCanvasIndexByLabel(label: string): number {
        var foliated = this.getManifestType().toString() === manifesto.ManifestType.manuscript().toString();
        return this.getCurrentSequence().getCanvasIndexByLabel(label, foliated);
    }

    getTree(): Manifesto.TreeNode{
        return this.iiifResource.getTree();
    }

    getDomain(): string{
        var parts = Utils.Urls.GetUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getMetadata(): any{
        var metadata = this.manifest.getMetadata();

        if (this.manifest.getDescription()){
            metadata.unshift({
                "label": "description",
                "value": this.manifest.getDescription()
            });
        }

        if (this.manifest.getAttribution()){
            metadata.unshift({
                "label": "attribution",
                "value": this.manifest.getAttribution()
            });
        }

        if (this.manifest.getLicense()){
            metadata.unshift({
                "label": "license",
                "value": this.manifest.getLicense()
            });
        }

        if (this.manifest.getLogo()){
            metadata.push({
                "label": "logo",
                "value": '<img src="' + this.manifest.getLogo() + '"/>'});
        }

        return metadata;
    }

    defaultToThumbsView(): boolean{
        switch (this.getManifestType().toString()){
            case manifesto.ManifestType.monograph().toString():
                if (!this.isMultiSequence()) return true;
                break;
            //case 'archive':
            //    return true;
            //    break;
            //case 'boundmanuscript':
            //    return true;
            //    break;
            //case 'artwork':
            //    return true;
        }

        // todo: use rendering?
        //var sequenceType = this.getSequenceType();
        //
        //switch (sequenceType){
        //    case 'application-pdf':
        //        return true;
        //        break;
        //}

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

export = BaseProvider;