import BaseView = require("./BaseView");
import Shell = require("./Shell");

class BaseExpandPanel extends BaseView {

    isExpanded: boolean = false;
    isFullyExpanded: boolean = false;
    isUnopened: boolean = true;
    autoToggled: boolean = false;

    $top: JQuery;
    $title: JQuery;
    $collapseButton: JQuery;
    $main: JQuery;
    $closed: JQuery;
    $expandButton: JQuery;
    $expandFullButton: JQuery;
    $closedTitle: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {

        super.create();

        this.$top = $('<div class="top"></div>');
        this.$element.append(this.$top);

        this.$title = $('<div class="title"></div>');
        this.$title.prop('title', this.content.title);
        this.$top.append(this.$title);

        this.$expandFullButton = $('<a class="expandFullButton"></a>');
        this.$expandFullButton.prop('title', this.content.expandFull);
        this.$top.append(this.$expandFullButton);
        
        if (!Utils.Bools.GetBool(this.config.options.expandFullEnabled, true)) {
            this.$expandFullButton.hide();
        } 

        this.$collapseButton = $('<div class="collapseButton"></div>');
        this.$collapseButton.prop('title', this.content.collapse);
        this.$top.append(this.$collapseButton);

        this.$closed = $('<div class="closed"></div>');
        this.$element.append(this.$closed);

        this.$expandButton = $('<a class="expandButton"></a>');
        this.$expandButton.prop('title', this.content.expand);
        this.$closed.append(this.$expandButton);

        this.$closedTitle = $('<a class="title"></a>');
        this.$closedTitle.prop('title', this.content.title);
        this.$closed.append(this.$closedTitle);

        this.$main = $('<div class="main"></div>');
        this.$element.append(this.$main);

        this.$expandButton.onPressed(() => {
            this.toggle();
        });

        this.$expandFullButton.onPressed(() => {
            this.expandFull();
        });

        this.$closedTitle.onPressed(() => {
            this.toggle();
        });

        this.$title.onPressed(() => {
            if (this.isFullyExpanded){
                this.collapseFull();
            } else {
                this.toggle();
            }
        });

        this.$collapseButton.onPressed(() => {
            if (this.isFullyExpanded){
                this.collapseFull();
            } else {
                this.toggle();
            }
        });

        this.$top.hide();
        this.$main.hide();
    }

    init(): void{
        super.init();
    }

    setTitle(title: string): void {
        this.$title.text(title);
        this.$closedTitle.text(title);
    }

    toggle(autoToggled?: boolean): void {

        (autoToggled) ? this.autoToggled = true : this.autoToggled = false;

        // if collapsing, hide contents immediately.
        if (this.isExpanded) {
            this.$top.hide();
            this.$main.hide();
            this.$closed.show();
        }

        this.$element.stop().animate(
            {
                width: this.getTargetWidth(),
                left: this.getTargetLeft()
            },
            this.options.panelAnimationDuration, () => {
                this.toggled();
            });
    }

    toggled(): void {
        this.toggleStart();

        this.isExpanded = !this.isExpanded;

        // if expanded show content when animation finished.
        if (this.isExpanded) {
            this.$closed.hide();
            this.$top.show();
            this.$main.show();
        }
        
        this.toggleFinish();

        this.isUnopened = false;
    }

    expandFull(): void {
        var targetWidth = this.getFullTargetWidth();
        var targetLeft = this.getFullTargetLeft();

        this.expandFullStart();

        this.$element.stop().animate(
            {
                width: targetWidth,
                left: targetLeft
            },
            this.options.panelAnimationDuration, () => {
                this.expandFullFinish();
            });
    }

    collapseFull(): void {
        var targetWidth = this.getTargetWidth();
        var targetLeft = this.getTargetLeft();

        this.collapseFullStart();

        this.$element.stop().animate(
            {
                width: targetWidth,
                left: targetLeft
            },
            this.options.panelAnimationDuration, () => {
                this.collapseFullFinish();
            });
    }

    getTargetWidth(): number{
        return 0;
    }

    getTargetLeft(): number {
        return 0;
    }

    getFullTargetWidth(): number{
        return 0;
    }

    getFullTargetLeft(): number{
        return 0;
    }

    toggleStart(): void {

    }

    toggleFinish(): void {
        if (this.isExpanded && !this.autoToggled){
            this.focusCollapseButton();
        } else {
            this.focusExpandButton();
        }
    }

    expandFullStart(): void {

    }

    expandFullFinish(): void {
        this.isFullyExpanded = true;
        this.$expandFullButton.hide();

        this.focusCollapseButton();
    }

    collapseFullStart(): void {

    }

    collapseFullFinish(): void {
        this.isFullyExpanded = false;
        this.$expandFullButton.show();

        this.focusExpandFullButton();
    }

    focusExpandButton(): void {
        setTimeout(() => {
            this.$expandButton.focus();
        }, 1);
    }

    focusExpandFullButton(): void {
        setTimeout(() => {
            this.$expandFullButton.focus();
        }, 1);
    }

    focusCollapseButton(): void {
        setTimeout(() => {
            this.$collapseButton.focus();
        }, 1);
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.parent().height() - this.$top.outerHeight(true));
    }
}

export = BaseExpandPanel;