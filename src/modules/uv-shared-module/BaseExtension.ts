import BaseCommands = require("./BaseCommands");
import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ClickThroughDialogue = require("../../modules/uv-dialogues-module/ClickThroughDialogue");
import ExternalResource = Manifold.ExternalResource;
import IAccessToken = Manifesto.IAccessToken;
import IExtension = require("./IExtension");
import ILoginDialogueOptions = require("./ILoginDialogueOptions");
import Information = require("./Information");
import InformationAction = require("./InformationAction");
import InformationArgs = require("./InformationArgs");
import InformationType = require("./InformationType");
import IThumb = Manifold.IThumb;
import LoginDialogue = require("../../modules/uv-dialogues-module/LoginDialogue");
import LoginWarningMessages = require("./LoginWarningMessages");
import Metric = require("../../modules/uv-shared-module/Metric");
import {MetricType} from "../../modules/uv-shared-module/MetricType";
import Params = require("../../Params");
import RestrictedDialogue = require("../../modules/uv-dialogues-module/RestrictedDialogue");
import Shell = require("./Shell");

class BaseExtension implements IExtension {

    $clickThroughDialogue: JQuery;
    $element: JQuery;
    $loginDialogue: JQuery;
    $restrictedDialogue: JQuery;
    bootstrapper: BootStrapper;
    clickThroughDialogue: ClickThroughDialogue;
    config: any;
    //currentRangePath: string;
    domain: string;
    embedDomain: string;
    embedHeight: number;
    embedScriptUri: string;
    embedWidth: number;
    extensions: any;
    helper: Manifold.IHelper;
    isCreated: boolean = false;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isLoggedIn: boolean = false;
    isOnlyInstance: boolean;
    isReload: boolean;
    jsonp: boolean;
    lastCanvasIndex: number;
    locale: string;
    locales: any[];
    loginDialogue: LoginDialogue;
    metric: MetricType = MetricType.LAPTOP;
    metrics: Metric[] = [];
    mouseX: number;
    mouseY: number;
    name: string;
    resources: Manifold.ExternalResource[];
    restrictedDialogue: RestrictedDialogue;
    shell: Shell;
    shifted: boolean = false;
    tabbing: boolean = false;

    constructor(bootstrapper: BootStrapper) {
        this.bootstrapper = bootstrapper;
        this.config = this.bootstrapper.config;

        this.jsonp = this.bootstrapper.params.jsonp;
        this.locale = this.bootstrapper.params.getLocaleName();
        this.isHomeDomain = this.bootstrapper.params.isHomeDomain;
        this.isReload = this.bootstrapper.params.isReload;
        this.embedDomain = this.bootstrapper.params.embedDomain;
        this.isOnlyInstance = this.bootstrapper.params.isOnlyInstance;
        this.embedScriptUri = this.bootstrapper.params.embedScriptUri;
        this.domain = this.bootstrapper.params.domain;
        this.isLightbox = this.bootstrapper.params.isLightbox;
    }

