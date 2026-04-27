const $ = require("jquery");
import { BaseView } from "./BaseView";
import { IIIFEvents } from "../../IIIFEvents";
import { Maths } from "../../Utils";
import { BaseConfig } from "../../BaseConfig";

export class Dialogue<
  T extends BaseConfig["modules"]["dialogue"],
> extends BaseView<T> {
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
    this.setConfig("dialogue");
    super.create();

    // events.
    this.extensionHost.subscribe(IIIFEvents.CLOSE_ACTIVE_DIALOGUE, () => {
      if (this.isActive) {
        if (this.allowClose) {
          this.close();
        }
      }
    });

    this.extensionHost.subscribe(IIIFEvents.ESCAPE, () => {
      if (this.isActive) {
        if (this.allowClose) {
          this.close();
        }
      }
    });

    this.$top = $('<div class="top"></div>');
    this.$element.append(this.$top);

    this.$closeButton = $(
      '<button type="button" class="btn btn-default close" tabindex="0">' +
        this.content.close +
        "</button>"
    );

    this.$middle = $('<div class="middle"></div>');
    this.$element.append(this.$middle);

    this.$content = $('<div class="content"></div>');
    this.$middle.append(this.$content);

    this.$buttons = $('<div class="buttons"></div>');
    this.$middle.append(this.$buttons);

    this.$bottom = $('<div class="bottom"></div>');
    this.$element.append(this.$bottom);

    if (this.options.topCloseButtonEnabled) {
      this.$top.append(this.$closeButton);
    } else {
      this.$buttons.append(this.$closeButton);
    }

    this.$closeButton.on("click", (e) => {
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
    let top: number = Math.floor(
      this.extension.height() - this.$element.outerHeight(true)
    );
    let left: number = 0;
    let arrowLeft: number = 0;
    let normalisedPos: number = 0;

    if (this.$triggerButton) {
      const verticalPadding: number = 4;
      const horizontalPadding: number = 2;

      const a: number = (<any>this.$triggerButton.offset()).top;
      const b: number = (<JQueryCoordinates>this.extension.$element.offset())
        .top;
      const d: number = this.$element.outerHeight(true);
      const e: number = a - b - d;

      top = e + verticalPadding;

      const f: number = (<JQueryCoordinates>this.$triggerButton.offset()).left;
      const g: number = (<JQueryCoordinates>this.extension.$element.offset())
        .left;
      const h: number = f - g;

      normalisedPos = Maths.normalise(h, 0, this.extension.width());

      left =
        Math.floor(
          this.extension.width() * normalisedPos -
            this.$element.width() * normalisedPos
        ) + horizontalPadding;
      arrowLeft = Math.floor(this.$element.width() * normalisedPos);
    }

    this.$bottom.css("backgroundPosition", arrowLeft + "px 0px");

    this.$element.css({
      top: top,
      left: left,
    });
  }

  open(triggerButton?: HTMLElement): void {
    this.extensionHost.publish(IIIFEvents.CLOSE_ACTIVE_DIALOGUE);

    this.$element.attr("aria-hidden", "false");
    this.$element.show();

    if (triggerButton) {
      this.$triggerButton = $(triggerButton);
      this.$bottom.show();
    } else {
      this.$bottom.hide();
    }

    this.isActive = true;

    // set the focus to the default button.
    setTimeout(() => {
      const $defaultButton: JQuery = this.$element.find(".default");
      if ($defaultButton.length) {
        $defaultButton.focus();
      } else {
        // if there's no default button, focus on the first visible input or select element
        const $firstVisibleElement: JQuery = this.$element
          .find("input:visible, select:visible")
          .first();

        if ($firstVisibleElement.length) {
          $firstVisibleElement.focus();
        } else {
          // if there's no visible first input, focus on the close button
          this.$closeButton.focus();
        }
      }
    }, 1);

    // Add keydown event listener to trap focus within the dialog
    this.$element.on("keydown", (e: JQuery.Event) => this.handleKeydown(e));

    this.extensionHost.publish(IIIFEvents.SHOW_OVERLAY);

    if (this.isUnopened) {
      this.isUnopened = false;
      this.afterFirstOpen();
    }

    this.resize();
  }

  afterFirstOpen(): void {}

  close(): void {
    if (!this.isActive) return;
    this.$element.attr("aria-hidden", "true");
    this.$element.hide();
    this.isActive = false;

    // Remove the keydown event listener
    this.$element.off("keydown");

    this.extensionHost.publish(this.closeCommand);
    this.extensionHost.publish(IIIFEvents.HIDE_OVERLAY);
  }

  resize(): void {
    super.resize();

    this.$element.css({
      top: Math.floor(this.extension.height() / 2 - this.$element.height() / 2),
      left: Math.floor(this.extension.width() / 2 - this.$element.width() / 2),
    });
  }

  private handleKeydown(event: JQuery.Event): void {
    if (event.key === "Tab") {
      const focusableSelectors =
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex="0"]';
      const focusableElements = this.$element
        .find(focusableSelectors)
        .filter(":visible");

      const firstElement = focusableElements.first()[0];
      const lastElement = focusableElements.last()[0];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab (backwards)
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forwards)
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
}
