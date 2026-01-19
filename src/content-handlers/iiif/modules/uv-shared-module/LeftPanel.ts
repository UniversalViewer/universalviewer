import { Bools } from "../../Utils";
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";

export class LeftPanel<
  T extends BaseConfig["modules"]["leftPanel"],
> extends BaseExpandPanel<T> {
  constructor($element: JQuery) {
    super($element, false, false);
  }

  private isResizing: boolean = false;
  private resizeStartX: number = 0;
  private resizeStartWidth: number = 0;
  private readonly RESIZE_EDGE_WIDTH = 8;

  create(): void {
    super.create();

    this.initResizeHandlers();

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }
    });
  }

  private initResizeHandlers(): void {
    this.$element.on("mousemove", (e: JQuery.MouseMoveEvent) => {
      if (!this.isResizing && this.isInResizeZone(e)) {
        this.$element.css("cursor", "ew-resize");
      } else if (!this.isResizing) {
        this.$element.css("cursor", "");
      }
    });

    this.$element.on("mouseleave", () => {
      if (!this.isResizing) {
        this.$element.css("cursor", "");
      }
    });

    this.$element.on("mousedown", (e: JQuery.MouseDownEvent) => {
      if (this.isInResizeZone(e)) {
        e.preventDefault();
        this.isResizing = true;
        this.resizeStartX = e.pageX;
        this.resizeStartWidth = this.$element.width() || 271;

        $("body").addClass("resizing-panel");
        this.$element.parent().addClass("resizing");
      }
    });

    $(document).on("mousemove", (e: JQuery.MouseMoveEvent) => {
      if (this.isResizing) {
        const deltaX = e.pageX - this.resizeStartX;
        const newWidth = this.resizeStartWidth + deltaX;

        const minWidth = 150;
        const maxWidth = this.$element.parent().width() * 0.5;
        const constrainedWidth = Math.max(
          minWidth,
          Math.min(newWidth, maxWidth)
        );

        // update the CSS variable
        this.$element
          .parent()
          .css("--uv-grid-left-width-open", `${constrainedWidth}px`);
      }
    });

    $(document).on("mouseup", () => {
      if (this.isResizing) {
        this.isResizing = false;
        $("body").removeClass("resizing-panel");
        this.$element.parent().removeClass("resizing");
        this.$element.css("cursor", "");

        const finalWidth = parseInt(
          this.$element.parent().css("--uv-grid-left-width-open")
        );
        if (finalWidth) {
          this.extension.updateSettings({ leftPanelWidth: finalWidth });
        }

        this.extensionHost.publish(IIIFEvents.LEFT_PANEL_RESIZED);
      }
    });
  }

  private isInResizeZone(
    e: JQuery.MouseMoveEvent | JQuery.MouseDownEvent
  ): boolean {
    if (!this.isExpanded || this.isFullyExpanded) return false;

    const elementOffset = this.$element.offset();
    const elementWidth = this.$element.outerWidth();

    if (!elementOffset || !elementWidth) return false;

    const relativeX = e.pageX - elementOffset.left;
    return relativeX >= elementWidth - this.RESIZE_EDGE_WIDTH;
  }

  init(): void {
    super.init();

    const shouldOpenPanel: boolean = Bools.getBool(
      this.extension.getSettings().leftPanelOpen,
      this.options.panelOpen && !this.extension.isMetric("sm")
    );

    if (shouldOpenPanel) {
      this.toggle(true);
    }

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_LEFT_PANEL, () => {
      this.toggle();
    });

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_RIGHT_PANEL, () => {
      if (this.extension.isMetric("sm") && this.isExpanded) {
        this.toggle(true);
      }
    });

    this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, () => {
      if (this.extension.isMetric("sm")) {
        this.toggle();
      }
    });
  }

  getFullTargetWidth(): number {
    return this.$element.parent().width();
  }

  toggleFinish(): void {
    super.toggleFinish();

    if (this.isExpanded) {
      this.extensionHost.publish(IIIFEvents.OPEN_LEFT_PANEL);
    } else {
      this.extensionHost.publish(IIIFEvents.CLOSE_LEFT_PANEL);
    }

    this.extension.updateSettings({ leftPanelOpen: this.isExpanded });
    this.$element.toggleClass("open-finished");
  }

  resize(): void {
    super.resize();
  }

  toggle(autoToggled?: boolean): void {
    if (this.isExpanded) {
      this.$element.parent().removeClass("leftPanelOpen");
    } else {
      // Restore saved width or use default
      const savedWidth = this.extension.getSettings().leftPanelWidth;
      if (savedWidth) {
        this.$element
          .parent()
          .css("--uv-grid-left-width-open", `${savedWidth}px`);
      }
      this.$element.parent().addClass("leftPanelOpen");
    }
    super.toggle(autoToggled);
  }

  expandFull(): void {
    this.$element.parent().addClass("leftPanelOpenFull");
    this.$element.addClass("open");
    super.expandFull();
  }

  collapseFull(): void {
    // Restore width when collapsing from full
    const savedWidth = this.extension.getSettings().leftPanelWidth;
    if (savedWidth) {
      this.$element
        .parent()
        .css("--uv-grid-left-width-open", `${savedWidth}px`);
    }

    // Collapsing the fully open left panel doesn't actually close it,
    // it puts it back to the normal open state.
    // However, if the panel was closed when expandFull was triggered
    // the .mainPanel (parent of .leftPanel) won't have the class leftPanelOpen
    // which is required when the panel is in a normal open state (for the css grid to be set correctly).
    // So we check for this and add the class if necessary.
    this.$element.parent().removeClass("leftPanelOpenFull");
    if (!this.$element.parent().hasClass("leftPanelOpen")) {
      this.$element.parent().addClass("leftPanelOpen");
    }
    super.collapseFull();
  }
}
