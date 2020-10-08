import {Events} from "../../extensions/uv-pdf-extension/Events";
import {FooterPanel as BaseFooterPanel} from "../uv-shared-module/FooterPanel";

export class FooterPanel extends BaseFooterPanel {
    $printButton: JQuery;

    currentPlacemarkerIndex: number;
    placemarkerTouched: boolean = false;
    terms: string;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig('pdfFooterPanel');
        super.create();

        this.$printButton = $(`
          <button class="print btn imageBtn" title="${this.content.print}" tabindex="0">
            <i class="uv-icon uv-icon-print" aria-hidden="true"></i>${this.content.print}
          </button>
        `);
        this.$options.prepend(this.$printButton);

        // ui event handlers.
        this.$printButton.onPressed(() => {
            this.component.publish(Events.PRINT);
        });

        this.updatePrintButton();
    }

    updatePrintButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.printEnabled, false);

        if (configEnabled){
            this.$printButton.show();
        } else {
            this.$printButton.hide();
        }
    }
}
