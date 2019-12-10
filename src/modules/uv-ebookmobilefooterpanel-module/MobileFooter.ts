import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";

export class FooterPanel extends BaseFooterPanel {

    $fullScreenBtn: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('mobileFooterPanel');

        super.create();
    }

    resize(): void {
        super.resize();

        this.$options.css('left', Math.floor((this.$element.width() / 2) - (this.$options.width() / 2)));
    }
}