/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");
import bp = module("app/BaseProvider");
import shell = module("app/shared/Shell");

export class BaseApp {

    extensionName: string;
    isFullScreen: boolean = false;
    currentAssetIndex: number;
    mouseX: number;
    mouseY: number;
    $element: JQuery;
    extensions: any;
    socket: any;
    provider: bp.BaseProvider;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';
    static TOGGLE_LEFTPANEL_START: string = 'onToggleLeftPanelStart';
    static TOGGLE_LEFTPANEL_END: string = 'onToggleLeftPanelEnd';
    static TOGGLE_RIGHTPANEL_START: string = 'onToggleRightPanelStart';
    static TOGGLE_RIGHTPANEL_END: string = 'onToggleRightPanelEnd';
    static ASSET_INDEX_CHANGED: string = 'onAssetIndexChanged';
    static MODE_CHANGED: string = 'onModeChanged';
    static CLOSE_ACTIVE_DIALOGUE: string = 'onCloseActiveDialogue';
    static SHOW_GENERIC_DIALOGUE: string = 'onShowGenericDialogue';
    static HIDE_GENERIC_DIALOGUE: string = 'onHideGenericDialogue';
    static SHOW_HELP_DIALOGUE: string = 'onShowHelpDialogue';
    static HIDE_HELP_DIALOGUE: string = 'onHideHelpDialogue';

    constructor(provider: bp.BaseProvider, extensionName: string) {

        window.app = this;

        this.provider = provider;
        this.extensionName = extensionName;

        this.create();
    }

    create(): void {

        this.$element = $('#app');

        // initial sizing.
        var $win = $(window);
        this.$element.width($win.width());
        this.$element.height($win.height());

        // communication with parent frame.    
        this.socket = new easyXDM.Socket({
            onMessage: (message, origin) => {
                message = $.parseJSON(message);
                this.handleParentFrameEvent(message);
            }
        });

        // add/remove classes.
        this.$element.removeClass();
        this.$element.addClass(this.extensionName);
        if (!this.provider.options.isHomeDomain) this.$element.addClass('embedded');

        // events.
        window.onresize = () => {
            
            var $win = $(window);
            $('body').height($win.height());

            $.publish(BaseApp.RESIZE);
        }

        $(document).mousemove(function (e) {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });
        
        $.subscribe(BaseApp.TOGGLE_FULLSCREEN, () => {
            this.isFullScreen = !this.isFullScreen;
            this.triggerSocket(BaseApp.TOGGLE_FULLSCREEN, this.isFullScreen);
        });

        // create shell and shared views.
        var sh = new shell.Shell(this.$element);
    }

    width(): number {
        return $(window).width();
    }

    height(): number {
        return $(window).height();
    }

    triggerSocket(eventName, eventObject): void {
        if (this.socket) {
            this.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
        }
    }

    handleParentFrameEvent(message): void {
        switch (message.eventName) {
            case BaseApp.TOGGLE_FULLSCREEN:
                $.publish(BaseApp.TOGGLE_FULLSCREEN, message.eventObject);
            break;
        }
    }

    viewAsset(assetIndex: number, callback?: (i: number) => any): void {

        // todo: authorisation.

        this.currentAssetIndex = assetIndex;

        $.publish(BaseApp.ASSET_INDEX_CHANGED, [assetIndex]);
        
        if (callback) callback(assetIndex);
    }

    isDeepLinkingEnabled(): bool {

        if (this.provider.options.isHomeDomain && this.provider.options.isOnlyInstance) {
            return true;
        }

        return false;
    }

    // non-destructive address update.
    updateAddress(...args: string[]): void {

        if (!this.isDeepLinkingEnabled()) return;
        
        var currentPathNames = utils.Utils.getHashValues('/', parent.document);
        var length = Math.max(args.length, currentPathNames.length);
        var newPathNames = new Array(length);

        // construct a new pathnames array containing the old pathnames, but with
        // a length to accommodate new args.
        for (var i = 0; i < currentPathNames.length; i++) {
            newPathNames[i] = currentPathNames[i];
        }

        for (i = 0; i < args.length; i++) {
            newPathNames[i] = args[i];
        }

        // serialise pathNames.
        var hash = '#';

        for (i = 0; i < length; i++) {
            hash += newPathNames[i];

            if (i != length - 1) hash += '/';
        }

        this.updateParentHash(hash);
    }

    // destructive address update.
    setAddress(...args: string[]): void {

        if (!this.isDeepLinkingEnabled()) return;

        var hash = '#';

        for (var i = 0; i < args.length; i++) {
            hash += args[i];

            if (i != args.length - 1) hash += '/';
        }

        this.updateParentHash(hash);
    }

    updateParentHash(hash): void {

        var url = window.parent.document.URL;

        // remove hash value (if present).
        var index = url.indexOf('#');

        if (index != -1) {
            url = url.substr(0, url.indexOf('#'));
        }

        window.parent.document.location.replace(url + hash);
    }

    getAssetByIndex(index): any {

        return this.provider.assetSequence.assets[index];
    }

    getLastAssetOrderLabel(): string {

        // get the last orderlabel that isn't empty or '-'.
        for (var i = this.provider.assetSequence.assets.length - 1; i >= 0; i--) {
            var asset = this.provider.assetSequence.assets[i];

            var regExp = /\d/;
            
            if (regExp.test(asset.orderLabel)) {
                return asset.orderLabel;
            }
        }

        // none exists, so return '-'.
        return '-';
    }
    
    getAssetIndexByOrderLabel(label: string): number {

        // label value may be double-page e.g. 100-101 or 100_101 or 100 101 etc
        var regExp = /(\d*)\D*(\d*)|(\d*)/;
        var match = regExp.exec(label);

        var labelPart1 = match[1];
        var labelPart2 = match[2];

        var searchRegExp;

        if (labelPart2) {
            searchRegExp = new RegExp(labelPart1 + '\\D*' + labelPart2);
        } else {
            searchRegExp = new RegExp('^' + labelPart1 + '$');
        }
        
        // loop through files, return first one with matching orderlabel.
        for (var i = 0; i < this.provider.assetSequence.assets.length; i++) {
            var asset = this.provider.assetSequence.assets[i];

            if (searchRegExp.test(asset.orderLabel)) {
                return i;
            }
        }

        return -1;
    }

    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: bool) {

        $.publish(BaseApp.SHOW_GENERIC_DIALOGUE, [
            {
                message: message,
                acceptCallback: acceptCallback,
                buttonText: buttonText,
                allowClose: allowClose
            }]);
    }
}
