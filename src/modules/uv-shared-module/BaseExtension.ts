import {BaseEvents} from "./BaseEvents";
import {ClickThroughDialogue} from "../../modules/uv-dialogues-module/ClickThroughDialogue";
import {IExtension} from "./IExtension";
import {ILocale} from "../../ILocale";
import {ILoginDialogueOptions} from "./ILoginDialogueOptions";
import {InformationArgs} from "./InformationArgs";
import {InformationType} from "./InformationType";
import {IUVData} from "../../IUVData";
import {LoginDialogue} from "../../modules/uv-dialogues-module/LoginDialogue";
import {LoginWarningMessages} from "./LoginWarningMessages";
import {Metric} from "../../modules/uv-shared-module/Metric";
import {Metrics} from "../../modules/uv-shared-module/Metrics";
import {RestrictedDialogue} from "../../modules/uv-dialogues-module/RestrictedDialogue";
import {Shell} from "./Shell";
import {SynchronousRequire} from "../../SynchronousRequire";
import ExternalResource = Manifold.ExternalResource;
import IAccessToken = Manifesto.IAccessToken;
import IThumb = Manifold.IThumb;
import UVComponent from "../../UVComponent";

export class BaseExtension implements IExtension {

    $clickThroughDialogue: JQuery;
    $element: JQuery;
    $loginDialogue: JQuery;
    $restrictedDialogue: JQuery;
    clickThroughDialogue: ClickThroughDialogue;
    component: UVComponent;
    data: IUVData;
    embedHeight: number;
    embedWidth: number;
    extensions: any;
    helper: Manifold.IHelper;
    isCreated: boolean = false;
    isLoggedIn: boolean = false;
    jsonp: boolean;
    lastCanvasIndex: number;
    loginDialogue: LoginDialogue;
    metric: Metric;
    mouseX: number;
    mouseY: number;
    name: string;
    resources: Manifold.ExternalResource[];
    restrictedDialogue: RestrictedDialogue;
    shell: Shell;
    shifted: boolean = false;
    tabbing: boolean = false;

    constructor() {

    }

    public create(): void {

        const that = this;

        this.$element = $('#app');
        this.$element.data("component", this.component);

        // initial sizing.
        const $win: JQuery = $(window);
        this.embedWidth = $win.width();
        this.embedHeight = $win.height();
        this.$element.width(this.embedWidth);
        this.$element.height(this.embedHeight);

        if (!this.getData().isReload && Utils.Documents.isInIFrame()) {
            // communication with parent frame (if it exists).
            this.component.socket = new easyXDM.Socket({
                onMessage: (message: any, origin: any) => {
                    message = $.parseJSON(message);
                    this.handleParentFrameEvent(message);
                }
            });
        }

        this.fire(BaseEvents.LOAD, {
            bootstrapper: {
                store: this.getData()
            },
            settings: this.getSettings(),
            preview: this.getSharePreview()
        });

        // add/remove classes.
        this.$element.empty();
        this.$element.removeClass();
        this.$element.addClass('browser-' + window.browserDetect.browser);
        this.$element.addClass('browser-version-' + window.browserDetect.version);
        if (!this.getData().isHomeDomain) this.$element.addClass('embedded');
        if (this.getData().isLightbox) this.$element.addClass('lightbox');

        $(document).on('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        // events
        if (!this.getData().isReload) {

            window.onresize = () => {

                const $win: JQuery = $(window);
                $('body').height($win.height());

                this.resize();
            };

            const visibilityProp: string | null = Utils.Documents.getHiddenProp();

            if (visibilityProp) {
                const event: string = visibilityProp.replace(/[H|h]idden/,'') + 'visibilitychange';
                document.addEventListener(event, () => {
                    // resize after a tab has been shown (fixes safari layout issue)
                    if (!Utils.Documents.isHidden()){
                        this.resize();
                    }
                });
            }

            if (Utils.Bools.getBool(this.getData().config.options.dropEnabled, true)) {
                this.$element.on('drop', (e => {
                    e.preventDefault();
                    const dropUrl: any = (<any>e.originalEvent).dataTransfer.getData("URL");
                    const a: HTMLAnchorElement = Utils.Urls.getUrlParts(dropUrl);
                    const iiifResourceUri: string | null = Utils.Urls.getQuerystringParameterFromString('manifest', a.search);
                    //var canvasUri = Utils.Urls.getQuerystringParameterFromString('canvas', url.search);

                    if (iiifResourceUri) {
                        this.fire(BaseEvents.DROP, iiifResourceUri);
                        const data: IUVData = <IUVData>{};
                        data.iiifResourceUri = iiifResourceUri;
                        this.reload(data);
                    }
                }));
            }

            this.$element.on('dragover', (e => {
                // allow drop
                e.preventDefault();
            }));

            // keyboard events.

            $(document).on('keyup keydown', (e: any) => {
                this.shifted = e.shiftKey;
                this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
            });

            $(document).keydown((e: any) => {

                let event: string | null = null;
                let preventDefault: boolean = true;

                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) {
                        event = BaseEvents.RETURN;
                        preventDefault = false;
                    }
                    if (e.keyCode === KeyCodes.KeyDown.Escape) event = BaseEvents.ESCAPE;
                    if (e.keyCode === KeyCodes.KeyDown.PageUp) event = BaseEvents.PAGE_UP;
                    if (e.keyCode === KeyCodes.KeyDown.PageDown) event = BaseEvents.PAGE_DOWN;
                    if (e.keyCode === KeyCodes.KeyDown.End) event = BaseEvents.END;
                    if (e.keyCode === KeyCodes.KeyDown.Home) event = BaseEvents.HOME;
                    if (e.keyCode === KeyCodes.KeyDown.NumpadPlus || e.keyCode === 171 || e.keyCode === KeyCodes.KeyDown.Equals) {
                        event = BaseEvents.PLUS;
                        preventDefault = false;  
                    } 
                    if (e.keyCode === KeyCodes.KeyDown.NumpadMinus || e.keyCode === 173 || e.keyCode === KeyCodes.KeyDown.Dash) {
                        event = BaseEvents.MINUS;
                        preventDefault = false;
                    } 

                    if (that.useArrowKeysToNavigate()) {
                        if (e.keyCode === KeyCodes.KeyDown.LeftArrow) event = BaseEvents.LEFT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.UpArrow) event = BaseEvents.UP_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.RightArrow) event = BaseEvents.RIGHT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.DownArrow) event = BaseEvents.DOWN_ARROW;
                    }
                }

