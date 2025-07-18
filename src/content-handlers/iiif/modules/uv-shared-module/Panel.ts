import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { Async } from "../../Utils";
import { Events } from "../../../../Events";

export class Panel {
  extensionHost: IIIFExtensionHost;
  $element: JQuery;
  fitToParentWidth: boolean;
  fitToParentHeight: boolean;
  isResized: boolean = false;

  constructor(
    $element: JQuery,
    fitToParentWidth?: boolean,
    fitToParentHeight?: boolean
  ) {
    this.$element = $element;
    this.fitToParentWidth = fitToParentWidth || false;
    this.fitToParentHeight = fitToParentHeight || false;

    this.create();
  }

  create(): void {
    this.extensionHost?.subscribe(Events.RESIZE, () => {
      this.resize();
    });
  }

  whenResized(cb: () => void): void {
    Async.waitFor(() => {
      return this.isResized;
    }, cb);
  }

  onAccessibleClick(
    el: JQuery,
    callback: (e: JQueryEventObject) => void,
    withClick = true,
    treatAsButton = false
  ) {
    if (withClick) {
      el.on("click", (e) => {
        callback(e);
      });
    }

    el.on("keydown", (e) => {
      // by passing treatAsButton  as true this will become false
      // and so an anchor won't be excluded from Space presses
      const isAnchor = e.target.nodeName === "A" && !treatAsButton;

      // 13 = Enter, 32 = Space
      if ((e.which === 32 && !isAnchor) || e.which === 13) {
        // stops space scrolling the page
        e.preventDefault();
        callback(e);
      }
    });
  }

  resize(): void {
    const $parent: JQuery = this.$element.parent();

    if (this.fitToParentWidth) {
      this.$element.width($parent.width());
    }

    if (this.fitToParentHeight) {
      this.$element.height($parent.height());
    }

    this.isResized = true;
  }
}
