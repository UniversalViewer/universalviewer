import BaseCommands = require("./Commands");
import BaseProvider = require("./BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import IExtension = require("./IExtension");
import IProvider = require("./IProvider");
import Params = require("./Params");
import Shell = require("./Shell");

class BaseExtension implements IExtension {

    $element: JQuery;
    bootstrapper: BootStrapper;
    canvasIndex: number;
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
        this.$element.data("bootstrapper", this.bootstrapper)

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
        //this.$element.addClass(this.provider.getSequenceType()); // todo: add media mime type class?

        // events.
        window.onresize = () => {

            var $win = $(window);
            $('body').height($win.height());

            this.resize();
        }

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

        $.subscribe(BaseCommands.ESCAPE, () => {
            if (this.bootstrapper.isFullScreen) {
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
                    // todo: would be nice to use path.join. use browserify?
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
        this.viewMedia();
    }

    setParams(): void{
        if (!this.provider.isHomeDomain) return;

        // set sequenceIndex hash param.
        this.setParam(Params.sequenceIndex, this.provider.sequenceIndex);
    }

    setDefaultFocus(): void {
        setTimeout(() => {
            $('[tabindex=1]').focus();
        }, 1);
    }

    viewMedia(): void {
        var canvas = this.provider.getCanvasByIndex(0);

        this.viewCanvas(0, () => {

            $.publish(BaseCommands.OPEN_MEDIA, [canvas]);

            this.setParam(Params.canvasIndex, 0);
        });
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
        // todo: come up with better way of postponing this until viewer is fully created
        setTimeout(() => {
            switch (message.eventName) {
                case BaseCommands.TOGGLE_FULLSCREEN:
                    $.publish(BaseCommands.TOGGLE_FULLSCREEN, message.eventObject);
                    break;
            }
        }, 1000);
    }

    // get hash or data-attribute params depending on whether the UV is embedded.
    getParam(key: Params): any{
        var value;

        // deep linking is only allowed when hosted on home domain.
        if (this.provider.isDeepLinkingEnabled()){
            value = Utils.Urls.GetHashParameter(this.provider.paramMap[key], parent.document);
        }

        if (!value){
            value = Utils.Urls.GetQuerystringParameter(this.provider.paramMap[key]);
        }

        return value;
    }

    // set hash params depending on whether the UV is embedded.
    setParam(key: Params, value: any): void{

        if (this.provider.isDeepLinkingEnabled()){
            Utils.Urls.SetHashParameter(this.provider.paramMap[key], value, parent.document);
        }
    }

    viewCanvas(canvasIndex: number, callback?: (i: number) => any): void {

        this.provider.canvasIndex = canvasIndex;

        $.publish(BaseCommands.CANVAS_INDEX_CHANGED, [canvasIndex]);

        this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGED, canvasIndex);

        if (callback) callback(canvasIndex);
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

    viewManifest(manifest: any): void{
        var seeAlsoUri = this.provider.getManifestSeeAlsoUri(manifest);
        if (seeAlsoUri){
            window.open(seeAlsoUri, '_blank');
        } else {
            if (this.bootstrapper.isFullScreen) {
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            }

            // todo: manifest.assetSequence doesn't exist in IIIF
            this.triggerSocket(BaseCommands.SEQUENCE_INDEX_CHANGED, manifest.assetSequence);
        }
    }

    inIframe(): boolean {
        // see http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    isLeftPanelEnabled(): boolean{
        return  Utils.Bools.GetBool(this.provider.config.options.leftPanelEnabled, true)
            && this.provider.isMultiCanvas();
    }

    isRightPanelEnabled(): boolean{
        return  Utils.Bools.GetBool(this.provider.config.options.rightPanelEnabled, true);
    }
}

export = BaseExtension;
