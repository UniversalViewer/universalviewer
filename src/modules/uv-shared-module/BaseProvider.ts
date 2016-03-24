import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ExternalResource = require("./ExternalResource");
import IMetadataItem = require("./IMetadataItem");
import IProvider = require("./IProvider");
import Params = require("../../Params");
import UriLabeller = require("./UriLabeller");
import IRange = require("./IRange");
import ICanvas = require("./ICanvas");

// providers contain methods that could be implemented differently according
// to factors like varying back end data provisioning systems.
// todo: expose the provider as an external API to the containing page.
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
    licenseFormatter: UriLabeller;
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

        this.licenseFormatter = new UriLabeller(this.config.license ? this.config.license : {});
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
        var index: number;
        if (iiifResource.parentCollection) {
            index = iiifResource.parentCollection.index;
        }
        return index;
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

    getLastCanvasLabel(alphanumeric?: boolean): string {
        return this.getCurrentSequence().getLastCanvasLabel(alphanumeric);
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

    getCanvases(): Manifesto.ICanvas[] {
        return this.getCurrentSequence().getCanvases();
    }

    getCanvasById(id: string): Manifesto.ICanvas {
        return this.getCurrentSequence().getCanvasById(id);
    }

    getCanvasesById(ids: string[]): Manifesto.ICanvas[] {
        var canvases: Manifesto.ICanvas[] = [];

        for (var i = 0; i < ids.length; i++) {
            var id: string = ids[i];
            canvases.push(this.getCanvasById(id));
        }

        return canvases;
    }

    getCanvasByIndex(index: number): Manifesto.ICanvas {
        return this.getCurrentSequence().getCanvasByIndex(index);
    }

    getSequenceByIndex(index: number): Manifesto.ISequence {
        return this.manifest.getSequenceByIndex(index);
    }

    getCanvasRange(canvas: Manifesto.ICanvas): Manifesto.IRange {
        // get ranges that contain the canvas id. return the last.
        return this.getCanvasRanges(canvas).last();
    }

    getCanvasRanges(canvas: Manifesto.ICanvas): Manifesto.IRange[] {

        if (canvas.ranges){
            return canvas.ranges;
        } else {
            canvas.ranges = <IRange[]>this.manifest.getRanges().en().where(range => (range.getCanvasIds().en().any(c => c === canvas.id))).toArray();
        }

        return canvas.ranges;
    }

    getCurrentCanvas(): Manifesto.ICanvas {
        return this.getCurrentSequence().getCanvasByIndex(this.canvasIndex);
    }

    getCurrentSequence(): Manifesto.ISequence {
        return this.getSequenceByIndex(this.sequenceIndex);
    }

    getRangeCanvases(range: Manifesto.IRange): Manifesto.ICanvas[] {
        var ids: string[] = range.getCanvasIds();
        return this.getCanvasesById(ids);
    }

    getTotalCanvases(): number{
        return this.getCurrentSequence().getTotalCanvases();
    }

    isMultiCanvas(): boolean{
        return this.getCurrentSequence().isMultiCanvas();
    }

    getInfoUri(canvas: Manifesto.ICanvas): string{
        // default to IxIF
        var service = canvas.getService(manifesto.ServiceProfile.ixif());

        if (service){ // todo: deprecate
            return service.getInfoUri();
        }

        // return the canvas id.
        return canvas.id;
    }

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        return [canvasIndex];
    }

    getViewingDirection(): Manifesto.ViewingDirection {
        var viewingDirection: Manifesto.ViewingDirection = this.getCurrentSequence().getViewingDirection();

        if (!viewingDirection.toString()) {
            viewingDirection = this.manifest.getViewingDirection();
        }

        return viewingDirection;
    }

    getViewingHint(): Manifesto.ViewingHint {
        var viewingHint: Manifesto.ViewingHint = this.getCurrentSequence().getViewingHint();

        if (!viewingHint.toString()) {
            viewingHint = this.manifest.getViewingHint();
        }

        return viewingHint;
    }

    getFirstPageIndex(): number {
        return 0;
    }

    getLastPageIndex(): number {
        return this.getTotalCanvases() - 1;
    }

    getStartCanvasIndex(): number {
        return this.getCurrentSequence().getStartCanvasIndex();
    }

    getShareUrl(): string {
        if (Utils.Documents.IsInIFrame()){
            return parent.document.location.href;
        }

        return document.location.href;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + Utils.Dates.GetTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    getThumbs(width: number, height: number): Manifesto.IThumb[] {
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

    getRanges(): IRange[] {
        return <IRange[]>(<Manifesto.IManifest>this.manifest).getRanges();
    }

    getTree(): Manifesto.ITreeNode{
        return this.iiifResource.getTree();
    }

    getDomain(): string{
        var parts = Utils.Urls.GetUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getMetadata(): IMetadataItem[] {
        var result: IMetadataItem[] = [];

        var metadata = this.manifest.getMetadata();

        if (metadata){
            result.push(<IMetadataItem>{
                label: "metadata",
                value: metadata,
                isRootLevel: true
            });
        }

        if (this.manifest.getDescription()){
            result.push(<IMetadataItem>{
                label: "description",
                value: this.manifest.getDescription(),
                isRootLevel: true
            });
        }

        if (this.manifest.getAttribution()){
            result.push(<IMetadataItem>{
                label: "attribution",
                value: this.manifest.getAttribution(),
                isRootLevel: true
            });
        }

        if (this.manifest.getLicense()){
            result.push(<IMetadataItem>{
                label: "license",
                value: this.licenseFormatter.format(this.manifest.getLicense()),
                isRootLevel: true
            });
        }

        if (this.manifest.getLogo()){
            result.push(<IMetadataItem>{
                label: "logo",
                value: '<img src="' + this.manifest.getLogo() + '"/>',
                isRootLevel: true
            });
        }

        return result;
    }
    
    getCanvasMetadata(canvas: Manifesto.ICanvas): IMetadataItem[] {
        var result: IMetadataItem[] = [];

        var metadata = canvas.getMetadata();

        if (metadata){
            result.push(<IMetadataItem>{
                label: "metadata",
                value: metadata,
                isRootLevel: true
            });
        }

        return result;
    }

    defaultToThumbsView(): boolean{
        switch (this.getManifestType().toString()){
            case manifesto.ManifestType.monograph().toString():
                if (!this.isMultiSequence()) return true;
                break;
            case manifesto.ManifestType.manuscript().toString():
                if (!this.isMultiSequence()) return true;
                break;
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
        if (Utils.Bools.GetBool(this.config.options.saveUserSettings, false)) {
            var settings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            
            if (settings)
                return $.extend(this.config.options, settings.value);
        }
        
        return this.config.options;
    }

    updateSettings(settings: ISettings): void {
        if (Utils.Bools.GetBool(this.config.options.saveUserSettings, false)) {
            var storedSettings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            if (storedSettings)
                settings = $.extend(storedSettings.value, settings);
                
            //store for ten years
            Utils.Storage.set("uv.settings", settings, 315360000, Utils.StorageType.local);
        }
        
        this.config.options = $.extend(this.config.options, settings);
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
        // if limitLocales is disabled,
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

        var limitLocales: boolean = Utils.Bools.GetBool(this.config.options.limitLocales, false);

        if (!limitLocales){
            _.each(items, (item: any) => {
                if (!item.added){
                    result.push(item);
                }
                delete item.added;
            });
        }

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