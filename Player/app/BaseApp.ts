/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");
import bp = module("app/BaseProvider");
import shell = module("app/shared/Shell");

export class BaseApp {

    static provider: bp.BaseProvider;
    socket: any;
    static isFullScreen: boolean = false;
    $element: JQuery;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';
    static TOGGLE_LEFTPANEL_START: string = 'onToggleLeftPanelStart';
    static TOGGLE_LEFTPANEL_END: string = 'onToggleLeftPanelEnd';
    static TOGGLE_RIGHTPANEL_START: string = 'onToggleRightPanelStart';
    static TOGGLE_RIGHTPANEL_END: string = 'onToggleRightPanelEnd';
    static ASSET_INDEX_CHANGED: string = 'onAssetIndexChanged';

    constructor(provider: bp.BaseProvider) {

        BaseApp.provider = provider;

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
        new shell.Shell(this.$element);
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
}
