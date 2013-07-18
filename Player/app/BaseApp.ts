/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");
import bp = module("app/BaseProvider");
import shell = module("app/shared/Shell");

export class BaseApp {

    static extensionName: string;
    static provider: bp.BaseProvider;
    static isFullScreen: boolean = false;
    static currentAssetIndex: number;
    $element: JQuery;
    extensions: any;
    socket: any;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';
    static TOGGLE_LEFTPANEL_START: string = 'onToggleLeftPanelStart';
    static TOGGLE_LEFTPANEL_END: string = 'onToggleLeftPanelEnd';
    static TOGGLE_RIGHTPANEL_START: string = 'onToggleRightPanelStart';
    static TOGGLE_RIGHTPANEL_END: string = 'onToggleRightPanelEnd';
    static ASSET_INDEX_CHANGED: string = 'onAssetIndexChanged';
    static MODE_CHANGED: string = 'onModeChanged';
    static SHOW_DIALOGUE: string = 'onShowDialogue';

    constructor(provider: bp.BaseProvider, extensionName: string) {
        BaseApp.provider = provider;
        BaseApp.extensionName = extensionName;

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
        this.$element.addClass(BaseApp.extensionName);
        if (!BaseApp.provider.options.isHomeDomain) this.$element.addClass('embedded');

        // events.
        window.onresize = () => {
            $('body').height($(window).height());
            $.publish(BaseApp.RESIZE);
        }

        $.subscribe(BaseApp.TOGGLE_FULLSCREEN, () => {
            BaseApp.isFullScreen = !BaseApp.isFullScreen;
            this.triggerSocket(BaseApp.TOGGLE_FULLSCREEN, BaseApp.isFullScreen);
        });

        // create shell.
        var sh = new shell.Shell(this.$element);
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

        BaseApp.currentAssetIndex = assetIndex;

        $.publish(BaseApp.ASSET_INDEX_CHANGED, [assetIndex]);
        
        if (callback) callback(assetIndex);
    }

    isDeepLinkingEnabled(): bool {

        if (BaseApp.provider.options.isHomeDomain && BaseApp.provider.options.isOnlyInstance) {
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

    static getAssetByIndex(index): any {
        var self = this;

        return BaseApp.provider.assetSequence.assets[index];
    }

    static getLastAssetOrderLabel(): string {
        
        // get the last orderlabel that isn't empty or '-'.
        for (var i = BaseApp.provider.assetSequence.assets.length - 1; i >= 0; i--) {
            var asset = BaseApp.provider.assetSequence.assets[i];

            if (asset.orderLabel.trim() != '-' && asset.orderLabel.trim() != '') {
                return asset.orderLabel;
            }
        }

        // none exists, so return '-'.
        return '-';
    }
}
