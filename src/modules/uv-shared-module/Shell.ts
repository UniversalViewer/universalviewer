import {BaseEvents} from "./BaseEvents";
import {BaseView} from "./BaseView";
import {GenericDialogue} from "./GenericDialogue";

export class Shell extends BaseView {
    
    public $centerPanel: JQuery;
    public $element: JQuery;
    public $footerPanel: JQuery;
    public $genericDialogue: JQuery;
    public $headerPanel: JQuery;
    public $leftPanel: JQuery;
    public $mainPanel: JQuery;
    public $mobileFooterPanel: JQuery;
    public $overlays: JQuery;
    public $rightPanel: JQuery;

    constructor($element: JQuery) {
        super($element, true, true);
    }
    
    create(): void {
        super.create();

        this.component.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            this.$overlays.show();
        });

        this.component.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            this.$overlays.hide();
        });

        this.$headerPanel = $('<div class="headerPanel"></div>');
        this.$element.append(this.$headerPanel);

        this.$mainPanel = $('<div class="mainPanel"></div>');
        this.$element.append(this.$mainPanel);

        this.$centerPanel = $('<div class="centerPanel"></div>');
        this.$mainPanel.append(this.$centerPanel);

        this.$leftPanel = $('<div class="leftPanel"></div>');
        this.$mainPanel.append(this.$leftPanel);

        this.$rightPanel = $('<div class="rightPanel"></div>');
        this.$mainPanel.append(this.$rightPanel);

        this.$footerPanel = $('<div class="footerPanel"></div>');
        this.$element.append(this.$footerPanel);

        this.$mobileFooterPanel = $('<div class="mobileFooterPanel"></div>');
        this.$element.append(this.$mobileFooterPanel);

        this.$overlays = $('<div class="overlays"></div>');
        this.$element.append(this.$overlays);

        this.$genericDialogue = $('<div class="overlay genericDialogue" aria-hidden="true"></div>');
        this.$overlays.append(this.$genericDialogue);

        this.$overlays.on('click', (e) => {
            if ($(e.target).hasClass('overlays')) {
                e.preventDefault();
                this.component.publish(BaseEvents.CLOSE_ACTIVE_DIALOGUE);
            }
        });

        // create shared views.
        new GenericDialogue(this.$genericDialogue);
    }
    
    resize(): void {
        super.resize();

        setTimeout(() => {
            this.$overlays.width(this.extension.width());
            this.$overlays.height(this.extension.height());
        }, 1);
        
        const mainHeight: number = this.$element.height() - parseInt(this.$mainPanel.css('paddingTop')) 
            - (this.$headerPanel.is(':visible') ? this.$headerPanel.height() : 0)
            - (this.$footerPanel.is(':visible') ? this.$footerPanel.height() : 0)
            - (this.$mobileFooterPanel.is(':visible') ? this.$mobileFooterPanel.height() : 0);
        
        this.$mainPanel.height(mainHeight);
    }
}
