/// <reference path="../../js/jquery.d.ts" />
import baseExtension = require("./baseExtension");
import utils = require("../../utils");
import baseView = require("./baseView");
import genericDialogue = require("./genericDialogue");

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

            if ($(e.target).hasClass('overlays')) {
                e.preventDefault();
                $.publish(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE);
            }
        });

        // create shared views.
        new genericDialogue.GenericDialogue(Shell.$genericDialogue);
    }
    
    resize(): void{
        super.resize();

        Shell.$overlays.width(this.extension.width());
        Shell.$overlays.height(this.extension.height());

        var mainHeight = this.$element.height() - Shell.$headerPanel.height() - Shell.$footerPanel.height();
        Shell.$mainPanel.actualHeight(mainHeight);
    }
}