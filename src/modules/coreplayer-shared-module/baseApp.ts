/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import utils = require("../../utils");
import baseProvider = require("./baseProvider");
import shell = require("./shell");
import genericDialogue = require("./genericDialogue");

export class BaseApp {

    extensionName: string;
    isFullScreen: boolean = false;
    currentAssetIndex: number;
    mouseX: number;
    mouseY: number;
    $element: JQuery;
    extensions: any;
    socket: any;
    provider: baseProvider.BaseProvider;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';
    static ASSET_INDEX_CHANGED: string = 'onAssetIndexChanged';
    static CLOSE_ACTIVE_DIALOGUE: string = 'onCloseActiveDialogue';
    static ASSETSEQUENCE_INDEX_CHANGED: string = 'onAssetSequenceIndexChanged';
    static REDIRECT: string = 'onRedirect';
    static REFRESH: string = 'onRefresh';
    static RELOAD: string = 'onReload';

    constructor(provider: baseProvider.BaseProvider, extensionName: string) {

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
        if (!this.provider.isHomeDomain) this.$element.addClass('embedded');

        // events.
        window.onresize = () => {
            
            var $win = $(window);
            $('body').height($win.height());

            $.publish(BaseApp.RESIZE);
        }

        $(document).on('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });
        
        $.subscribe(BaseApp.TOGGLE_FULLSCREEN, () => {
            this.isFullScreen = !this.isFullScreen;
            this.triggerSocket(BaseApp.TOGGLE_FULLSCREEN, this.isFullScreen);
        });

        // create shell and shared views.
        var sh = new shell.Shell(this.$element);

        // set currentAssetIndex to -1 (nothing selected yet).
        this.currentAssetIndex = -1;
    }

    width(): number {
        return $(window).width();
    }

    height(): number {
        return $(window).height();
    }

    triggerSocket(eventName: string, eventObject: any): void {
        if (this.socket) {
            this.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
        }
    }

    redirect(uri) {
        this.triggerSocket(BaseApp.REDIRECT, uri);
    }

    refresh() {
        this.triggerSocket(BaseApp.REFRESH, null);
    }

    handleParentFrameEvent(message): void {
        switch (message.eventName) {
            case BaseApp.TOGGLE_FULLSCREEN:
                $.publish(BaseApp.TOGGLE_FULLSCREEN, message.eventObject);
            break;
        }
    }

    // get hash or data-attribute params depending on whether the player is embedded.
    getParam(key: baseProvider.params): any{
        var value;

        // deep linking is only allowed when hosted on home domain.
        if (this.isDeepLinkingEnabled()){
            value = utils.Utils.getHashParameter(baseProvider.BaseProvider.paramMap[key], parent.document);
        }

        if (!value){
            value = utils.Utils.getQuerystringParameter(baseProvider.BaseProvider.paramMap[key]);
        }

        return value;
    }

    // set hash params depending on whether the player is embedded.
    setParam(key: baseProvider.params, value: any): void{
        
        if (this.isDeepLinkingEnabled()){
            utils.Utils.setHashParameter(baseProvider.BaseProvider.paramMap[key], value, parent.document);
        }
    }

    viewAsset(assetIndex: number, callback?: (i: number) => any): void {

        this.currentAssetIndex = assetIndex;

        $.publish(BaseApp.ASSET_INDEX_CHANGED, [assetIndex]);
        
        if (callback) callback(assetIndex);
    }

    viewAssetSequence(index): void {

        if (this.isFullScreen) {
            $.publish(BaseApp.TOGGLE_FULLSCREEN);
        }

        this.triggerSocket(BaseApp.ASSETSEQUENCE_INDEX_CHANGED, index);
    }

    isDeepLinkingEnabled(): boolean {

        return (this.provider.isHomeDomain && this.provider.isOnlyInstance);
    }

    getSectionByAssetIndex(index: number) {

        var asset = this.getAssetByIndex(index);

        return this.getAssetSection(asset);
    }
    
    getSectionIndex(path: string): number {

        for (var i = 0; i < this.provider.assetSequence.assets.length; i++) {
            var asset = this.provider.assetSequence.assets[i];
            for (var j = 0; j < asset.sections.length; j++) {
                var section = asset.sections[j];
                
                if (section.path == path) {
                    return i;
                }
            }
        }

        return null;
    }

    getAssetSection(asset) {
        // get the deepest section that this file belongs to.
        return asset.sections.last();
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

    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean) {

        $.publish(genericDialogue.GenericDialogue.SHOW_GENERIC_DIALOGUE, [
            {
                message: message,
                acceptCallback: acceptCallback,
                buttonText: buttonText,
                allowClose: allowClose
            }]);
    }
}
