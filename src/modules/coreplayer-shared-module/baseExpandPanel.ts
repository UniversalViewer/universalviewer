/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import baseView = require("./baseView");

export class BaseExpandPanel extends baseView.BaseView {

    isExpanded: boolean = false;
    isUnopened: boolean = true;

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
        
        this.setConfig('shared');
        
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

    init(): void{
        super.init();
    }

    toggle(): void {

        // if collapsing, hide contents immediately.
        if (this.isExpanded) {
            this.$top.hide();
            this.$main.hide();
            this.$closed.show();
        }

        var targetWidth = this.getTargetWidth();
        var targetLeft = this.getTargetLeft();

        /*
        if (immediate) {
            this.$element.width(targetWidth);
            this.$element.css('left', targetLeft);
            this.toggled();
            return;
        }
        */

        this.$element.stop().animate(
        {
            width: targetWidth,
            left: targetLeft
        },
        this.options.panelAnimationDuration, () => {
            this.toggled();               
        });
    }

    toggled(): void {
        this.isExpanded = !this.isExpanded;

        // if expanded show content when animation finished.
        if (this.isExpanded) {
            this.$closed.hide();
            this.$top.show();
            this.$main.show();
        }
        
        this.toggleComplete();

        this.isUnopened = false;
    }

    getTargetWidth(): number{
        return 0;
    }

    getTargetLeft(): number {
        return 0;
    }

    toggleComplete(): void {
        $.publish(baseExtension.BaseExtension.RESIZE);
    }

    resize(): void {
        super.resize();

        this.$main.actualHeight(this.$element.parent().height() - this.$top.outerHeight(true));
    }
}