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

        Shell.$headerPanel = $('<div class="headerPanel"></div>');
        this.$element.append(Shell.$headerPanel);

        Shell.$mainPanel = $('<div class="mainPanel"></div>');
        this.$element.append(Shell.$mainPanel);

        Shell.$centerPanel = $('<div class="centerPanel"></div>');
        Shell.$mainPanel.append(Shell.$centerPanel);

        Shell.$leftPanel = $('<div class="leftPanel"></div>');
        Shell.$mainPanel.append(Shell.$leftPanel);

        Shell.$rightPanel = $('<div class="rightPanel"></div>');
        Shell.$mainPanel.append(Shell.$rightPanel);

        Shell.$footerPanel = $('<div class="footerPanel"></div>');
        Shell.$element.append(Shell.$footerPanel);

        Shell.$overlays = $('<div class="overlays"></div>');
        this.$element.append(Shell.$overlays);

        Shell.$genericDialogue = $('<div class="overlay genericDialogue"></div>');
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

        var mainHeight = this.$element.height() - parseInt(Shell.$mainPanel.css('marginTop')) - Shell.$headerPanel.height() - Shell.$footerPanel.height();
        //Shell.$mainPanel.actualHeight(mainHeight);
        Shell.$mainPanel.height(mainHeight);
    }
}