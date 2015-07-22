import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import CanvasType = require("./CanvasType");
import IAccessToken = require("./IAccessToken");
import IProvider = require("./IProvider");
import Params = require("./Params");
import Resource = require("./Resource");
import Session = require("./Session");

// providers contain methods that could be implemented differently according
// to factors like varying back end data provision systems.
// they provide a consistent interface and set of data structures
// for extensions to operate against.
class BaseProvider implements IProvider{

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
    manifest: Manifesto.IManifest;
    rootStructure: any;
    sequence: Manifesto.ISequence;
    sequenceIndex: number;
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

    constructor(bootstrapper: BootStrapper) {
        this.bootstrapper = bootstrapper;
        this.config = this.bootstrapper.config;
        this.manifest = manifesto.parse(JSON.stringify(this.bootstrapper.manifest));

        // get data-attributes that can't be overridden by hash params.
        // other data-attributes are retrieved through app.getParam.

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

        if (this.isHomeDomain && !this.isReload){
            this.sequenceIndex = parseInt(Utils.Urls.GetHashParameter(this.paramMap[Params.sequenceIndex], parent.document));
        }

        if (!this.sequenceIndex){
            this.sequenceIndex = parseInt(Utils.Urls.GetQuerystringParameter(this.paramMap[Params.sequenceIndex])) || 0;
        }
    }

    load(): void{
        // we know that this sequence exists because the bootstrapper
        // will have loaded it already.
        this.sequence = this.manifest.getSequenceByIndex(this.sequenceIndex);

        // replace all ref sequences with an object that can store
        // its path and sub structures. they won't get used for anything
        // else without a reload.
        //for (var i = 0; i < this.manifest.sequences.length; i++) {
        //    if (!this.manifest.sequences[i].canvases) {
        //        this.manifest.sequences[i] = {};
        //    }
        //}

        //this.parseManifest();

        //this.parseStructure();
    }

    // re-bootstraps the application with new querystring params
    reload(params?: BootstrapParams): void {
        var p = new BootstrapParams();
        p.isReload = true;

        if (params){
            p = $.extend(p, params);
        }

        $.disposePubSub();

        this.bootstrapper.bootStrap(p);
    }

    corsEnabled(): boolean {
        // No jsonp setting? Then use autodetection. Otherwise, use explicit setting.
        return (null === this.jsonp) ? Modernizr.cors : !this.jsonp;
    }

    // todo: should this inspect a viewingHint?
    getManifestType(): string{
        return 'monograph';
    }

    getService(resource: any, profile: Manifesto.ServiceProfile | string): Manifesto.IService {
        return this.manifest.getService(resource, profile);
    }

    getRendering(resource: any, format: Manifesto.RenderingFormat | string): Manifesto.IRendering {
        return this.manifest.getRendering(resource, format);
    }

    getRenderings(resource: any): Manifesto.IRendering[] {
        return this.manifest.getRenderings(resource);
    }

    getSequenceType(): string{
        // todo: use viewingHint attribute?
        // default to 'seadragon-iiif'
        return 'seadragon-iiif';
    }

    getCanvasType(canvas?: Manifesto.ICanvas): Manifesto.CanvasType {
        return canvas.type;
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
        return this.sequence.getLastCanvasLabel();
    }

    isCanvasIndexOutOfRange(index: number): boolean {
        return this.sequence.isCanvasIndexOutOfRange(index);
    }

    isTotalCanvasesEven(): boolean {
        return this.sequence.isTotalCanvasesEven();
    }

    isFirstCanvas(index?: number): boolean {
        return this.sequence.isFirstCanvas(index);
    }

