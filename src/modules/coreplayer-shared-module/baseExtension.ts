/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import utils = require("../../utils");
import baseProvider = require("./baseProvider");
import shell = require("./shell");
import genericDialogue = require("./genericDialogue");
import IProvider = require("./iProvider");
import IExtension = require("./iExtension");

export class BaseExtension implements IExtension {

    shell: shell.Shell;
    isFullScreen: boolean = false;
    currentAssetIndex: number;
    mouseX: number;
    mouseY: number;
    $element: JQuery;
    extensions: any;
    socket: any;
    provider: IProvider;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';
    static ASSET_INDEX_CHANGED: string = 'onAssetIndexChanged';
    static CLOSE_ACTIVE_DIALOGUE: string = 'onCloseActiveDialogue';
    static ASSETSEQUENCE_INDEX_CHANGED: string = 'onAssetSequenceIndexChanged';
    static REDIRECT: string = 'onRedirect';
    static REFRESH: string = 'onRefresh';
    static RELOAD: string = 'onReload';
    static ESCAPE: string = 'onEscape';
    static RETURN: string = 'onReturn';
    static WINDOW_UNLOAD: string = 'onWindowUnload';
    static OPEN_MEDIA: string = 'onOpenMedia';
    static CREATED: string = 'onCreated';
    static SHOW_MESSAGE: string = 'onShowMessage';
    static HIDE_MESSAGE: string = 'onHideMessage';

    constructor(provider: IProvider) {

        window.extension = this;

        this.provider = provider;

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
        if (!this.provider.isHomeDomain) this.$element.addClass('embedded');

        // events.
        window.onresize = () => {

            var $win = $(window);
            $('body').height($win.height());

            $.publish(BaseExtension.RESIZE);
        }

        $(document).on('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        $.subscribe(BaseExtension.TOGGLE_FULLSCREEN, () => {
            if (!this.isOverlayActive()){
                this.isFullScreen = !this.isFullScreen;
                this.triggerSocket(BaseExtension.TOGGLE_FULLSCREEN, this.isFullScreen);
            }
        });

        // keyboard events.
        $(document).keyup((e) => {
            if (e.keyCode === 27) $.publish(BaseExtension.ESCAPE);
            if (e.keyCode === 13) $.publish(BaseExtension.RETURN);
        });

        $.subscribe(BaseExtension.ESCAPE, () => {
            if (this.isFullScreen) {
                $.publish(BaseExtension.TOGGLE_FULLSCREEN);
            }
        });

        // create shell and shared views.
        this.shell = new shell.Shell(this.$element);

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

    redirect(uri: string): void {
        this.triggerSocket(BaseExtension.REDIRECT, uri);
    }

    refresh(): void {
        this.triggerSocket(BaseExtension.REFRESH, null);
    }

    handleParentFrameEvent(message): void {
        switch (message.eventName) {
            case BaseExtension.TOGGLE_FULLSCREEN:
                $.publish(BaseExtension.TOGGLE_FULLSCREEN, message.eventObject);
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

        $.publish(BaseExtension.ASSET_INDEX_CHANGED, [assetIndex]);

        if (callback) callback(assetIndex);
    }

    viewAssetSequence(index: number): void {

        if (this.isFullScreen) {
            $.publish(BaseExtension.TOGGLE_FULLSCREEN);
        }

        this.triggerSocket(BaseExtension.ASSETSEQUENCE_INDEX_CHANGED, index);
    }

    viewStructure(structure: any): void{
        if (structure.seeAlso && structure.seeAlso.tag && structure.seeAlso.data){
            if (structure.seeAlso.tag === 'OpenExternal'){
                var uri = this.provider.getMediaUri(structure.seeAlso.data);
                window.open(uri, '_blank');
            }
        } else {
            this.viewAssetSequence(structure.assetSequence.index);
        }
    }

    isDeepLinkingEnabled(): boolean {

        return (this.provider.isHomeDomain && this.provider.isOnlyInstance);
    }

    getSectionByAssetIndex(index: number): any {

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

    getAssetSection(asset: any): any {
        // get the deepest section that this file belongs to.
        return asset.sections.last();
    }

    getAssetByIndex(index: number): any {

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

        if (!labelPart1) return -1;

        var searchRegExp, regStr;

        if (labelPart2) {
            regStr = "^" + labelPart1 + "\\D*" + labelPart2 + "$";
        } else {
            regStr = "\\D*" + labelPart1 + "\\D*";
        }

        searchRegExp = new RegExp(regStr);

        // loop through files, return first one with matching orderlabel.
        for (var i = 0; i < this.provider.assetSequence.assets.length; i++) {
            var asset = this.provider.assetSequence.assets[i];

            if (searchRegExp.test(asset.orderLabel)) {
                return i;
            }
        }

        return -1;
    }

    getCurrentAsset(): any {
        return this.provider.assetSequence.assets[this.currentAssetIndex];
    }

    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void {

        $.publish(genericDialogue.GenericDialogue.SHOW_GENERIC_DIALOGUE, [
            {
                message: message,
                acceptCallback: acceptCallback,
                buttonText: buttonText,
                allowClose: allowClose
            }]);
    }

    closeActiveDialogue(): void{
        $.publish(BaseExtension.CLOSE_ACTIVE_DIALOGUE);
    }

    isMultiAsset(): boolean{
        return this.provider.assetSequence.assets.length > 1;
    }

    isOverlayActive(): boolean{
        return shell.Shell.$overlays.is(':visible');
    }

    isSeeAlsoEnabled(): boolean{
        return this.provider.config.options.seeAlsoEnabled !== false;
    }
}
