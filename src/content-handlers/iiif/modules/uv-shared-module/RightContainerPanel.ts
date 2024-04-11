import { BaseConfig } from "../../BaseConfig";
//import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "./BaseView";
//import { Bools } from "@edsilv/utils";

export class RightContainerPanel<
    T extends BaseConfig["modules"]["rightContainerPanel"]
> extends BaseView<T> {
    childrenWidth: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();
    }

    resize(): void {
        super.resize();

        this.$element.children().each(function (i) {
            this.childrenWidth = this.childrenWidth + $(this).outerWidth();
        });

        this.$element.css({
            left: Math.floor(
                this.$element.parent().width() - this.$element.outerWidth() - this.childrenWidth
            ),
        });
    }
}