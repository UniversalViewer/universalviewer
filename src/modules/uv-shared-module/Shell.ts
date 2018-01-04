import {BaseEvents} from "./BaseEvents";
import {BaseView} from "./BaseView";
import {GenericDialogue} from "./GenericDialogue";

export class Shell extends BaseView {
    static $centerPanel: JQuery;
    static $element: JQuery;
    static $footerPanel: JQuery;
    static $genericDialogue: JQuery;
    static $headerPanel: JQuery;
    static $leftPanel: JQuery;
    static $mainPanel: JQuery;
    static $mobileFooterPanel: JQuery;
    static $overlays: JQuery;
    static $rightPanel: JQuery;

    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        $.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            Shell.$overlays.show();
        });

        $.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            Shell.$overlays.hide();
        });

        Shell.$headerPanel = $('<div class="headerPanel"></div>');
        Shell.$element.append(Shell.$headerPanel);

        Shell.$mainPanel = $('<div class="mainPanel"></div>');
        Shell.$element.append(Shell.$mainPanel);

        Shell.$centerPanel = $('<div class="centerPanel"></div>');
        Shell.$mainPanel.append(Shell.$centerPanel);

        Shell.$leftPanel = $('<div class="leftPanel"></div>');
        Shell.$mainPanel.append(Shell.$leftPanel);

        Shell.$rightPanel = $('<div class="rightPanel"></div>');
        Shell.$mainPanel.append(Shell.$rightPanel);

        Shell.$footerPanel = $('<div class="footerPanel"></div>');
        Shell.$element.append(Shell.$footerPanel);

        Shell.$mobileFooterPanel = $('<div class="mobileFooterPanel"></div>');
        Shell.$element.append(Shell.$mobileFooterPanel);

        Shell.$overlays = $('<div class="overlays"></div>');
        Shell.$element.append(Shell.$overlays);

        Shell.$genericDialogue = $('<div class="overlay genericDialogue" aria-hidden="true"></div>');
        Shell.$overlays.append(Shell.$genericDialogue);

        Shell.$overlays.on('click', (e) => {
            if ($(e.target).hasClass('overlays')) {
                e.preventDefault();
                $.publish(BaseEvents.CLOSE_ACTIVE_DIALOGUE);
            }
        });

        // create shared views.
        new GenericDialogue(Shell.$genericDialogue);
    }
    
    resize(): void {
        super.resize();

        Shell.$overlays.width(this.extension.width());
        Shell.$overlays.height(this.extension.height());

        const mainHeight: number = this.$element.height() - parseInt(Shell.$mainPanel.css('paddingTop')) 
            - (Shell.$headerPanel.is(':visible') ? Shell.$headerPanel.height() : 0)
            - (Shell.$footerPanel.is(':visible') ? Shell.$footerPanel.height() : 0)
            - (Shell.$mobileFooterPanel.is(':visible') ? Shell.$mobileFooterPanel.height() : 0);
        
        Shell.$mainPanel.height(mainHeight);
    }
}
