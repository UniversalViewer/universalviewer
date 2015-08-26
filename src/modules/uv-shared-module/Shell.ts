import BaseCommands = require("./BaseCommands");
import BaseView = require("./BaseView");
import GenericDialogue = require("./GenericDialogue");

class Shell extends BaseView {
    static $centerPanel: JQuery;
    static $element: JQuery;
    static $footerPanel: JQuery;
    static $genericDialogue: JQuery;
    static $headerPanel: JQuery;
    static $leftPanel: JQuery;
    static $mainPanel: JQuery;
    static $overlays: JQuery;
    static $rightPanel: JQuery;

    constructor($element: JQuery) {
        Shell.$element = $element;
        super(Shell.$element, true, true);
    }
    
    create(): void {
        super.create();

        $.subscribe(BaseCommands.SHOW_OVERLAY, () => {
            Shell.$overlays.show();
        });

        $.subscribe(BaseCommands.HIDE_OVERLAY, () => {
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

        Shell.$overlays = $('<div class="overlays"></div>');
        Shell.$element.append(Shell.$overlays);

        Shell.$genericDialogue = $('<div class="overlay genericDialogue"></div>');
        Shell.$overlays.append(Shell.$genericDialogue);

        Shell.$overlays.on('click', (e) => {

            if ($(e.target).hasClass('overlays')) {
                e.preventDefault();
                $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
            }
        });

        // create shared views.
        new GenericDialogue(Shell.$genericDialogue);
    }
    
    resize(): void{
        super.resize();

        Shell.$overlays.width(this.extension.width());
        Shell.$overlays.height(this.extension.height());

        var mainHeight = this.$element.height() - parseInt(Shell.$mainPanel.css('marginTop')) - Shell.$headerPanel.height() - Shell.$footerPanel.height();
        Shell.$mainPanel.height(mainHeight);
    }
}

export = Shell;