/// <reference path="../../js/jquery.d.ts" />
import baseapp = module("app/BaseApp");
import utils = module("app/Utils");
import baseView = module("app/BaseView");
import header = module("app/shared/Header");
import main = module("app/shared/Main");
import footer = module("app/shared/Footer");

export class Shell extends baseView.BaseView {
    static $element: JQuery;
    static $headerPanel: JQuery;
    static $mainPanel: JQuery;
    static $footerPanel: JQuery;

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
    }
    
    resize(): void{
        super.resize();
    }
}