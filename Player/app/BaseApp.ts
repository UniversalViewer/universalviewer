/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");
import dp = module("app/IDataProvider");
import shell = module("app/views/Shell");

export class BaseApp {

    static config: any;
    static dataProvider: dp.IDataProvider;
    socket: any;
    static isFullScreen: boolean = false;

    // events
    static RESIZE: string = 'onResize';
    static TOGGLE_FULLSCREEN: string = 'onToggleFullScreen';

    // todo: look at using dependency injection for constructor params.
    constructor(configUri: string, dataProvider: dp.IDataProvider) {

        BaseApp.dataProvider = dataProvider;

        $.getJSON(configUri, (config) => {
            BaseApp.config = config;

            var dataUri = utils.Utils.getParameterByName('dataUri');

            // todo: better to implement an mvc pattern, keeping it simple for now.
            BaseApp.dataProvider.getData(dataUri, (data) => {
                this.create();
            });
        });
    }

    create(): void {

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
        var $content = $('#content');
        new shell.Shell($content);

        // initial sizing.
        var $win = $(window);
        $content.width($win.width());
        $content.height($win.height());

        $.publish(BaseApp.RESIZE);
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