    public create(overrideDependencies?: any): void {

        var that = this;

        this.$element = $('#app');
        this.$element.data("bootstrapper", this.bootstrapper);

        // initial sizing.
        var $win = $(window);
        this.embedWidth = $win.width();
        this.embedHeight = $win.height();
        this.$element.width(this.embedWidth);
        this.$element.height(this.embedHeight);

        this._parseMetrics();

        if (!this.isReload && Utils.Documents.isInIFrame()){
            // communication with parent frame (if it exists).
            this.bootstrapper.socket = new easyXDM.Socket({
                onMessage: (message, origin) => {
                    message = $.parseJSON(message);
                    this.handleParentFrameEvent(message);
                }
            });
        }

        this.triggerSocket(BaseCommands.LOAD, {
            bootstrapper: {
                config: this.bootstrapper.config,
                params: this.bootstrapper.params
            },
            settings: this.getSettings(),
            preview: this.getSharePreview()
        });

        // add/remove classes.
        this.$element.empty();
        this.$element.removeClass();
        this.$element.addClass('browser-' + window.browserDetect.browser);
        this.$element.addClass('browser-version-' + window.browserDetect.version);
        if (!this.isHomeDomain) this.$element.addClass('embedded');
        if (this.isLightbox) this.$element.addClass('lightbox');

        $(document).on('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        // events
        if (!this.isReload){

            window.onresize = () => {

                var $win = $(window);
                $('body').height($win.height());

                this.resize();
            };

            var visibilityProp: string = Utils.Documents.getHiddenProp();

            if (visibilityProp) {
                var evtname = visibilityProp.replace(/[H|h]idden/,'') + 'visibilitychange';
                document.addEventListener(evtname, () => {
                    // resize after a tab has been shown (fixes safari layout issue)
                    if (!Utils.Documents.isHidden()){
                        this.resize();
                    }
                });
            }

            if (Utils.Bools.getBool(this.config.options.dropEnabled, true)){
                this.$element.on('drop', (e => {
                    e.preventDefault();
                    var dropUrl = (<any>e.originalEvent).dataTransfer.getData("URL");
                    var url = Utils.Urls.getUrlParts(dropUrl);
                    var manifestUri = Utils.Urls.getQuerystringParameterFromString('manifest', url.search);
                    //var canvasUri = Utils.Urls.getQuerystringParameterFromString('canvas', url.search);

                    if (manifestUri){
                        this.triggerSocket(BaseCommands.DROP, manifestUri);

                        var p = new BootstrapParams();
                        p.manifestUri = manifestUri;
                        this.reload(p);
                    }
                }));
            }

            this.$element.on('dragover', (e => {
                // allow drop
                e.preventDefault();
            }));

            // keyboard events.

            $(document).on('keyup keydown', (e) => {
                this.shifted = e.shiftKey;
                this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
            });

            $(document).keydown((e) => {

                var event: string = null;
                var preventDefault: boolean = true;

                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) {
                        event = BaseCommands.RETURN;
                        preventDefault = false;
                    }
                    if (e.keyCode === KeyCodes.KeyDown.Escape) event = BaseCommands.ESCAPE;
                    if (e.keyCode === KeyCodes.KeyDown.PageUp) event = BaseCommands.PAGE_UP;
                    if (e.keyCode === KeyCodes.KeyDown.PageDown) event = BaseCommands.PAGE_DOWN;
                    if (e.keyCode === KeyCodes.KeyDown.End) event = BaseCommands.END;
                    if (e.keyCode === KeyCodes.KeyDown.Home) event = BaseCommands.HOME;
                    if (e.keyCode === KeyCodes.KeyDown.NumpadPlus || e.keyCode === 171 || e.keyCode === KeyCodes.KeyDown.Equals) {
                        event = BaseCommands.PLUS;
                        preventDefault = false;  
                    } 
                    if (e.keyCode === KeyCodes.KeyDown.NumpadMinus || e.keyCode === 173 || e.keyCode === KeyCodes.KeyDown.Dash) {
                        event = BaseCommands.MINUS;
                        preventDefault = false;
                    } 

                    if (that.useArrowKeysToNavigate()) {
                        if (e.keyCode === KeyCodes.KeyDown.LeftArrow) event = BaseCommands.LEFT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.UpArrow) event = BaseCommands.UP_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.RightArrow) event = BaseCommands.RIGHT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.DownArrow) event = BaseCommands.DOWN_ARROW;
                    }
                }

