import BaseCommands = require("./BaseCommands");
import BaseProvider = require("./BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import BootstrapParams = require("../../BootstrapParams");
import ClickThroughDialogue = require("../../modules/uv-dialogues-module/ClickThroughDialogue");
import ExternalResource = require("./ExternalResource");
import IExtension = require("./IExtension");
import IProvider = require("./IProvider");
import Params = require("../../Params");
import Shell = require("./Shell");
import Storage = require("../../modules/uv-shared-module/Storage");
import StorageItem = require("../../modules/uv-shared-module/StorageItem");

class BaseExtension implements IExtension {

    $clickThroughDialogue: JQuery;
    $element: JQuery;
    bootstrapper: BootStrapper;
    canvasIndex: number;
    clickThroughDialogue: ClickThroughDialogue;
    embedHeight: number;
    embedWidth: number;
    extensions: any;
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

        this.$element = $('#app');
        this.$element.data("bootstrapper", this.bootstrapper);

        // initial sizing.
        var $win = $(window);
        this.embedWidth = $win.width();
        this.embedHeight = $win.height();
        this.$element.width(this.embedWidth);
        this.$element.height(this.embedHeight);

        if (!this.provider.isReload && this.inIframe()){
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
            }
        });

        // add/remove classes.
        this.$element.empty();
        this.$element.removeClass();
        this.$element.addClass('browser-' + window.browserDetect.browser);
        this.$element.addClass('browser-version-' + window.browserDetect.version);
        if (!this.provider.isHomeDomain) this.$element.addClass('embedded');
        if (this.provider.isLightbox) this.$element.addClass('lightbox');

        // events.
        window.onresize = () => {

            var $win = $(window);
            $('body').height($win.height());

            this.resize();
        };

        $(document).on('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        // keyboard events.

        $(document).on('keyup keydown', (e) => {
            this.shifted = e.shiftKey;
            this.tabbing = e.keyCode === 9;
        });

        $(document).keyup((e) => {
            var event: string = null;

            if (e.keyCode === 13) event = BaseCommands.RETURN;
            if (e.keyCode === 27) event = BaseCommands.ESCAPE;
            if (e.keyCode === 33) event = BaseCommands.PAGE_UP;
            if (e.keyCode === 34) event = BaseCommands.PAGE_DOWN;
            if (e.keyCode === 35) event = BaseCommands.END;
            if (e.keyCode === 36) event = BaseCommands.HOME;
            if (e.keyCode === 37) event = BaseCommands.LEFT_ARROW;
            if (e.keyCode === 38) event = BaseCommands.UP_ARROW;
            if (e.keyCode === 39) event = BaseCommands.RIGHT_ARROW;
            if (e.keyCode === 40) event = BaseCommands.DOWN_ARROW;

            if (event){
                e.preventDefault();
                $.publish(event)
            }
        });

        this.$element.append('<a href="/" id="top"></a>');

        $.subscribe(BaseCommands.OPEN_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.CLOSE_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.OPEN_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.CLOSE_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, () => {
            if (!this.isOverlayActive()){
                $('#top').focus();
                this.bootstrapper.isFullScreen = !this.bootstrapper.isFullScreen;
                this.triggerSocket(BaseCommands.TOGGLE_FULLSCREEN,
                    {
                        isFullScreen: this.bootstrapper.isFullScreen,
                        overrideFullScreen: this.provider.config.options.overrideFullScreen
                    });
            }
        });

        $.subscribe(BaseCommands.RESOURCE_DEGRADED, () => {
            $.publish(BaseCommands.SHOW_INFORMATION, [this.provider.config.content.degradedResource]);
        });

        $.subscribe(BaseCommands.ESCAPE, () => {
            if (this.isFullScreen()) {
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            }
        });

        $.subscribe(BaseCommands.CREATED, () => {
            this.triggerSocket(BaseCommands.CREATED);
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
    }

    modulesCreated(): void {

    }

    getDependencies(cb: (deps: any) => void): any {
        var that = this;

        // todo: use compiler flag (when available)
        var depsUri = (window.DEBUG) ? '../../extensions/' + this.name + '/dependencies' : this.name + '-dependencies';

        require([depsUri], function (deps) {
            // if debugging, set the base uri to the extension's directory.
            // otherwise set it to the current directory (where app.js is hosted).

            if (!that.provider.isReload){
                // todo: use compiler flag (when available)
                var baseUri = (window.DEBUG) ? '../../extensions/' + that.name + '/lib/' : '';

                // for each dependency, prepend baseUri.
                for (var i = 0; i < deps.dependencies.length; i++) {
                    deps.dependencies[i] = baseUri + deps.dependencies[i];
                }
            }

            cb(deps);
        });
    }

    loadDependencies(deps: any): void {
        var that = this;

        require(deps.dependencies, function () {
            that.dependenciesLoaded();
        });
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
            }
        }, 1000);
    }

    getExternalResources(): Promise<Manifesto.IExternalResource[]> {

        var indices = this.provider.getPagedIndices();
        var resources = [];

        _.each(indices, (index) => {
            var r: Manifesto.IExternalResource = new ExternalResource(this.provider);
            var canvas: Manifesto.ICanvas = this.provider.getCanvasByIndex(index);
            r.dataUri = this.provider.getInfoUri(canvas);
            resources.push(r);
        });

        return new Promise<Manifesto.IExternalResource[]>((resolve) => {
            manifesto.loadExternalResources(
                resources,
                this.clickThrough,
                this.login,
                this.getAccessToken,
                this.storeAccessToken,
                this.getStoredAccessToken,
                this.handleExternalResourceResponse).then((r: Manifesto.IExternalResource[]) => {
                    this.provider.resources = _.map(r, (resource: Manifesto.IExternalResource) => {
                        return <Manifesto.IExternalResource>_.toPlainObject(resource.data);
                    });
                    resolve(this.provider.resources);
                })['catch']((errorMessage) => {
                this.showMessage(errorMessage);
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
        this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGED, canvasIndex);

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
        p.collectionIndex = this.provider.getCollectionIndex(manifest);
        p.manifestIndex = manifest.index;

        this.provider.reload(p);
    }

    inIframe(): boolean {
        // see http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    isFullScreen(): boolean {
        return this.bootstrapper.isFullScreen;
    }

    isLeftPanelEnabled(): boolean{
        return  Utils.Bools.GetBool(this.provider.config.options.leftPanelEnabled, true)
            && this.provider.isMultiCanvas();
    }

    isRightPanelEnabled(): boolean{
        return  Utils.Bools.GetBool(this.provider.config.options.rightPanelEnabled, true);
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
                    }, 100);
                }
            }]);
        });
    }

    login(resource: Manifesto.IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            var win = window.open(resource.loginService.id, 'loginwindow', 'height=600,width=600');

            var pollTimer = window.setInterval(() => {
                if (win.closed) {
                    window.clearInterval(pollTimer);
                    $.publish(BaseCommands.AUTHORIZATION_OCCURRED);
                    resolve();
                }
            }, 500);
        });
    }

    getAccessToken(resource: Manifesto.IExternalResource): Promise<Manifesto.IAccessToken> {
        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {
            $.getJSON(resource.tokenService.id + "?callback=?", (token: Manifesto.IAccessToken) => {
                resolve(token);
            }).fail((error) => {
                reject(error);
            });
        });
    }

    storeAccessToken(resource: Manifesto.IExternalResource, token: Manifesto.IAccessToken): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Storage.set(resource.tokenService.id, token, token.expiresIn);
            resolve();
        });
    }

    getStoredAccessToken(resource: Manifesto.IExternalResource): Promise<Manifesto.IAccessToken> {

        return new Promise<Manifesto.IAccessToken>((resolve, reject) => {

            // first try an exact match of the url
            var item: StorageItem = Storage.get(resource.dataUri);

            if (item){
                resolve(<Manifesto.IAccessToken>item.value);
            }

            // find an access token for the domain
            var domain = Utils.Urls.GetUrlParts(resource.dataUri).hostname;

            var items: StorageItem[] = Storage.getItems();

            for(var i = 0; i < items.length; i++) {
                item = items[i];

                if(item.key.contains(domain)) {
                    resolve(<Manifesto.IAccessToken>item.value);
                }
            }

            resolve(null);
        });
    }

    handleExternalResourceResponse(resource: Manifesto.IExternalResource) : Promise<any> {
        var that = this;

        return new Promise<any>((resolve, reject) => {
            resource.isResponseHandled = true;

            if (resource.status === HTTPStatusCode.OK) {
                resolve(resource);
            } else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                resolve(resource);
                $.publish(BaseCommands.RESOURCE_DEGRADED);
            } else {
                // access denied
                reject(resource.error.statusText);
            }
        });
    }
}

export = BaseExtension;
