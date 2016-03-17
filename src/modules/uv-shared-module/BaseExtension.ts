import BaseCommands = require("./BaseCommands");
import BaseProvider = require("./BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import BootstrapParams = require("../../BootstrapParams");
import ClickThroughDialogue = require("../../modules/uv-dialogues-module/ClickThroughDialogue");
import RestrictedDialogue = require("../../modules/uv-dialogues-module/RestrictedDialogue");
import ExternalResource = require("./ExternalResource");
import IExtension = require("./IExtension");
import Information = require("./Information");
import InformationAction = require("./InformationAction");
import InformationArgs = require("./InformationArgs");
import InformationType = require("./InformationType");
import IProvider = require("./IProvider");
import LoginDialogue = require("../../modules/uv-dialogues-module/LoginDialogue");
import Params = require("../../Params");
import Shell = require("./Shell");
import IAccessToken = Manifesto.IAccessToken;
import ILoginDialogueOptions = require("./ILoginDialogueOptions");
import LoginWarningMessages = require("./LoginWarningMessages");

class BaseExtension implements IExtension {

    $clickThroughDialogue: JQuery;
    $restrictedDialogue: JQuery;
    $element: JQuery;
    $loginDialogue: JQuery;
    bootstrapper: BootStrapper;
    canvasIndex: number;
    clickThroughDialogue: ClickThroughDialogue;
    restrictedDialogue: RestrictedDialogue;
    embedHeight: number;
    embedWidth: number;
    extensions: any;
    loginDialogue: LoginDialogue;
    mouseX: number;
    mouseY: number;
    name: string;
    provider: IProvider;
    shell: Shell;
    shifted: boolean = false;
    tabbing: boolean = false;

    constructor(bootstrapper: BootStrapper) {
        this.bootstrapper = bootstrapper;
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

        if (!this.provider.isReload && Utils.Documents.IsInIFrame()){
            // communication with parent frame (if it exists).
            this.bootstrapper.socket = new easyXDM.Socket({
                onMessage: (message, origin) => {
                    message = $.parseJSON(message);
                    // todo: waitFor CREATED
                    this.handleParentFrameEvent(message);
                }
            });
        }

        this.triggerSocket(BaseCommands.LOAD, {
            bootstrapper: {
                config: this.provider.bootstrapper.config,
                params: this.provider.bootstrapper.params
            },
            preview: this.getSharePreview()
        });

        // add/remove classes.
        this.$element.empty();
        this.$element.removeClass();
        this.$element.addClass('browser-' + window.browserDetect.browser);
        this.$element.addClass('browser-version-' + window.browserDetect.version);
        if (!this.provider.isHomeDomain) this.$element.addClass('embedded');
        if (this.provider.isLightbox) this.$element.addClass('lightbox');

        // events.
        if (!this.provider.isReload){
            window.onresize = () => {

                var $win = $(window);
                $('body').height($win.height());

                this.resize();
            };

            $(document).on('mousemove', (e) => {
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            });

            this.$element.on('drop', (e => {
                e.preventDefault();
                var dropUrl = (<any>e.originalEvent).dataTransfer.getData("URL");
                var url = Utils.Urls.GetUrlParts(dropUrl);
                var manifestUri = Utils.Urls.GetQuerystringParameterFromString('manifest', url.search);
                //var canvasUri = Utils.Urls.GetQuerystringParameterFromString('canvas', url.search);

                if (manifestUri){
                    this.triggerSocket(BaseCommands.DROP, manifestUri);

                    var p = new BootstrapParams();
                    p.manifestUri = manifestUri;
                    this.provider.reload(p);
                }
            }));

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

                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) event = BaseCommands.RETURN;
                    if (e.keyCode === KeyCodes.KeyDown.Escape) event = BaseCommands.ESCAPE;
                    if (e.keyCode === KeyCodes.KeyDown.PageUp) event = BaseCommands.PAGE_UP;
                    if (e.keyCode === KeyCodes.KeyDown.PageDown) event = BaseCommands.PAGE_DOWN;
                    if (e.keyCode === KeyCodes.KeyDown.End) event = BaseCommands.END;
                    if (e.keyCode === KeyCodes.KeyDown.Home) event = BaseCommands.HOME;
                    if (e.keyCode === KeyCodes.KeyDown.NumpadPlus || e.keyCode === 171 || e.keyCode === KeyCodes.KeyDown.Equals) event = BaseCommands.PLUS;
                    if (e.keyCode === KeyCodes.KeyDown.NumpadMinus || e.keyCode === 173 || e.keyCode === KeyCodes.KeyDown.Dash) event = BaseCommands.MINUS;

                    if (that.useArrowKeysToNavigate()) {
                        if (e.keyCode === KeyCodes.KeyDown.LeftArrow) event = BaseCommands.LEFT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.UpArrow) event = BaseCommands.UP_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.RightArrow) event = BaseCommands.RIGHT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.DownArrow) event = BaseCommands.DOWN_ARROW;
                    }
                }

                if (event){
                    e.preventDefault();
                    $.publish(event);
                }
            });

            if (this.bootstrapper.params.isHomeDomain && Utils.Documents.IsInIFrame()) {

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

        $.subscribe(BaseCommands.ACCEPT_TERMS, () => {
            this.triggerSocket(BaseCommands.ACCEPT_TERMS);
        });

        $.subscribe(BaseCommands.AUTHORIZATION_FAILED, () => {
            this.triggerSocket(BaseCommands.AUTHORIZATION_FAILED);
            this.showMessage(this.provider.config.content.authorisationFailedMessage);
        });

        $.subscribe(BaseCommands.AUTHORIZATION_OCCURRED, () => {
            this.triggerSocket(BaseCommands.AUTHORIZATION_OCCURRED);
        });

        $.subscribe(BaseCommands.BOOKMARK, () => {
            this.bookmark();
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, () => {
            this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGED, canvasIndex);
        });

        $.subscribe(BaseCommands.CLICKTHROUGH_OCCURRED, () => {
            this.triggerSocket(BaseCommands.CLICKTHROUGH_OCCURRED);
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
            this.triggerSocket(BaseCommands.CREATED);
        });

        $.subscribe(BaseCommands.DOWN_ARROW, () => {
            this.triggerSocket(BaseCommands.DOWN_ARROW);
        });

        $.subscribe(BaseCommands.DOWNLOAD, (e, id) => {
            this.triggerSocket(BaseCommands.DOWNLOAD, id);
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

        $.subscribe(BaseCommands.EXTERNAL_LINK_CLICKED, (e, url) => {
            this.triggerSocket(BaseCommands.EXTERNAL_LINK_CLICKED, url);
        });

        $.subscribe(BaseCommands.NOT_FOUND, () => {
            this.triggerSocket(BaseCommands.NOT_FOUND);
        });

        $.subscribe(BaseCommands.OPEN, () => {
            this.triggerSocket(BaseCommands.OPEN);

            var openUri: string = String.format(this.provider.config.options.openTemplate, this.provider.manifestUri);

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

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, canvasIndex: number) => {
            this.triggerSocket(BaseCommands.THUMB_SELECTED, canvasIndex);
        });

        $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, () => {
            $('#top').focus();
            this.bootstrapper.isFullScreen = !this.bootstrapper.isFullScreen;

            this.triggerSocket(BaseCommands.TOGGLE_FULLSCREEN,
                {
                    isFullScreen: this.bootstrapper.isFullScreen,
                    overrideFullScreen: this.provider.config.options.overrideFullScreen
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

        // set canvasIndex to -1 (nothing selected yet).
        this.canvasIndex = -1;

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
        this.viewCanvas(this.provider.getCanvasIndexParam());
    }

    setParams(): void{
        if (!this.provider.isHomeDomain) return;

        this.setParam(Params.collectionIndex, this.provider.collectionIndex);
        this.setParam(Params.manifestIndex, this.provider.manifestIndex);
        this.setParam(Params.sequenceIndex, this.provider.sequenceIndex);
        this.setParam(Params.canvasIndex, this.provider.canvasIndex);
    }

    setDefaultFocus(): void {
        setTimeout(() => {
            $('[tabindex=1]').focus();
        }, 1);
    }

    width(): number {
        return $(window).width();
    }

    height(): number {
        return $(window).height();
    }

    triggerSocket(eventName: string, eventObject?: any): void {
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

    resize(): void {
        $.publish(BaseCommands.RESIZE);
    }

    handleParentFrameEvent(message): void {
        // todo: waitFor CREATED
        setTimeout(() => {
            switch (message.eventName) {
                case BaseCommands.TOGGLE_FULLSCREEN:
                    $.publish(BaseCommands.TOGGLE_FULLSCREEN, message.eventObject);
                    break;
                case BaseCommands.PARENT_EXIT_FULLSCREEN:
                    $.publish(BaseCommands.PARENT_EXIT_FULLSCREEN);
                    break;
            }
        }, 1000);
    }

    getSharePreview(): any {
        var preview: any = {};

        preview.title = this.provider.getTitle();

        // todo: use getThumb (when implemented)

        var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

        var thumbnail = canvas.getProperty('thumbnail');

        if (!thumbnail || !_.isString(thumbnail)){
            thumbnail = canvas.getThumbUri(this.provider.config.options.bookmarkThumbWidth, this.provider.config.options.bookmarkThumbHeight);
        }

        preview.image = thumbnail;

        return preview;
    }

    getExternalResources(resources?: Manifesto.IExternalResource[]): Promise<Manifesto.IExternalResource[]> {

        var indices = this.provider.getPagedIndices();
        var resourcesToLoad = [];

        _.each(indices, (index) => {
            var canvas: Manifesto.ICanvas = this.provider.getCanvasByIndex(index);
            var r: Manifesto.IExternalResource = new ExternalResource(canvas, this.provider.getInfoUri);

            // used to reload resources with isResponseHandled = true.
            if (resources){
                var found: Manifesto.IExternalResource = _.find(resources, (f: Manifesto.IExternalResource) => {
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

        var storageStrategy: string = this.provider.config.options.tokenStorage;

        return new Promise<Manifesto.IExternalResource[]>((resolve) => {
            manifesto.loadExternalResources(
                resourcesToLoad,
                storageStrategy,
                this.clickThrough,
                this.restricted,
                this.login,
                this.getAccessToken,
                this.storeAccessToken,
                this.getStoredAccessToken,
                this.handleExternalResourceResponse).then((r: Manifesto.IExternalResource[]) => {
                    this.provider.resources = _.map(r, (resource: Manifesto.IExternalResource) => {
                        return <Manifesto.IExternalResource>_.toPlainObject(resource.data);
                    });
                    resolve(this.provider.resources);
                })['catch']((error: any) => {
                    switch(error.name){
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseCommands.AUTHORIZATION_FAILED);
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
    getParam(key: Params): any{
        var value;

        // deep linking is only allowed when hosted on home domain.
        if (this.provider.isDeepLinkingEnabled()){
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.GetHashParameter(this.provider.bootstrapper.params.paramMap[key], parent.document);
        }

        if (!value){
            // todo: use a static type on bootstrapper.params
            value = Utils.Urls.GetQuerystringParameter(this.provider.bootstrapper.params.paramMap[key]);
        }

        return value;
    }

    // set hash params depending on whether the UV is embedded.
    setParam(key: Params, value: any): void{

        if (this.provider.isDeepLinkingEnabled()){
            Utils.Urls.SetHashParameter(this.provider.bootstrapper.params.paramMap[key], value, parent.document);
        }
    }

    viewCanvas(canvasIndex: number): void {
        if (canvasIndex === -1) return;

        if (this.provider.isCanvasIndexOutOfRange(canvasIndex)){
            this.showMessage(this.provider.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        this.provider.canvasIndex = canvasIndex;

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
        p.manifestUri = this.provider.manifestUri;
        p.collectionIndex = this.provider.getCollectionIndex(manifest);
        p.manifestIndex = manifest.index;
        p.sequenceIndex = 0;
        p.canvasIndex = 0;

        this.provider.reload(p);
    }

    viewCollection(collection: Manifesto.ICollection): void{
        var p = new BootstrapParams();
        p.manifestUri = this.provider.manifestUri;
        p.collectionIndex = collection.index;
        p.manifestIndex = 0;
        p.sequenceIndex = 0;
        p.canvasIndex = 0;

        this.provider.reload(p);
    }

    isFullScreen(): boolean {
        return this.bootstrapper.isFullScreen;
    }

    isLeftPanelEnabled(): boolean {
        if (Utils.Bools.GetBool(this.provider.config.options.leftPanelEnabled, true)){
            if (this.provider.isMultiCanvas()){
                if (this.provider.getViewingHint().toString() !== manifesto.ViewingHint.continuous().toString()){
                    return true;
                }
            }
        }

        return false;
    }

    isRightPanelEnabled(): boolean {
        return  Utils.Bools.GetBool(this.provider.config.options.rightPanelEnabled, true);
    }

    useArrowKeysToNavigate(): boolean {
        return Utils.Bools.GetBool(this.provider.config.options.useArrowKeysToNavigate, true);
    }

    bookmark(): void {
        // override for each extension
    }

    feedback(): void {
        this.triggerSocket(BaseCommands.FEEDBACK, new BootstrapParams());
    }

    getBookmarkUri(): string {
        var absUri = parent.document.URL;
        var parts = Utils.Urls.GetUrlParts(absUri);
        var relUri = parts.pathname + parts.search + parent.document.location.hash;

        if (!relUri.startsWith("/")) {
            relUri = "/" + relUri;
        }

        return relUri;
    }

    // auth

    clickThrough(resource: Manifesto.IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            $.publish(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    var win = window.open(resource.clickThroughService.id);

                    var pollTimer = window.setInterval(() => {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseCommands.CLICKTHROUGH_OCCURRED);
                            resolve();
                        }
                    }, 500);
                }
            }]);
        });
    }

    restricted(resource: Manifesto.IExternalResource): Promise<void> {
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

    login(resource: Manifesto.IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            var options: ILoginDialogueOptions = <ILoginDialogueOptions>{};

            if (resource.status === HTTPStatusCode.FORBIDDEN){
                options.warningMessage = LoginWarningMessages.FORBIDDEN;
                options.showCancelButton = true;
            }

            $.publish(BaseCommands.SHOW_LOGIN_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    var win = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                    var pollTimer = window.setInterval(function () {
                        if (win.closed) {
                            window.clearInterval(pollTimer);
                            $.publish(BaseCommands.AUTHORIZATION_OCCURRED);
                            resolve();
                        }
                    }, 500);
                },
                options: options
            }]);
        });
    }

    getAccessToken(resource: Manifesto.IExternalResource, rejectOnError: boolean): Promise<Manifesto.IAccessToken> {
        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {
            $.getJSON(resource.tokenService.id + "?callback=?", (token: Manifesto.IAccessToken) => {
                if (token.error){
                    if(rejectOnError) {
                        reject(token.errorDescription);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(token);
                }
            }).fail((error) => {
                if(rejectOnError) {
                    reject(error);
                } else {
                    resolve(null);
                }
            });
        });
    }

    storeAccessToken(resource: Manifesto.IExternalResource, token: Manifesto.IAccessToken, storageStrategy: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Utils.Storage.set(resource.tokenService.id, token, token.expiresIn, new Utils.StorageType(storageStrategy));
            resolve();
        });
    }

    getStoredAccessToken(resource: Manifesto.IExternalResource, storageStrategy: string): Promise<Manifesto.IAccessToken> {

        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {

            var foundItems: storage.StorageItem[] = [];

            var item: storage.StorageItem;
            // try to match on the tokenService, if the resource has one:
            if(resource.tokenService) {
                item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
            }

            // first try an exact match of the url
            //var item: storage.StorageItem = Utils.Storage.get(resource.dataUri, new Utils.StorageType(storageStrategy));

            if (item){
                foundItems.push(item);
            } else {
                // find an access token for the domain
                var domain = Utils.Urls.GetUrlParts(resource.dataUri).hostname;

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

    handleExternalResourceResponse(resource: Manifesto.IExternalResource): Promise<any> {

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

    handleDegraded(resource: Manifesto.IExternalResource): void {
        var informationArgs: InformationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
        $.publish(BaseCommands.SHOW_INFORMATION, [informationArgs]);
    }
}

export = BaseExtension;
