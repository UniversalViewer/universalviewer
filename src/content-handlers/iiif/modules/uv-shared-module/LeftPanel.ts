import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";
import { Bools } from "@edsilv/utils";

export class LeftPanel<
  T extends BaseConfig["modules"]["leftPanel"]
> extends BaseExpandPanel<T> {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    super.create();

    this.$element.width(this.options.panelCollapsedWidth);

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }
    });
  }

  init(): void {
    super.init();

    const shouldOpenPanel: boolean = Bools.getBool(
      this.extension.getSettings().leftPanelOpen,
      this.options.panelOpen
    );

    if (shouldOpenPanel) {
      this.toggle(true);
    }
  }

  getTargetWidth(): number {
    if (this.isFullyExpanded || !this.isExpanded) {
      return this.options.panelExpandedWidth;
    } else {
      return this.options.panelCollapsedWidth;
    }
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
  }

  resize(): void {
    super.resize();

    if (this.isFullyExpanded) {
      this.$element.width(this.$element.parent().width());
    }
  }

  toggle(autoToggled?: boolean): void {
    if (this.isExpanded) {
      this.$element.parent().removeClass("leftPanelOpen");
    } else {
      this.$element.parent().addClass("leftPanelOpen");
    }

    super.toggle(autoToggled);
  }

  expandFull(): void {
    console.log("LeftPanel.ts:expandFull()");

    this.$element.parent().addClass("leftPanelOpenFull");
    super.expandFull();
  }

  collapseFull(): void {
    console.log("LeftPanel.ts:collapseFull()");

    this.$element.parent().removeClass("leftPanelOpenFull");

    // need this because 'closing' full width shouldn't actually do that
    // if puts the left panel back to normal open state
    // but if the left panel was previously closed, this class won't be present
    // so we put it back
    if (!this.$element.parent().hasClass("leftPanelOpen")) {
      this.$element.parent().addClass("leftPanelOpen");
    }

    super.collapseFull();
  }
}
