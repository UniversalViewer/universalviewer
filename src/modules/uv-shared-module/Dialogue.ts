import {BaseView} from "./BaseView";
import {BaseEvents} from "./BaseEvents";

export class Dialogue extends BaseView {

    allowClose: boolean = true;
    isActive: boolean = false;
    isUnopened: boolean = true;
    openCommand: string;
    closeCommand: string;
    returnFunc: any;

    $bottom: JQuery;
    $triggerButton: JQuery;
    $closeButton: JQuery;
    $content: JQuery;
    $buttons: JQuery;
    $middle: JQuery;
    $top: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('dialogue');

        super.create();

        // events.
        $.subscribe(BaseEvents.CLOSE_ACTIVE_DIALOGUE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        $.subscribe(BaseEvents.ESCAPE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        this.$top = $('<div class="top"></div>');
        this.$element.append(this.$top);

        this.$closeButton = $('<button type="button" class="btn btn-default close" tabindex="0">' + this.content.close + '</button>');

        this.$middle = $('<div class="middle"></div>');
        this.$element.append(this.$middle);

        this.$content = $('<div class="content"></div>');
        this.$middle.append(this.$content);

        this.$buttons = $('<div class="buttons"></div>');
        this.$middle.append(this.$buttons);

        this.$bottom = $('<div class="bottom"></div>');
        this.$element.append(this.$bottom);

        if (this.config.topCloseButtonEnabled) {
            this.$top.append(this.$closeButton);
        } else {
            this.$buttons.append(this.$closeButton);
        }

        this.$closeButton.on('click', (e) => {
            e.preventDefault();

            this.close();
        });

        this.returnFunc = this.close;
    }

    enableClose(): void {
        this.allowClose = true;
        this.$closeButton.show();
    }

    disableClose(): void {
        this.allowClose = false;
        this.$closeButton.hide();
    }

    setDockedPosition(): void {

        let top: number = Math.floor(this.extension.height() - this.$element.outerHeight(true));
        let left: number = 0;
        let arrowLeft: number = 0;
        let normalisedPos: number = 0;

        if (this.$triggerButton) {

            const verticalPadding: number = 4;
            const horizontalPadding: number = 2;

            const a: number = (<any>this.$triggerButton.offset()).top;
            const b: number = (<JQueryCoordinates>this.extension.$element.offset()).top;
            const d: number = this.$element.outerHeight(true);
            const e: number = (a - b) - d;

            top = e + verticalPadding;

            const f: number = (<JQueryCoordinates>this.$triggerButton.offset()).left;
            const g: number = (<JQueryCoordinates>this.extension.$element.offset()).left;
            const h: number = f - g;

            normalisedPos = Utils.Maths.normalise(h, 0, this.extension.width());

            left = Math.floor((this.extension.width() * normalisedPos) - ((this.$element.width()) * normalisedPos)) + horizontalPadding;
            arrowLeft = Math.floor(this.$element.width() * normalisedPos);
        }

        this.$bottom.css('backgroundPosition', arrowLeft + 'px 0px');

        this.$element.css({
            'top': top,
            'left': left
        });
    }

    open($triggerButton?: JQuery): void {
        this.$element.attr('aria-hidden', 'false');
        this.$element.show();

        if ($triggerButton && $triggerButton.length) {
            this.$triggerButton = $triggerButton;
            this.$bottom.show();
        } else {
            this.$bottom.hide();
        }
        
        this.isActive = true;

        // set the focus to the default button.
        setTimeout(() => {
            const $defaultButton: JQuery = this.$element.find('.default');
            if ($defaultButton.length) {
                $defaultButton.focus();
            } else {
                // if there's no default button, focus on the first visible input
                const $input: JQuery = this.$element.find('input:visible').first();

                if ($input.length) {
                    $input.focus();
                } else {
                    // if there's no visible first input, focus on the close button
                    this.$closeButton.focus();
                }
            }
        }, 1);

        $.publish(BaseEvents.SHOW_OVERLAY);

        if (this.isUnopened) {
            this.isUnopened = false;
            this.afterFirstOpen();
        }

        this.resize();
    }

    afterFirstOpen(): void {

    }

    close(): void {
        if (!this.isActive) return;
        this.$element.attr('aria-hidden', 'true');
        this.$element.hide();
        this.isActive = false;

        $.publish(this.closeCommand);
        $.publish(BaseEvents.HIDE_OVERLAY);
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'top': Math.floor((this.extension.height() / 2) - (this.$element.height() / 2)),
            'left': Math.floor((this.extension.width() / 2) - (this.$element.width() / 2))
        });
    }
}
