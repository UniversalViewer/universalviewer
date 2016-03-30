import BaseCommands = require("./BaseCommands");

class Panel {

    $element: JQuery;
    fitToParentWidth: boolean;
    fitToParentHeight: boolean;
    isResized: boolean = false;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        this.$element = $element;
        this.fitToParentWidth = fitToParentWidth || false;
        this.fitToParentHeight = fitToParentHeight || false;

        this.create();
    }

    create(): void {
        $.subscribe(BaseCommands.RESIZE, () => {
            this.resize();
        });
    }

    resize(): void {
        var $parent = this.$element.parent();

        if (this.fitToParentWidth) {
            this.$element.width($parent.width());
        }

        if (this.fitToParentHeight) {
            this.$element.height($parent.height());
        }

        this.isResized = true;
    }
}

export = Panel;