                if (event) {
                    if (preventDefault) {
                        e.preventDefault();
                    }
                    $.publish(event);
                }
            });

            if (this.bootstrapper.params.isHomeDomain && Utils.Documents.isInIFrame()) {

                $.subscribe(BaseCommands.PARENT_EXIT_FULLSCREEN, () => {
                    if (this.isOverlayActive()) {
                        $.publish(BaseCommands.ESCAPE);
                    }

                    $.publish(BaseCommands.ESCAPE);
                    $.publish(BaseCommands.RESIZE);
                });
            }
        }

        this.$element.append('<a href="/" id="top"></a>');
        this.$element.append('<iframe id="commsFrame" style="display:none"></iframe>');

        $.subscribe(BaseCommands.ACCEPT_TERMS, () => {
            this.triggerSocket(BaseCommands.ACCEPT_TERMS);
        });

        $.subscribe(BaseCommands.LOGIN_FAILED, () => {
            this.triggerSocket(BaseCommands.LOGIN_FAILED);
            this.showMessage(this.config.content.authorisationFailedMessage);
        });

        $.subscribe(BaseCommands.LOGIN, () => {
            this.isLoggedIn = true;
            this.triggerSocket(BaseCommands.LOGIN);
        });

        $.subscribe(BaseCommands.LOGOUT, () => {
            this.isLoggedIn = false;
            this.triggerSocket(BaseCommands.LOGOUT);
        });

        $.subscribe(BaseCommands.BOOKMARK, () => {
            this.bookmark();
            this.triggerSocket(BaseCommands.BOOKMARK);
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, () => {
            this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGED, canvasIndex);
        });

        $.subscribe(BaseCommands.CLICKTHROUGH, () => {
            this.triggerSocket(BaseCommands.CLICKTHROUGH);
        });

        $.subscribe(BaseCommands.CLOSE_ACTIVE_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
        });

        $.subscribe(BaseCommands.CLOSE_LEFT_PANEL, () => {
            this.triggerSocket(BaseCommands.CLOSE_LEFT_PANEL);
            this.resize();
        });

        $.subscribe(BaseCommands.CLOSE_RIGHT_PANEL, () => {
            this.triggerSocket(BaseCommands.CLOSE_RIGHT_PANEL);
            this.resize();
        });

        $.subscribe(BaseCommands.CREATED, () => {
            this.isCreated = true;
            this.triggerSocket(BaseCommands.CREATED);
        });

        $.subscribe(BaseCommands.DOWN_ARROW, () => {
            this.triggerSocket(BaseCommands.DOWN_ARROW);
        });

        $.subscribe(BaseCommands.DOWNLOAD, (e, obj) => {
            this.triggerSocket(BaseCommands.DOWNLOAD, obj);
        });

        $.subscribe(BaseCommands.END, () => {
            this.triggerSocket(BaseCommands.END);
        });

        $.subscribe(BaseCommands.ESCAPE, () => {
            this.triggerSocket(BaseCommands.ESCAPE);

            if (this.isFullScreen() && !this.isOverlayActive()) {
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            }
        });

        $.subscribe(BaseCommands.EXTERNAL_LINK_CLICKED, (e, url) => {
            this.triggerSocket(BaseCommands.EXTERNAL_LINK_CLICKED, url);
        });

        $.subscribe(BaseCommands.FEEDBACK, () => {
            this.feedback();
        });

        $.subscribe(BaseCommands.FORBIDDEN, () => {
            this.triggerSocket(BaseCommands.FORBIDDEN);
            $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE);
        });

        $.subscribe(BaseCommands.HIDE_DOWNLOAD_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_EMBED_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_EMBED_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_GENERIC_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_GENERIC_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_HELP_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_HELP_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_INFORMATION, () => {
            this.triggerSocket(BaseCommands.HIDE_INFORMATION);
        });

        $.subscribe(BaseCommands.HIDE_LOGIN_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_LOGIN_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_OVERLAY, () => {
            this.triggerSocket(BaseCommands.HIDE_OVERLAY);
        });

        $.subscribe(BaseCommands.HIDE_RESTRICTED_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_RESTRICTED_DIALOGUE);
        });

        $.subscribe(BaseCommands.HIDE_SETTINGS_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.HIDE_SETTINGS_DIALOGUE);
        });

        $.subscribe(BaseCommands.HOME, () => {
            this.triggerSocket(BaseCommands.HOME);
        });

        $.subscribe(BaseCommands.LEFT_ARROW, () => {
            this.triggerSocket(BaseCommands.LEFT_ARROW);
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.triggerSocket(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, () => {
            this.triggerSocket(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH, () => {
            this.triggerSocket(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, () => {
            this.triggerSocket(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
        });

        $.subscribe(BaseCommands.LOAD_FAILED, () => {
            this.triggerSocket(BaseCommands.LOAD_FAILED);

            if (!_.isNull(that.lastCanvasIndex) && that.lastCanvasIndex !== that.helper.canvasIndex){
                this.viewCanvas(that.lastCanvasIndex);
            }
        });

        $.subscribe(BaseCommands.NOT_FOUND, () => {
            this.triggerSocket(BaseCommands.NOT_FOUND);
        });

        $.subscribe(BaseCommands.OPEN, () => {
            this.triggerSocket(BaseCommands.OPEN);

            var openUri: string = String.format(this.config.options.openTemplate, this.helper.iiifResourceUri);

            window.open(openUri);
        });

        $.subscribe(BaseCommands.OPEN_LEFT_PANEL, () => {
            this.triggerSocket(BaseCommands.OPEN_LEFT_PANEL);
            this.resize();
        });

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, () => {
            this.triggerSocket(BaseCommands.OPEN_EXTERNAL_RESOURCE);
        });

        $.subscribe(BaseCommands.OPEN_RIGHT_PANEL, () => {
            this.triggerSocket(BaseCommands.OPEN_RIGHT_PANEL);
            this.resize();
        });

        $.subscribe(BaseCommands.PAGE_DOWN, () => {
            this.triggerSocket(BaseCommands.PAGE_DOWN);
        });

        $.subscribe(BaseCommands.PAGE_UP, () => {
            this.triggerSocket(BaseCommands.PAGE_UP);
        });

        $.subscribe(BaseCommands.RESOURCE_DEGRADED, (e, resource: ExternalResource) => {
            this.triggerSocket(BaseCommands.RESOURCE_DEGRADED);
            this.handleDegraded(resource)
        });

        $.subscribe(BaseCommands.RETURN, () => {
            this.triggerSocket(BaseCommands.RETURN);
        });

        $.subscribe(BaseCommands.RIGHT_ARROW, () => {
            this.triggerSocket(BaseCommands.RIGHT_ARROW);
        });

        $.subscribe(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.triggerSocket(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_FINISH);
        });

        $.subscribe(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_START, () => {
            this.triggerSocket(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_START);
        });

        $.subscribe(BaseCommands.RIGHTPANEL_EXPAND_FULL_FINISH, () => {
            this.triggerSocket(BaseCommands.RIGHTPANEL_EXPAND_FULL_FINISH);
        });

        $.subscribe(BaseCommands.RIGHTPANEL_EXPAND_FULL_START, () => {
            this.triggerSocket(BaseCommands.RIGHTPANEL_EXPAND_FULL_START);
        });

        $.subscribe(BaseCommands.SEQUENCE_INDEX_CHANGED, () => {
            this.triggerSocket(BaseCommands.SEQUENCE_INDEX_CHANGED);
        });

        $.subscribe(BaseCommands.SETTINGS_CHANGED, (e, args) => {
            this.triggerSocket(BaseCommands.SETTINGS_CHANGED, args);
        });

        $.subscribe(BaseCommands.SHOW_DOWNLOAD_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_EMBED_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_GENERIC_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_GENERIC_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_HELP_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_HELP_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_INFORMATION, () => {
            this.triggerSocket(BaseCommands.SHOW_INFORMATION);
        });

        $.subscribe(BaseCommands.SHOW_LOGIN_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_LOGIN_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_RESTRICTED_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_RESTRICTED_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_OVERLAY, () => {
            this.triggerSocket(BaseCommands.SHOW_OVERLAY);
        });

        $.subscribe(BaseCommands.SHOW_SETTINGS_DIALOGUE, () => {
            this.triggerSocket(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        });

        $.subscribe(BaseCommands.SHOW_TERMS_OF_USE, () => {
            this.triggerSocket(BaseCommands.SHOW_TERMS_OF_USE);
            
            // todo: Eventually this should be replaced with a suitable IIIF Presentation API field - until then, use attribution
            var terms: string = this.helper.getAttribution();

            this.showMessage(terms);
        });

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, thumb: IThumb) => {
            this.triggerSocket(BaseCommands.THUMB_SELECTED, thumb.index);
        });

        $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, () => {
            $('#top').focus();
            this.bootstrapper.isFullScreen = !this.bootstrapper.isFullScreen;

            this.triggerSocket(BaseCommands.TOGGLE_FULLSCREEN,
                {
                    isFullScreen: this.bootstrapper.isFullScreen,
                    overrideFullScreen: this.config.options.overrideFullScreen
                });
        });

        $.subscribe(BaseCommands.UP_ARROW, () => {
            this.triggerSocket(BaseCommands.UP_ARROW);
        });

        $.subscribe(BaseCommands.UPDATE_SETTINGS, () => {
            this.triggerSocket(BaseCommands.UPDATE_SETTINGS);
        });

        $.subscribe(BaseCommands.VIEW_FULL_TERMS, () => {
            this.triggerSocket(BaseCommands.VIEW_FULL_TERMS);
        });

        $.subscribe(BaseCommands.WINDOW_UNLOAD, () => {
            this.triggerSocket(BaseCommands.WINDOW_UNLOAD);
        });

        // create shell and shared views.
        this.shell = new Shell(this.$element);

        // dependencies
        if (overrideDependencies){
            this.loadDependencies(overrideDependencies);
        } else {
            this.getDependencies((deps: any) => {
                this.loadDependencies(deps);
            });
        }
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
        var that = this;

        // todo: use compiler flag (when available)
        var depsUri = (window.DEBUG) ? '../../extensions/' + this.name + '/dependencies' : this.name + '-dependencies';

        // check if the deps are already loaded
        var scripts = $('script[data-requiremodule]')
            .filter(function() {
                var attr = $(this).attr('data-requiremodule');
                return (attr.indexOf(that.name) != -1 && attr.indexOf('dependencies') != -1)
            });

        if (!scripts.length) {

            require([depsUri], function (deps) {
                // if debugging, set the base uri to the extension's directory.
                // otherwise set it to the current directory (where app.js is hosted).

                // todo: use compiler flag (when available)
                var baseUri = (window.DEBUG) ? '../../extensions/' + that.name + '/lib/' : '';

                // for each dependency, prepend baseUri.
                for (var i = 0; i < deps.dependencies.length; i++) {
                    deps.dependencies[i] = baseUri + deps.dependencies[i];
                }

                cb(deps);
            });
        } else {
            cb(null);
        }
    }

    loadDependencies(deps: any): void {
        var that = this;

        if (deps){
            require(deps.dependencies, function () {
                that.dependenciesLoaded();
            });
        } else {
            that.dependenciesLoaded();
        }
    }

    dependenciesLoaded(): void {
        this.createModules();
        this.modulesCreated();
        $.publish(BaseCommands.RESIZE); // initial sizing
        $.publish(BaseCommands.CREATED);
        this.setParams();
        this.setDefaultFocus();
        this.viewCanvas(this.getCanvasIndexParam());
    }

    setParams(): void{
        if (!this.isHomeDomain) return;

        this.setParam(Params.collectionIndex, this.helper.collectionIndex);
        this.setParam(Params.manifestIndex, this.helper.manifestIndex);
        this.setParam(Params.sequenceIndex, this.helper.sequenceIndex);
        this.setParam(Params.canvasIndex, this.helper.canvasIndex);
    }

    setDefaultFocus(): void {
        setTimeout(() => {
            if (this.config.options.allowStealFocus) {
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

    triggerSocket(eventName: string, eventObject?: any): void {
        jQuery(document).trigger(eventName, [eventObject]);
        if (this.bootstrapper.socket) {
            this.bootstrapper.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
        }
    }

    redirect(uri: string): void {
        this.triggerSocket(BaseCommands.REDIRECT, uri);
    }

    refresh(): void {
        this.triggerSocket(BaseCommands.REFRESH, null);
    }

    private _parseMetrics(): void {
        const metrics: any[] = this.config.options.metrics;

        if (metrics) {
            for (let i = 0; i < metrics.length; i++) {
                const m: any = metrics[i];
                m.type = new MetricType(m.type);
                this.metrics.push(m);
            }
        }
    }

    private _updateMetric(): void {

        for (let i = 0; i < this.metrics.length; i++) {
            const metric: Metric = this.metrics[i];

            if (this.width() > metric.minWidth && this.width() <= metric.maxWidth) {
                if (this.metric !== metric.type) {
                    this.metric = metric.type;
                    $.publish(BaseCommands.METRIC_CHANGED);
                }
            }
        }
    }

    resize(): void {
        this._updateMetric();
        $.publish(BaseCommands.RESIZE);
    }

    handleParentFrameEvent(message): void {
        Utils.Async.waitFor(() => {
            return this.isCreated;
        }, () => {
            switch (message.eventName) {
                case BaseCommands.TOGGLE_FULLSCREEN:
                    $.publish(BaseCommands.TOGGLE_FULLSCREEN, message.eventObject);
                    break;
                case BaseCommands.PARENT_EXIT_FULLSCREEN:
                    $.publish(BaseCommands.PARENT_EXIT_FULLSCREEN);
                    break;
            }
        });
    }

    // re-bootstraps the application with new querystring params
    reload(params?: BootstrapParams): void {
        var p = new BootstrapParams();

        if (params){
            p = $.extend(p, params);
        }

        p.isReload = true;
        $.disposePubSub();
        this.bootstrapper.bootstrap(p);
    }

    getCanvasIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.canvasIndex);
    }

    getSequenceIndexParam(): number {
        return this.bootstrapper.params.getParam(Params.sequenceIndex);
    }

    isSeeAlsoEnabled(): boolean{
        return this.config.options.seeAlsoEnabled !== false;
    }

    getShareUrl(): string {
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

    addTimestamp(uri: string): string{
        return uri + "?t=" + Utils.Dates.getTimeStamp();
    }

    isDeepLinkingEnabled(): boolean {
        return (this.isHomeDomain && this.isOnlyInstance);
    }

    isOnHomeDomain(): boolean {
        return this.isDeepLinkingEnabled();
    }

    getDomain(): string{
        var parts = Utils.Urls.getUrlParts(this.helper.iiifResourceUri);
        return parts.host;
    }

    getEmbedDomain(): string{
        return this.embedDomain;
    }

    getSettings(): ISettings {
        if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {

            var settings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
            
            if (settings){
                return $.extend(this.config.options, settings.value);
            }
        }
        
        return this.config.options;
    }

    updateSettings(settings: ISettings): void {
        if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {

            var storedSettings = Utils.Storage.get("uv.settings", Utils.StorageType.local);

            if (storedSettings){
                settings = $.extend(storedSettings.value, settings);
            }
                
            // store for ten years
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

        var limitLocales: boolean = Utils.Bools.getBool(this.config.options.limitLocales, false);

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

    getSharePreview(): any {
        var preview: any = {};

        preview.title = this.helper.getLabel();

        // todo: use getThumb (when implemented)

        var canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();

        var thumbnail = canvas.getProperty('thumbnail');

        if (!thumbnail || !_.isString(thumbnail)){
            thumbnail = canvas.getCanonicalImageUri(this.config.options.bookmarkThumbWidth);
        }

        preview.image = thumbnail;

        return preview;
    }

    public getPagedIndices(canvasIndex?: number): number[] {
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.helper.canvasIndex;

        return [canvasIndex];
    }

    public getCurrentCanvases(): Manifesto.ICanvas[] {
        var indices: number[] = this.getPagedIndices(this.helper.canvasIndex);
        var canvases: Manifesto.ICanvas[] = [];
        
        for (var i = 0; i < indices.length; i++) {
            var index: number = indices[i];
            var canvas: Manifesto.ICanvas = this.helper.getCanvasByIndex(index);
            canvases.push(canvas);
        }
        
        return canvases;
    }

    public getCanvasLabels(label: string): string {
        var indices: number[] = this.getPagedIndices();
        var labels: string = "";

        if (indices.length === 1) {
            labels = label;
        } else {
            for (var i = 1; i <= indices.length; i++) {
                if (labels.length) labels += ",";
                labels += label + " " + i;
            }
        }

        return labels;
    }

    public getCurrentCanvasRange(): Manifesto.IRange {
        //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
        //var range: Manifesto.IRange = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
        var range: Manifesto.IRange = this.helper.getCanvasRange(this.helper.getCurrentCanvas());
        return range;
    }

    public getExternalResources(resources?: Manifold.ExternalResource[]): Promise<Manifold.ExternalResource[]> {

        var indices = this.getPagedIndices();
        var resourcesToLoad = [];

        _.each(indices, (index) => {
            var canvas: Manifesto.ICanvas = this.helper.getCanvasByIndex(index);
            var r: Manifold.ExternalResource = new Manifold.ExternalResource(canvas, this.helper.getInfoUri);
            r.index = index;

            // used to reload resources with isResponseHandled = true.
            if (resources){
                var found: Manifold.ExternalResource = _.find(resources, (f: Manifold.ExternalResource) => {
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

        var storageStrategy: string = this.config.options.tokenStorage;

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
                    this.resources = _.map(r, (resource: Manifold.ExternalResource) => {
                        resource.data.index = resource.index;
                        return <Manifold.ExternalResource>_.toPlainObject(resource.data);
                    });
                    resolve(this.resources);
                })['catch']((error: any) => {
                    switch(error.name) {
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseCommands.LOGIN_FAILED);
                            break;
                        case manifesto.StatusCodes.FORBIDDEN.toString():
                            $.publish(BaseCommands.FORBIDDEN);
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

    // get hash or data-attribute params depending on whether the UV is embedded.
    getParam(key: Params): any {
        var value;

        // deep linking is only allowed when hosted on home domain.
        if (this.isDeepLinkingEnabled()) {
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.getHashParameter(this.bootstrapper.params.paramMap[key], parent.document);
        }

        if (!value) {
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.getQuerystringParameter(this.bootstrapper.params.paramMap[key]);
        }

        return value;
    }

    // set hash params depending on whether the UV is embedded.
    setParam(key: Params, value: any): void {

        if (this.isDeepLinkingEnabled()) {
            Utils.Urls.setHashParameter(this.bootstrapper.params.paramMap[key], value, parent.document);
        }
    }

    viewCanvas(canvasIndex: number): void {

        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)){
            this.showMessage(this.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        this.lastCanvasIndex = this.helper.canvasIndex;
        this.helper.canvasIndex = canvasIndex;

        $.publish(BaseCommands.CANVAS_INDEX_CHANGED, [canvasIndex]);
        $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE);

        this.setParam(Params.canvasIndex, canvasIndex);
    }

    showMessage(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void {

        this.closeActiveDialogue();

        $.publish(BaseCommands.SHOW_GENERIC_DIALOGUE, [
            {
                message: message,
                acceptCallback: acceptCallback,
                buttonText: buttonText,
                allowClose: allowClose
            }]);
    }

    closeActiveDialogue(): void{
        $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
    }

    isOverlayActive(): boolean{
        return Shell.$overlays.is(':visible');
    }

    viewManifest(manifest: Manifesto.IManifest): void{
        var p = new BootstrapParams();
        p.manifestUri = this.helper.iiifResourceUri;
        p.collectionIndex = this.helper.getCollectionIndex(manifest);
        p.manifestIndex = manifest.index;
        p.sequenceIndex = 0;
        p.canvasIndex = 0;

        this.reload(p);
    }

    viewCollection(collection: Manifesto.ICollection): void{
        var p = new BootstrapParams();
        p.manifestUri = this.helper.iiifResourceUri;
        p.collectionIndex = collection.index;
        p.manifestIndex = 0;
        p.sequenceIndex = 0;
        p.canvasIndex = 0;

        this.reload(p);
    }

    isFullScreen(): boolean {
        return this.bootstrapper.isFullScreen;
    }

    isHeaderPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.config.options.headerPanelEnabled, true);
    }

    isLeftPanelEnabled(): boolean {
        if (Utils.Bools.getBool(this.config.options.leftPanelEnabled, true)){
            if (this.helper.hasParentCollection()){
                return true;
            } else if (this.helper.isMultiCanvas()){
                if (this.helper.getViewingHint().toString() !== manifesto.ViewingHint.continuous().toString()){
                    return true;
                }
            }
        }

        return false;
    }

    isRightPanelEnabled(): boolean {
        return  Utils.Bools.getBool(this.config.options.rightPanelEnabled, true);
    }

    isFooterPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.config.options.footerPanelEnabled, true);
    }

    useArrowKeysToNavigate(): boolean {
        return Utils.Bools.getBool(this.config.options.useArrowKeysToNavigate, true);
    }

    bookmark(): void {
        // override for each extension
    }

    feedback(): void {
        this.triggerSocket(BaseCommands.FEEDBACK, new BootstrapParams());
    }

    getBookmarkUri(): string {
        var absUri = parent.document.URL;
        var parts = Utils.Urls.getUrlParts(absUri);
        var relUri = parts.pathname + parts.search + parent.document.location.hash;

        if (!relUri.startsWith("/")) {
            relUri = "/" + relUri;
        }

        return relUri;
    }

    // auth

    clickThrough(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            $.publish(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    var win = window.open(resource.clickThroughService.id);

                    var pollTimer = window.setInterval(() => {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseCommands.CLICKTHROUGH);
                            resolve();
                        }
                    }, 500);
                }
            }]);
        });
    }

    restricted(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            $.publish(BaseCommands.SHOW_RESTRICTED_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    $.publish(BaseCommands.LOAD_FAILED);
                    reject(resource);
                }
            }]);
        });
    }

    login(resource: Manifold.ExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            var options: ILoginDialogueOptions = <ILoginDialogueOptions>{};

            if (resource.status === HTTPStatusCode.FORBIDDEN){
                options.warningMessage = LoginWarningMessages.FORBIDDEN;
                options.showCancelButton = true;
            }

            $.publish(BaseCommands.SHOW_LOGIN_DIALOGUE, [{
                resource: resource,
                loginCallback: () => {
                    var win = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                    var pollTimer = window.setInterval(function () {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseCommands.LOGIN);
                            resolve();
                        }
                    }, 500);
                },
                logoutCallback: () => {
                    var win = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                    var pollTimer = window.setInterval(function () {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseCommands.LOGOUT);
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
            var serviceUri: string = resource.tokenService.id;

            // pick an identifier for this message. We might want to keep track of sent messages
            var msgId = serviceUri + "|" + new Date().getTime();

            var receiveAccessToken = (e) => {
                window.removeEventListener("message", receiveAccessToken);
                var token = e.data;
                if (token.error){
                    if(rejectOnError) {
                        reject(token.errorDescription);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(token);
                }
            };

            window.addEventListener("message", receiveAccessToken, false);

            var tokenUri: string = serviceUri + "?messageId=" + msgId;
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

            var foundItems: storage.StorageItem[] = [];

            var item: storage.StorageItem;
            // try to match on the tokenService, if the resource has one:
            if(resource.tokenService) {
                item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
            }

            if (item){
                foundItems.push(item);
            } else {
                // find an access token for the domain
                var domain = Utils.Urls.getUrlParts(resource.dataUri).hostname;

                var items: storage.StorageItem[] = Utils.Storage.getItems(new Utils.StorageType(storageStrategy));

                for(var i = 0; i < items.length; i++) {
                    item = items[i];

                    if(item.key.contains(domain)) {
                        foundItems.push(item);
                    }
                }
            }

            // sort by expiresAt
            foundItems = _.sortBy(foundItems, (item: storage.StorageItem) => {
                return item.expiresAt;
            });

            var foundToken: IAccessToken;

            if (foundItems.length){
                foundToken = <Manifesto.IAccessToken>foundItems.last().value
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
                $.publish(BaseCommands.RESOURCE_DEGRADED, [resource]);
            } else {

                if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                    resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                    // if the browser doesn't support CORS
                    if (!Modernizr.cors) {
                        var informationArgs:InformationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
                        $.publish(BaseCommands.SHOW_INFORMATION, [informationArgs]);
                        resolve(resource);
                    } else {
                        reject(resource.error.statusText);
                    }
                } else if (resource.error.status === HTTPStatusCode.FORBIDDEN){
                    var error: Error = new Error();
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
        var informationArgs: InformationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
        $.publish(BaseCommands.SHOW_INFORMATION, [informationArgs]);
    }
}

export = BaseExtension;