                if (event) {
                    if (preventDefault) {
                        e.preventDefault();
                    }
                    $.publish(event);
                }
            });

            if (this.getData().isHomeDomain && Utils.Documents.isInIFrame()) {

                $.subscribe(BaseEvents.PARENT_EXIT_FULLSCREEN, () => {
                    if (this.isOverlayActive()) {
                        $.publish(BaseEvents.ESCAPE);
                    }

                    $.publish(BaseEvents.ESCAPE);
                    $.publish(BaseEvents.RESIZE);
                });
            }
        }

        this.$element.append('<a href="/" id="top"></a>');
        this.$element.append('<iframe id="commsFrame" style="display:none"></iframe>');

        $.subscribe(BaseEvents.ACCEPT_TERMS, () => {
            this.fire(BaseEvents.ACCEPT_TERMS);
        });

        $.subscribe(BaseEvents.LOGIN_FAILED, () => {
            this.fire(BaseEvents.LOGIN_FAILED);
            this.showMessage(this.getData().config.content.authorisationFailedMessage);
        });

        $.subscribe(BaseEvents.LOGIN, () => {
            this.isLoggedIn = true;
            this.fire(BaseEvents.LOGIN);
        });

        $.subscribe(BaseEvents.LOGOUT, () => {
            this.isLoggedIn = false;
            this.fire(BaseEvents.LOGOUT);
        });

        $.subscribe(BaseEvents.BOOKMARK, () => {
            this.bookmark();
            this.fire(BaseEvents.BOOKMARK);
        });

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGE_FAILED, () => {
            this.fire(BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
        });

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this.fire(BaseEvents.CANVAS_INDEX_CHANGED, canvasIndex);
        });

        $.subscribe(BaseEvents.CLICKTHROUGH, () => {
            this.fire(BaseEvents.CLICKTHROUGH);
        });

        $.subscribe(BaseEvents.CLOSE_ACTIVE_DIALOGUE, () => {
            this.fire(BaseEvents.CLOSE_ACTIVE_DIALOGUE);
        });

        $.subscribe(BaseEvents.CLOSE_LEFT_PANEL, () => {
            this.fire(BaseEvents.CLOSE_LEFT_PANEL);
            this.resize();
        });

        $.subscribe(BaseEvents.CLOSE_RIGHT_PANEL, () => {
            this.fire(BaseEvents.CLOSE_RIGHT_PANEL);
            this.resize();
        });

        $.subscribe(BaseEvents.CREATED, () => {
            this.isCreated = true;
            this.fire(BaseEvents.CREATED);
        });

        $.subscribe(BaseEvents.DOWN_ARROW, () => {
            this.fire(BaseEvents.DOWN_ARROW);
        });

        $.subscribe(BaseEvents.DOWNLOAD, (e: any, obj: any) => {
            this.fire(BaseEvents.DOWNLOAD, obj);
        });

        $.subscribe(BaseEvents.END, () => {
            this.fire(BaseEvents.END);
        });

        $.subscribe(BaseEvents.ESCAPE, () => {
            this.fire(BaseEvents.ESCAPE);

            if (this.isFullScreen() && !this.isOverlayActive()) {
                $.publish(BaseEvents.TOGGLE_FULLSCREEN);
            }
        });

        $.subscribe(BaseEvents.EXTERNAL_LINK_CLICKED, (e: any, url: string) => {
            this.fire(BaseEvents.EXTERNAL_LINK_CLICKED, url);
        });

        $.subscribe(BaseEvents.FEEDBACK, () => {
            this.feedback();
        });

        $.subscribe(BaseEvents.FORBIDDEN, () => {
            this.fire(BaseEvents.FORBIDDEN);
            $.publish(BaseEvents.OPEN_EXTERNAL_RESOURCE);
        });

        $.subscribe(BaseEvents.HIDE_DOWNLOAD_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_EMBED_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_EMBED_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_EXTERNALCONTENT_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_EXTERNALCONTENT_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_GENERIC_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_GENERIC_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_HELP_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_HELP_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_INFORMATION, () => {
            this.fire(BaseEvents.HIDE_INFORMATION);
        });

        $.subscribe(BaseEvents.HIDE_LOGIN_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_LOGIN_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            this.fire(BaseEvents.HIDE_OVERLAY);
        });

        $.subscribe(BaseEvents.HIDE_RESTRICTED_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_RESTRICTED_DIALOGUE);
        });

        $.subscribe(BaseEvents.HIDE_SETTINGS_DIALOGUE, () => {
            this.fire(BaseEvents.HIDE_SETTINGS_DIALOGUE);
        });

        $.subscribe(BaseEvents.HOME, () => {
            this.fire(BaseEvents.HOME);
        });

        $.subscribe(BaseEvents.LEFT_ARROW, () => {
            this.fire(BaseEvents.LEFT_ARROW);
        });

        $.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.fire(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
        });

        $.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START, () => {
            this.fire(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
        });

        $.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH, () => {
            this.fire(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
        });

        $.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_START, () => {
            this.fire(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
        });

        $.subscribe(BaseEvents.LOAD_FAILED, () => {
            this.fire(BaseEvents.LOAD_FAILED);

            if (!that.lastCanvasIndex == null && that.lastCanvasIndex !== that.helper.canvasIndex){
                this.viewCanvas(that.lastCanvasIndex);
            }
        });

        $.subscribe(BaseEvents.NOT_FOUND, () => {
            this.fire(BaseEvents.NOT_FOUND);
        });

        $.subscribe(BaseEvents.OPEN, () => {
            this.fire(BaseEvents.OPEN);

            const openUri: string = String.format(this.getData().config.options.openTemplate, this.helper.iiifResourceUri);

            window.open(openUri);
        });

        $.subscribe(BaseEvents.OPEN_LEFT_PANEL, () => {
            this.fire(BaseEvents.OPEN_LEFT_PANEL);
            this.resize();
        });

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, () => {
            this.fire(BaseEvents.OPEN_EXTERNAL_RESOURCE);
        });

        $.subscribe(BaseEvents.OPEN_RIGHT_PANEL, () => {
            this.fire(BaseEvents.OPEN_RIGHT_PANEL);
            this.resize();
        });

        $.subscribe(BaseEvents.PAGE_DOWN, () => {
            this.fire(BaseEvents.PAGE_DOWN);
        });

        $.subscribe(BaseEvents.PAGE_UP, () => {
            this.fire(BaseEvents.PAGE_UP);
        });

        $.subscribe(BaseEvents.RESOURCE_DEGRADED, (e: any, resource: ExternalResource) => {
            this.fire(BaseEvents.RESOURCE_DEGRADED);
            this.handleDegraded(resource)
        });

        $.subscribe(BaseEvents.RETURN, () => {
            this.fire(BaseEvents.RETURN);
        });

        $.subscribe(BaseEvents.RIGHT_ARROW, () => {
            this.fire(BaseEvents.RIGHT_ARROW);
        });

        $.subscribe(BaseEvents.RIGHTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.fire(BaseEvents.RIGHTPANEL_COLLAPSE_FULL_FINISH);
        });

        $.subscribe(BaseEvents.RIGHTPANEL_COLLAPSE_FULL_START, () => {
            this.fire(BaseEvents.RIGHTPANEL_COLLAPSE_FULL_START);
        });

        $.subscribe(BaseEvents.RIGHTPANEL_EXPAND_FULL_FINISH, () => {
            this.fire(BaseEvents.RIGHTPANEL_EXPAND_FULL_FINISH);
        });

        $.subscribe(BaseEvents.RIGHTPANEL_EXPAND_FULL_START, () => {
            this.fire(BaseEvents.RIGHTPANEL_EXPAND_FULL_START);
        });

        $.subscribe(BaseEvents.SEQUENCE_INDEX_CHANGED, () => {
            this.fire(BaseEvents.SEQUENCE_INDEX_CHANGED);
        });

        $.subscribe(BaseEvents.SETTINGS_CHANGED, (e: any, args: any) => {
            this.fire(BaseEvents.SETTINGS_CHANGED, args);
        });

        $.subscribe(BaseEvents.SHOW_DOWNLOAD_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_EMBED_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_EXTERNALCONTENT_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_EXTERNALCONTENT_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_GENERIC_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_GENERIC_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_HELP_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_HELP_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_INFORMATION, () => {
            this.fire(BaseEvents.SHOW_INFORMATION);
        });

        $.subscribe(BaseEvents.SHOW_LOGIN_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_LOGIN_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_RESTRICTED_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_RESTRICTED_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            this.fire(BaseEvents.SHOW_OVERLAY);
        });

        $.subscribe(BaseEvents.SHOW_SETTINGS_DIALOGUE, () => {
            this.fire(BaseEvents.SHOW_SETTINGS_DIALOGUE);
        });

        $.subscribe(BaseEvents.SHOW_TERMS_OF_USE, () => {
            this.fire(BaseEvents.SHOW_TERMS_OF_USE);
            
            // todo: Eventually this should be replaced with a suitable IIIF Presentation API field - until then, use attribution
            const terms: string = this.helper.getAttribution();

            this.showMessage(terms);
        });

        $.subscribe(BaseEvents.THUMB_SELECTED, (e: any, thumb: IThumb) => {
            this.fire(BaseEvents.THUMB_SELECTED, thumb.index);
        });

        $.subscribe(BaseEvents.TOGGLE_FULLSCREEN, () => {
            $('#top').focus();
            this.component.isFullScreen = !this.component.isFullScreen;

            this.fire(BaseEvents.TOGGLE_FULLSCREEN,
                {
                    isFullScreen: this.component.isFullScreen,
                    overrideFullScreen: this.getData().config.options.overrideFullScreen
                });
        });

        $.subscribe(BaseEvents.UP_ARROW, () => {
            this.fire(BaseEvents.UP_ARROW);
        });

        $.subscribe(BaseEvents.UPDATE_SETTINGS, () => {
            this.fire(BaseEvents.UPDATE_SETTINGS);
        });

        $.subscribe(BaseEvents.VIEW_FULL_TERMS, () => {
            this.fire(BaseEvents.VIEW_FULL_TERMS);
        });

        $.subscribe(BaseEvents.WINDOW_UNLOAD, () => {
            this.fire(BaseEvents.WINDOW_UNLOAD);
        });

        // create shell and shared views.
        this.shell = new Shell(this.$element);

        // dependencies
        this.getDependencies((deps: any) => {
            this.loadDependencies(deps);
        });
    }

    createModules(): void {
        this.$clickThroughDialogue = $('<div class="overlay clickthrough"></div>');
        Shell.$overlays.append(this.$clickThroughDialogue);
        this.clickThroughDialogue = new ClickThroughDialogue(this.$clickThroughDialogue);

        this.$restrictedDialogue = $('<div class="overlay login"></div>');
        Shell.$overlays.append(this.$restrictedDialogue);
        this.restrictedDialogue = new RestrictedDialogue(this.$restrictedDialogue);

        this.$loginDialogue = $('<div class="overlay login"></div>');
        Shell.$overlays.append(this.$loginDialogue);
        this.loginDialogue = new LoginDialogue(this.$loginDialogue);
    }

    modulesCreated(): void {

    }

    getDependencies(cb: (deps: any) => void): any {
        const that = this;

        const depsUri: string = 'lib/' + this.name + '-dependencies';

        // check if the deps are already loaded
        const scripts: JQuery = $('script[data-requiremodule]')
            .filter(function() {
                const attr: string = $(this).attr('data-requiremodule');
                return (attr.indexOf(that.name) !== -1 && attr.indexOf('dependencies') !== -1)
            });

        if (!scripts.length) {

            requirejs([depsUri], function(deps: any) {

                const baseUri: string = 'lib/';

                // for each dependency, prepend baseUri.
                if (deps.sync) {                    
                    for (let i = 0; i < deps.sync.length; i++) {
                        deps.sync[i] = baseUri + deps.sync[i];
                    }
                }

                if (deps.async) {                    
                    for (let i = 0; i < deps.async.length; i++) {
                        deps.async[i] = baseUri + deps.async[i];
                    }
                }
                
                cb(deps);
            });
        } else {
            cb(null);
        }
    }

    loadDependencies(deps: any): void {
        const that = this;

        if (!deps) {
            that.dependenciesLoaded();
        } else if (deps.sync) {
            // load each sync script.
            // necessary for cases like this: https://github.com/mrdoob/three.js/issues/9602
            // then load the async scripts
            SynchronousRequire.load(deps.sync, that.dependencyLoaded).then(() => {
                if (deps.async) {
                    requirejs(deps.async, function() {
                        that.dependenciesLoaded(arguments);
                    });
                } else {
                    that.dependenciesLoaded();
                }
            });
        } else if (deps.async) {
            requirejs(deps.async, function() {
                that.dependenciesLoaded(arguments);
            });
        } else {
            that.dependenciesLoaded();
        }
    }

    dependencyLoaded(index: number, dep: any): void {
        
    }

    dependenciesLoaded(...args: any[]): void {
        this.createModules();
        this.modulesCreated();
        $.publish(BaseEvents.RESIZE); // initial sizing
        $.publish(BaseEvents.CREATED);
        this.setParams();
        this.setDefaultFocus();
        this.viewCanvas(this.helper.canvasIndex);
    }

    setParams(): void {
        if (!this.getData().isHomeDomain) return;

        $.publish(BaseEvents.COLLECTION_INDEX_CHANGED, [this.helper.collectionIndex.toString()]);
        $.publish(BaseEvents.MANIFEST_INDEX_CHANGED, [this.helper.manifestIndex.toString()]);
        $.publish(BaseEvents.SEQUENCE_INDEX_CHANGED, [this.helper.sequenceIndex.toString()]);
        $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [this.helper.canvasIndex.toString()]);
    }

    setDefaultFocus(): void {
        setTimeout(() => {
            if (this.getData().config.options.allowStealFocus) {
                $('[tabindex=0]').focus();
            }
        }, 1);
    }

    width(): number {
        return $(window).width();
    }

    height(): number {
        return $(window).height();
    }

    fire(name: string, ...args: any[]): void {
        this.component.fire(name, args);
    }

    redirect(uri: string): void {
        this.fire(BaseEvents.REDIRECT, uri);
    }

    refresh(): void {
        this.fire(BaseEvents.REFRESH, null);
    }

    private _updateMetric(): void {

        const keys: string[] = Object.keys(Metrics);

        for (let i = 0; i < keys.length; i++) {
            const metric: Metric = Metrics[keys[i]];

            if (this.width() > metric.minWidth && this.width() <= metric.maxWidth) {
                if (this.metric !== metric) {
                    this.metric = metric;
                    $.publish(BaseEvents.METRIC_CHANGED);
                }
            }
        }
    }

    resize(): void {
        this._updateMetric();
        $.publish(BaseEvents.RESIZE);
    }

    handleParentFrameEvent(message: any): void {
        Utils.Async.waitFor(() => {
            return this.isCreated;
        }, () => {
            switch (message.eventName) {
                case BaseEvents.TOGGLE_FULLSCREEN:
                    $.publish(BaseEvents.TOGGLE_FULLSCREEN, message.eventObject);
                    break;
                case BaseEvents.PARENT_EXIT_FULLSCREEN:
                    $.publish(BaseEvents.PARENT_EXIT_FULLSCREEN);
                    break;
            }
        });
    }

    // re-bootstraps the application with new querystring params
    reload(data?: IUVData): void {
        $.disposePubSub();
        $.publish(BaseEvents.RELOAD, [data]);
    }

    isSeeAlsoEnabled(): boolean {
        return this.getData().config.options.seeAlsoEnabled !== false;
    }

    getShareUrl(): string | null {
        // If embedded on the home domain and it's the only instance of the UV on the page
        if (this.isDeepLinkingEnabled()){
            // Use the current page URL with hash params
            if (Utils.Documents.isInIFrame()) {
                return parent.document.location.href;
            } else {
                return document.location.href;
            }            
        } else {
            // If there's a `related` property of format `text/html` in the manifest
            if (this.helper.hasRelatedPage()) {
                // Use the `related` property in the URL box
                var related: any = this.helper.getRelated();
                if (related && related.length) {
                    related = related[0];
                }
                return related['@id'];
            }
        }

        return null;
    }

    getIIIFShareUrl(): string {
        return this.helper.iiifResourceUri + "?manifest=" + this.helper.iiifResourceUri;
    }

    addTimestamp(uri: string): string {
        return uri + "?t=" + Utils.Dates.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.getData().isHomeDomain && this.getData().isOnlyInstance);
    }

    isOnHomeDomain(): boolean {
        return this.isDeepLinkingEnabled();
    }

    getDomain(): string {
        const parts: any = Utils.Urls.getUrlParts(this.helper.iiifResourceUri);
        return parts.host;
    }

    getEmbedDomain(): string | null {
        return this.getData().embedDomain;
    }

    getSettings(): ISettings {
        if (Utils.Bools.getBool(this.getData().config.options.saveUserSettings, false)) {

            const settings: any = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            
            if (settings) {
                return $.extend(this.getData().config.options, settings.value);
            }
        }
        
        return this.getData().config.options;
    }

    updateSettings(settings: ISettings): void {
        if (Utils.Bools.getBool(this.getData().config.options.saveUserSettings, false)) {

            const storedSettings: any = Utils.Storage.get("uv.settings", Utils.StorageType.local);

            if (storedSettings) {
                settings = $.extend(storedSettings.value, settings);
            }
                
            // store for ten years
            Utils.Storage.set("uv.settings", settings, 315360000, Utils.StorageType.local);
        }
        
        this.getData().config.options = $.extend(this.getData().config.options, settings);
    }

    sanitize(html: string): string {
        const elem: Element = document.createElement('div');
        const $elem: JQuery = $(elem);

        $elem.html(html);

        const s: any = new Sanitize({
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

    getSharePreview(): any {
        const preview: any = {};

        preview.title = this.helper.getLabel();

        // todo: use getThumb (when implemented)

        const canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        let thumbnail: string = canvas.getProperty('thumbnail');

        if (!thumbnail || !(typeof(thumbnail) === 'string')) {
            thumbnail = canvas.getCanonicalImageUri(this.getData().config.options.bookmarkThumbWidth);
        }

        preview.image = thumbnail;

        return preview;
    }

    public getPagedIndices(canvasIndex: number = this.helper.canvasIndex): number[] {
        return [canvasIndex];
    }

    public getCurrentCanvases(): Manifesto.ICanvas[] {
        const indices: number[] = this.getPagedIndices(this.helper.canvasIndex);
        const canvases: Manifesto.ICanvas[] = [];
        
        for (let i = 0; i < indices.length; i++) {
            const index: number = indices[i];
            const canvas: Manifesto.ICanvas = this.helper.getCanvasByIndex(index);
            canvases.push(canvas);
        }
        
        return canvases;
    }

    public getCanvasLabels(label: string): string {
        const indices: number[] = this.getPagedIndices();
        let labels: string = "";

        if (indices.length === 1) {
            labels = label;
        } else {
            for (let i = 1; i <= indices.length; i++) {
                if (labels.length) labels += ",";
                labels += label + " " + i;
            }
        }

        return labels;
    }

    public getCurrentCanvasRange(): Manifesto.IRange | null {
        //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
        //var range: Manifesto.IRange = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
        const range: Manifesto.IRange | null = this.helper.getCanvasRange(this.helper.getCurrentCanvas());
        return range;
    }

    public getExternalResources(resources?: Manifold.ExternalResource[]): Promise<Manifold.ExternalResource[]> {

        const indices: number[] = this.getPagedIndices();
        const resourcesToLoad: Manifold.ExternalResource[] = [];

        $.each(indices, (i: number, index: number) => {
            const canvas: Manifesto.ICanvas = this.helper.getCanvasByIndex(index);
            const r: Manifold.ExternalResource = new Manifold.ExternalResource(canvas, <(r: Manifesto.IManifestResource) => string>this.helper.getInfoUri);
            r.index = index;

            // used to reload resources with isResponseHandled = true.
            if (resources){
                const found: Manifold.ExternalResource | undefined = resources.find((f: Manifold.ExternalResource) => {
                    return f.dataUri === r.dataUri;
                });

                if (found) {
                    resourcesToLoad.push(found);
                } else {
                    resourcesToLoad.push(r);
                }
            } else {
                resourcesToLoad.push(r);
            }
        });

        const storageStrategy: string = this.getData().config.options.tokenStorage;

        return new Promise<Manifold.ExternalResource[]>((resolve) => {
            manifesto.Utils.loadExternalResources(
                resourcesToLoad,
                storageStrategy,
                this.clickThrough,
                this.restricted,
                this.login,
                this.getAccessToken,
                this.storeAccessToken,
                this.getStoredAccessToken,
                this.handleExternalResourceResponse).then((r: Manifold.ExternalResource[]) => {
                    this.resources = r.map((resource: Manifold.ExternalResource) => {
                        resource.data.index = resource.index;
                        return <Manifold.ExternalResource>Utils.Objects.toPlainObject(resource.data);
                    });
                    resolve(this.resources);
                })['catch']((error: any) => {
                    switch(error.name) {
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseEvents.LOGIN_FAILED);
                            break;
                        case manifesto.StatusCodes.FORBIDDEN.toString():
                            $.publish(BaseEvents.FORBIDDEN);
                            break;
                        case manifesto.StatusCodes.RESTRICTED.toString():
                            // do nothing
                            break;
                        default:
                            this.showMessage(error.message || error);
                    }
            });
        });
    }

    viewCanvas(canvasIndex: number): void {

        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)){
            this.showMessage(this.getData().config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        this.lastCanvasIndex = this.helper.canvasIndex;
        this.helper.canvasIndex = canvasIndex;

        $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [canvasIndex]);
        $.publish(BaseEvents.OPEN_EXTERNAL_RESOURCE);
    }

    showMessage(message: string, acceptCallback?: Function, buttonText?: string, allowClose?: boolean): void {

        this.closeActiveDialogue();

        $.publish(BaseEvents.SHOW_GENERIC_DIALOGUE, [
            {
                message: message,
                acceptCallback: acceptCallback,
                buttonText: buttonText,
                allowClose: allowClose
            }]);
    }

    closeActiveDialogue(): void{
        $.publish(BaseEvents.CLOSE_ACTIVE_DIALOGUE);
    }

    isOverlayActive(): boolean{
        return Shell.$overlays.is(':visible');
    }

    viewManifest(manifest: Manifesto.IManifest): void{
        const data: IUVData = <IUVData>{};
        data.iiifResourceUri = this.helper.iiifResourceUri;
        data.collectionIndex = <number>this.helper.getCollectionIndex(manifest);
        data.manifestIndex = <number>manifest.index;
        data.sequenceIndex = 0;
        data.canvasIndex = 0;

        this.reload(data);
    }

    viewCollection(collection: Manifesto.ICollection): void{
        const data: IUVData = <IUVData>{};
        data.iiifResourceUri = this.helper.iiifResourceUri;
        data.collectionIndex = collection.index;
        data.manifestIndex = 0;
        data.sequenceIndex = 0;
        data.canvasIndex = 0;

        this.reload(data);
    }

    isFullScreen(): boolean {
        return this.component.isFullScreen;
    }

    isHeaderPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.getData().config.options.headerPanelEnabled, true);
    }

    isLeftPanelEnabled(): boolean {
        if (Utils.Bools.getBool(this.getData().config.options.leftPanelEnabled, true)) {
            if (this.helper.hasParentCollection()) {
                return true;
            } else if (this.helper.isMultiCanvas()) {
                if (this.helper.getViewingHint().toString() !== manifesto.ViewingHint.continuous().toString()) {
                    return true;
                }
            }
        }

        return false;
    }

    isRightPanelEnabled(): boolean {
        return  Utils.Bools.getBool(this.getData().config.options.rightPanelEnabled, true);
    }

    isFooterPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.getData().config.options.footerPanelEnabled, true);
    }

    useArrowKeysToNavigate(): boolean {
        return Utils.Bools.getBool(this.getData().config.options.useArrowKeysToNavigate, true);
    }

    bookmark(): void {
        // override for each extension
    }

    feedback(): void {
        this.fire(BaseEvents.FEEDBACK, this.getData());
    }

    getBookmarkUri(): string {
        const absUri: string = parent.document.URL;
        const parts: HTMLAnchorElement = Utils.Urls.getUrlParts(absUri);
        let relUri: string = parts.pathname + parts.search + parent.document.location.hash;

        if (!relUri.startsWith("/")) {
            relUri = "/" + relUri;
        }

        return relUri;
    }

    getData(): IUVData {
        return this.data;
    }

    getAlternateLocale(): ILocale | null {
        const locales: ILocale[] = this.getLocales();
        let alternateLocale: ILocale | null = null;

        if (locales.length > 1) {
            alternateLocale = locales[1];
        }

        return alternateLocale;
    }

    getLocales(): ILocale[] {
        return this.getData().locales;
    }

    getSerializedLocales(): string {
        return this.serializeLocales(this.getLocales());
    }

    serializeLocales(locales: ILocale[]): string {
        let serializedLocales: string = '';

        for (let i = 0; i < locales.length; i++) {
            const l = locales[i];
            if (i > 0) serializedLocales += ',';
            serializedLocales += l.name;
            if (l.label) {
                serializedLocales += ':' + l.label;
            }
        }

        return serializedLocales;
    }

    changeLocale(locale: string): void {
        // if the current locale is "en-GB:English,cy-GB:Welsh"
        // and "cy-GB" is passed, it becomes "cy-GB:Welsh,en-GB:English"

        // re-order locales so the passed locale is first
        let locales: ILocale[] = this.getLocales();

        locales = locales.clone();

        const index: number = locales.findIndex((l: any) => {
            return l.name === locale;
        });

        locales.move(index, 0);

        const data: IUVData = <IUVData>{};
        data.locales = locales;

        this.reload(data);
    }

    // auth

    clickThrough(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            $.publish(BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    const win: Window = window.open(resource.clickThroughService.id);

                    const pollTimer: number = window.setInterval(() => {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseEvents.CLICKTHROUGH);
                            resolve();
                        }
                    }, 500);
                }
            }]);
        });
    }

    restricted(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            $.publish(BaseEvents.SHOW_RESTRICTED_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    $.publish(BaseEvents.LOAD_FAILED);
                    reject(resource);
                }
            }]);
        });
    }

    login(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            const options: ILoginDialogueOptions = <ILoginDialogueOptions>{};

            if (resource.status === HTTPStatusCode.FORBIDDEN){
                options.warningMessage = LoginWarningMessages.FORBIDDEN;
                options.showCancelButton = true;
            }

            $.publish(BaseEvents.SHOW_LOGIN_DIALOGUE, [{
                resource: resource,
                loginCallback: () => {
                    const win: Window = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                    const pollTimer: number = window.setInterval(function () {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseEvents.LOGIN);
                            resolve();
                        }
                    }, 500);
                },
                logoutCallback: () => {
                    const win: Window = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                    const pollTimer: number = window.setInterval(function () {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseEvents.LOGOUT);
                            resolve();
                        }
                    }, 500);
                },
                options: options
            }]);
        });
    }

    getAccessToken(resource: Manifold.ExternalResource, rejectOnError: boolean): Promise<Manifesto.IAccessToken> {

        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {
            const serviceUri: string = resource.tokenService.id;

            // pick an identifier for this message. We might want to keep track of sent messages
            const msgId: string = serviceUri + "|" + new Date().getTime();

            const receiveAccessToken: EventListenerOrEventListenerObject = (e: any) => {
                window.removeEventListener("message", receiveAccessToken);
                const token: any = e.data;
                if (token.error){
                    if(rejectOnError) {
                        reject(token.errorDescription);
                    } else {
                        resolve(undefined);
                    }
                } else {
                    resolve(token);
                }
            };

            window.addEventListener("message", receiveAccessToken, false);

            const tokenUri: string = serviceUri + "?messageId=" + msgId;
            $('#commsFrame').prop('src', tokenUri);
        });

        // deprecated JSONP method - keep this around for reference
        //return new Promise<Manifesto.IAccessToken>((resolve, reject) => {
        //    $.getJSON(resource.tokenService.id + "?callback=?", (token: Manifesto.IAccessToken) => {
        //        if (token.error){
        //            if(rejectOnError) {
        //                reject(token.errorDescription);
        //            } else {
        //                resolve(null);
        //            }
        //        } else {
        //            resolve(token);
        //        }
        //    }).fail((error) => {
        //        if(rejectOnError) {
        //            reject(error);
        //        } else {
        //            resolve(null);
        //        }
        //    });
        //});
    }

    storeAccessToken(resource: Manifold.ExternalResource, token: Manifesto.IAccessToken, storageStrategy: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Utils.Storage.set(resource.tokenService.id, token, token.expiresIn, new Utils.StorageType(storageStrategy));
            resolve();
        });
    }

    getStoredAccessToken(resource: Manifold.ExternalResource, storageStrategy: string): Promise<Manifesto.IAccessToken> {

        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {

            let foundItems: Utils.StorageItem[] = [];
            let item: Utils.StorageItem | null = null;

            // try to match on the tokenService, if the resource has one:
            if(resource.tokenService) {
                item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
            }

            if (item) {
                foundItems.push(item);
            } else {
                // find an access token for the domain
                const domain: string = Utils.Urls.getUrlParts(resource.dataUri).hostname;
                const items: Utils.StorageItem[] = Utils.Storage.getItems(new Utils.StorageType(storageStrategy));

                for (let i = 0; i < items.length; i++) {
                    item = items[i];

                    if (item.key.includes(domain)) {
                        foundItems.push(item);
                    }
                }
            }

            // sort by expiresAt, earliest to most recent.
            foundItems = foundItems.sort((a: Utils.StorageItem, b: Utils.StorageItem) => {
                return a.expiresAt - b.expiresAt;
            });

            let foundToken: IAccessToken | undefined;

            if (foundItems.length) {
                foundToken = <Manifesto.IAccessToken>foundItems[foundItems.length - 1].value;
            }

            resolve(foundToken);
        });
    }

    handleExternalResourceResponse(resource: Manifold.ExternalResource): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            resource.isResponseHandled = true;

            if (resource.status === HTTPStatusCode.OK) {
                resolve(resource);
            } else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                resolve(resource);
                $.publish(BaseEvents.RESOURCE_DEGRADED, [resource]);
            } else {

                if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                    resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                    // if the browser doesn't support CORS
                    if (!Modernizr.cors) {
                        const informationArgs: InformationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
                        $.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
                        resolve(resource);
                    } else {
                        reject(resource.error.statusText);
                    }
                } else if (resource.error.status === HTTPStatusCode.FORBIDDEN) {
                    const error: Error = new Error();
                    error.message = "Forbidden";
                    error.name = manifesto.StatusCodes.FORBIDDEN.toString();
                    reject(error);
                } else {
                    reject(resource.error.statusText);
                }
            }
        });
    }

    handleDegraded(resource: Manifold.ExternalResource): void {
        const informationArgs: InformationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
        $.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
    }
}