    isLastCanvas(index?: number): boolean {
        return this.sequence.isLastCanvas(index);
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getCanvasByIndex(index: number): Manifesto.Canvas {
        return this.sequence.getCanvasByIndex(index);
    }

    getRangeByCanvasIndex(index: number): any {
        if (index === -1) return null;
        var canvas: Manifesto.ICanvas = this.getCanvasByIndex(index);
        return canvas.getRange();
    }

    // todo: call directly
    //getCanvasRange(canvas: any): any {
    //    return canvas.getRange();
    //}

    getCurrentCanvas(): any {
        return this.sequence.getCanvasByIndex(this.canvasIndex);
    }

    getTotalCanvases(): number{
        return this.sequence.getTotalCanvases();
    }

    isMultiCanvas(): boolean{
        return this.sequence.isMultiCanvas();
    }

    isPagingEnabled(): boolean{
        return this.sequence.isPagingEnabled();
    }

    isPagingSettingEnabled(): boolean {
        if (this.isPagingEnabled()){
            return this.getSettings().pagingEnabled;
        }

        return false;
    }

    //getMediaUri(mediaUri: string): string{
    //    var baseUri = this.options.mediaBaseUri || "";
    //    var template = this.options.mediaUriTemplate;
    //    var uri = String.format(template, baseUri, mediaUri);
    //
    //    return uri;
    //}

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        var indices = [];

        if (!this.isPagingSettingEnabled()) {
            indices.push(this.canvasIndex);
        } else {
            if (this.isFirstCanvas(canvasIndex) || (this.isLastCanvas(canvasIndex) && this.isTotalCanvasesEven())){
                indices = [canvasIndex];
            } else if (canvasIndex % 2){
                indices = [canvasIndex, canvasIndex + 1];
            } else {
                indices = [canvasIndex - 1, canvasIndex];
            }

            // todo: use manifesto.ViewingDirection.rightToLeft.toString()
            if (this.getViewingDirection().toString() === "right-to-left"){
                indices = indices.reverse();
            }
        }

        return indices;
    }

