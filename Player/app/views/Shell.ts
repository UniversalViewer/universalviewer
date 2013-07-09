/// <reference path="../../js/jquery.d.ts" />
import app = module("app/App");
import utils = module("app/Utils");
import baseView = module("app/BaseView");
import header = module("app/views/Header");
import main = module("app/views/Main");
import footer = module("app/views/Footer");

export class Shell extends baseView.BaseView {
    static $headerPanel: JQuery;
    static $mainPanel: JQuery;
    static $footerPanel: JQuery;
    static $element: JQuery;
    
    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        Shell.$headerPanel = utils.Utils.createElement('div', null, 'headerPanel');
        this.$element.append(Shell.$headerPanel);
        new header.Header(Shell.$headerPanel);

        Shell.$mainPanel = utils.Utils.createElement('div', null, 'mainPanel');
        this.$element.append(Shell.$mainPanel);
        new main.Main(Shell.$mainPanel);

        Shell.$footerPanel = utils.Utils.createElement('div', null, 'footerPanel');
        this.$element.append(Shell.$footerPanel);
        new footer.Footer(Shell.$footerPanel);
    }
    
    resize(): void{
        super.resize();
    }
}