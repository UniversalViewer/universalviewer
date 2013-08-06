/// <reference path="../../../js/jquery.d.ts" />
import baseApp = require("app/modules/Shared/BaseApp");
import utils = require("app/Utils");
import baseView = require("app/modules/Shared/BaseView");
import genericDialogue = require("app/modules/Shared/GenericDialogue");

export class Shell extends baseView.BaseView {
    static $element: JQuery;
    static $headerPanel: JQuery;
    static $mainPanel: JQuery;
    static $centerPanel: JQuery;
    static $leftPanel: JQuery;
    static $rightPanel: JQuery;
    static $footerPanel: JQuery;
    static $overlays: JQuery;
    static $genericDialogue: JQuery;

    static SHOW_OVERLAY: string = 'onShowOverlay';
    static HIDE_OVERLAY: string = 'onHideOverlay';

    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        // events.
        $.subscribe(Shell.SHOW_OVERLAY, () => {
            Shell.$overlays.show();
        });

        $.subscribe(Shell.HIDE_OVERLAY, () => {
            Shell.$overlays.hide();
        });

        Shell.$headerPanel = utils.Utils.createDiv('headerPanel');
        this.$element.append(Shell.$headerPanel);

        Shell.$mainPanel = utils.Utils.createDiv('mainPanel');
        this.$element.append(Shell.$mainPanel);

        Shell.$centerPanel = utils.Utils.createDiv('centerPanel');
        Shell.$mainPanel.append(Shell.$centerPanel);

        Shell.$leftPanel = utils.Utils.createDiv('leftPanel');
        Shell.$mainPanel.append(Shell.$leftPanel);

        Shell.$rightPanel = utils.Utils.createDiv('rightPanel');
        Shell.$mainPanel.append(Shell.$rightPanel);

        Shell.$footerPanel = utils.Utils.createDiv('footerPanel');
        Shell.$element.append(Shell.$footerPanel);

        Shell.$overlays = utils.Utils.createDiv('overlays');
        this.$element.append(Shell.$overlays);

        Shell.$genericDialogue = utils.Utils.createDiv('overlay genericDialogue');
        Shell.$overlays.append(Shell.$genericDialogue);

        Shell.$overlays.on('click', (e) => {
            e.preventDefault();

            if ($(e.target).hasClass('overlays')) {
                $.publish(baseApp.BaseApp.CLOSE_ACTIVE_DIALOGUE);
            }
        });

        // create shared views.
        new genericDialogue.GenericDialogue(Shell.$genericDialogue);
    }
    
    resize(): void{
        super.resize();

        Shell.$overlays.width(this.app.width());
        Shell.$overlays.height(this.app.height());

        var mainHeight = this.$element.height() - Shell.$headerPanel.height() -Shell.$footerPanel.height();
        Shell.$mainPanel.actualHeight(mainHeight);
    }
}