    getViewingDirection(): Manifesto.ViewingDirection {
        return this.sequence.getViewingDirection();
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

            if (this.getViewingDirection().toString() === Manifesto.ViewingDirection.rightToLeft.toString()){
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

            if (this.getViewingDirection().toString() === Manifesto.ViewingDirection.rightToLeft.toString()){
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
        return this.sequence.getStartCanvasIndex();
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + Utils.Dates.GetTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    // todo: call directly
    getThumbUri(canvas: Manifesto.ICanvas, width: number, height: number): string {
        return canvas.getThumbUri(width, height);
    }

    getThumbs(width: number, height: number): Manifesto.Thumb[] {
        return this.sequence.getThumbs(width, height);
    }

    getLocalisedValue(prop: any): string {
        return this.manifest.getLocalisedValue(prop, this.locale);
    }

    getRangeByPath(path: string): any{
        return this.manifest.getRangeByPath(path);
    }

    getCanvasById(id: string): any{
        return this.sequence.getCanvasById(id);
    }

    getCanvasIndexById(id: string): number {
        return this.sequence.getCanvasIndexById(id);
    }

    getCanvasIndexByLabel(label: string): number {
        return this.sequence.getCanvasIndexByLabel(label);
    }

    getTree(): Manifesto.TreeNode{
        return this.manifest.getTree();
    }

    getDomain(): string{
        var parts = Utils.Urls.GetUrlParts(this.manifestUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getMetadata(includeRootProperties?: boolean): any{
        return this.manifest.getMetadata(includeRootProperties);
    }

    // todo: is this still needed?
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

    loadResource(resource: Resource,
                 login: (loginService: string) => Promise<void>,
                 getAccessToken: (tokenServiceUrl: string) => Promise<IAccessToken>,
                 storeAccessToken: (resource: Resource, token: IAccessToken) => Promise<void>,
                 getStoredAccessToken: (tokenService: string) => Promise<IAccessToken>,
                 handleResourceResponse: (resource: Resource) => Promise<any>): Promise<any> {

        var that = this;

        return new Promise<any>((resolve, reject) => {

            if (that.config.options.pessimisticAccessControl){

                // pessimistic: access control cookies may have been deleted.
                // always request the access token for every access controlled info.json request
                // returned access tokens are not stored, therefore the login window flashes for every request.

                resource.getData().then(() => {

                    if (resource.isAccessControlled){
                        login(resource.loginService).then(() => {
                            getAccessToken(resource.tokenService).then((token: IAccessToken) => {
                                resource.getData(token).then(() => {
                                    resolve(handleResourceResponse(resource));
                                });
                            });
                        });
                    } else {
                        // this info.json isn't access controlled, therefore no need to request an access token
                        resolve(resource);
                    }
                });
            } else {

                // optimistic: access control cookies may not have been deleted.
                // store access tokens to avoid login window flashes.
                // if cookies are deleted a page refresh is required.

                // try loading the resource using an access token that matches the info.json domain.
                // if an access token is found, request the resource using it regardless of whether it is access controlled.
                getStoredAccessToken(resource.dataUri).then((storedAccessToken: IAccessToken) => {
                    if (storedAccessToken) {
                        // try using the stored access token
                        resource.getData(storedAccessToken).then(() => {
                            // if the info.json loaded using the stored access token
                            if (resource.status === 200){
                                resolve(handleResourceResponse(resource));
                            } else {
                                // otherwise, load the resource data to determine the correct access control services.
                                // if access controlled, do login.
                                this.authorize(
                                    resource,
                                    login,
                                    getAccessToken,
                                    storeAccessToken,
                                    getStoredAccessToken).then(() => {
                                        resolve(handleResourceResponse(resource));
                                    });
                            }
                        });
                    } else {
                        this.authorize(
                            resource,
                            login,
                            getAccessToken,
                            storeAccessToken,
                            getStoredAccessToken).then(() => {
                                resolve(handleResourceResponse(resource));
                            });
                    }
                });
            }
        });
    }

    authorize(resource: Resource,
              login: (loginService: string) => Promise<void>,
              getAccessToken: (tokenServiceUrl: string) => Promise<IAccessToken>,
              storeAccessToken: (resource: Resource, token: IAccessToken) => Promise<void>,
              getStoredAccessToken: (tokenService: string) => Promise<IAccessToken>): Promise<Resource> {

        return new Promise<Resource>((resolve, reject) => {

            resource.getData().then(() => {
                if (resource.isAccessControlled) {
                    getStoredAccessToken(resource.tokenService).then((storedAccessToken: IAccessToken) => {
                        if (storedAccessToken) {
                            // try using the stored access token
                            resource.getData(storedAccessToken).then(() => {
                                resolve(resource);
                            });
                        } else {
                            // get an access token
                            login(resource.loginService).then(() => {
                                getAccessToken(resource.tokenService).then((accessToken) => {
                                    storeAccessToken(resource, accessToken).then(() => {
                                        resource.getData(accessToken).then(() => {
                                            resolve(resource);
                                        });
                                    });
                                });
                            });
                        }
                    });
                } else {
                    // this info.json isn't access controlled, therefore there's no need to request an access token
                    resolve(resource);
                }
            });
        });
    }

    loadResources(resources: Resource[],
                  login: (loginService: string) => Promise<void>,
                  getAccessToken: (tokenServiceUrl: string) => Promise<IAccessToken>,
                  storeAccessToken: (resource: Resource, token: IAccessToken) => Promise<void>,
                  getStoredAccessToken: (tokenService: string) => Promise<IAccessToken>,
                  handleResourceResponse: (resource: Resource) => Promise<any>): Promise<Resource[]> {

        var that = this;

        return new Promise<Resource[]>((resolve) => {

            var promises = _.map(resources, (resource: Resource) => {
                return that.loadResource(
                    resource,
                    login,
                    getAccessToken,
                    storeAccessToken,
                    getStoredAccessToken,
                    handleResourceResponse);
            });

            Promise.all(promises)
                .then(() => {
                    resolve(resources)
                });
        });
    }
}

export = BaseProvider;