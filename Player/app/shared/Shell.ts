/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import baseView = module("app/BaseView");

export class Shell extends baseView.BaseView {
    static $element: JQuery;
    static $headerPanel: JQuery;
    static $mainPanel: JQuery;
    static $footerPanel: JQuery;
    static $overlayMask: JQuery;
    static $genericDialogue: JQuery;

    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        Shell.$headerPanel = utils.Utils.createDiv('headerPanel');
        this.$element.append(Shell.$headerPanel);

        Shell.$mainPanel = utils.Utils.createDiv('mainPanel');
        this.$element.append(Shell.$mainPanel);

        Shell.$footerPanel = utils.Utils.createDiv('footerPanel');
        this.$element.append(Shell.$footerPanel);

        Shell.$overlayMask = utils.Utils.createDiv('overlayMask');
        this.$element.append(Shell.$overlayMask);

        Shell.$genericDialogue = utils.Utils.createDiv('genericDialogue');
        this.$element.append(Shell.$genericDialogue);

        Shell.$overlayMask.on('click', (e) => {
            e.preventDefault();

            $.publish(baseApp.BaseApp.CLOSE_ACTIVE_DIALOGUE);
        });
    }
    
    resize(): void{
        super.resize();
    }
}