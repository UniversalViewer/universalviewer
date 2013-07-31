/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseView = module("app/BaseView");

export class BaseExpandPanel extends baseView.BaseView {

    isExpanded: bool = false;
    isUnopened: bool = true;

    $top: JQuery;
    $title: JQuery;
    $collapseButton: JQuery;
    $main: JQuery;
    $closed: JQuery;
    $expandButton: JQuery;
    $closedTitle: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();

        this.$top = utils.Utils.createDiv('top');
        this.$element.append(this.$top);

        this.$title = utils.Utils.createDiv('title');
        this.$top.append(this.$title);

        this.$collapseButton = utils.Utils.createDiv('collapseButton');
        this.$top.append(this.$collapseButton);

        this.$closed = utils.Utils.createDiv('closed');
        this.$element.append(this.$closed);

        this.$expandButton = $('<a class="expandButton"></a>');
        this.$closed.append(this.$expandButton);

        this.$closedTitle = $('<a class="title"></a>');
        this.$closed.append(this.$closedTitle);

        this.$main = utils.Utils.createDiv('main');
        this.$element.append(this.$main);

        this.$expandButton.on('click', (e) => {
            e.preventDefault();

            this.toggle();
        });

        this.$closedTitle.on('click', (e) => {
            e.preventDefault();

            this.toggle();
        });

        this.$title.on('click', (e) => {
            e.preventDefault();

            this.toggle();
        });

        this.$collapseButton.on('click', (e) => {
            e.preventDefault();

            this.toggle();
        });

        this.$top.hide();
        this.$main.hide();
    }

    toggle(immediate?: bool): void {

        // if collapsing, hide contents immediately.
        if (this.isExpanded) {
            this.$top.hide();
            this.$main.hide();
            this.$closed.show();
        }
        
        var duration = immediate ? 1 : this.options.panelAnimationDuration;

        this.$element.stop().animate(
            {
                width: this.getTargetWidth(),
                left: this.getTargetLeft()
            },
            duration, () => {

                this.isExpanded = !this.isExpanded;

                // if expanded show content when animation finished.
                if (this.isExpanded) {
                    this.$closed.hide();
                    this.$top.show();
                    this.$main.show();
                }
                
                this.toggleComplete();

                this.isUnopened = false;

                $.publish(baseApp.BaseApp.RESIZE);
            });
    }

    getTargetWidth(): number{
        return 0;
    }

    getTargetLeft(): number {
        return 0;
    }

    toggleComplete(): void {
        
    }

    resize(): void {
        super.resize();

        this.$main.actualHeight(this.$element.parent().height() - this.$top.outerHeight(true));
    }
}