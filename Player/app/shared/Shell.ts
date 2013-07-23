/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import baseView = module("app/BaseView");
import genericDialogue = module("app/shared/GenericDialogue");
import helpDialogue = module("app/shared/HelpDialogue");

export class Shell extends baseView.BaseView {
    static $element: JQuery;
    static $headerPanel: JQuery;
    static $mainPanel: JQuery;
    static $footerPanel: JQuery;
    static $overlayMask: JQuery;
    static $genericDialogue: JQuery;
    static $helpDialogue: JQuery;

    static SHOW_OVERLAY_MASK: string = 'onShowOverlayMask';
    static HIDE_OVERLAY_MASK: string = 'onHideOverlayMask';

    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        // events.
        $.subscribe(Shell.SHOW_OVERLAY_MASK, () => {
            Shell.$overlayMask.show();
        });

        $.subscribe(Shell.HIDE_OVERLAY_MASK, () => {
            Shell.$overlayMask.hide();
        });

        Shell.$headerPanel = utils.Utils.createDiv('headerPanel');
        this.$element.append(Shell.$headerPanel);

        Shell.$mainPanel = utils.Utils.createDiv('mainPanel');
        this.$element.append(Shell.$mainPanel);

        Shell.$footerPanel = utils.Utils.createDiv('footerPanel');
        this.$element.append(Shell.$footerPanel);

        Shell.$overlayMask = utils.Utils.createDiv('overlayMask');
        this.$element.append(Shell.$overlayMask);

        Shell.$genericDialogue = utils.Utils.createDiv('overlay genericDialogue');
        this.$element.append(Shell.$genericDialogue);

        Shell.$helpDialogue = utils.Utils.createDiv('overlay help');
        this.$element.append(Shell.$helpDialogue);

        Shell.$overlayMask.on('click', (e) => {
            e.preventDefault();

            $.publish(baseApp.BaseApp.CLOSE_ACTIVE_DIALOGUE);
        });

        // create shared views.
        new genericDialogue.GenericDialogue(Shell.$genericDialogue);
        new helpDialogue.HelpDialogue(Shell.$helpDialogue);
    }
    
    resize(): void{
        super.resize();

        Shell.$overlayMask.width(this.app.width());
        Shell.$overlayMask.height(this.app.height());
    }
}