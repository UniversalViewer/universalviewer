import { Bools } from "@edsilv/utils";
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";

export class LeftPanel<
  T extends BaseConfig["modules"]["leftPanel"]
> extends BaseExpandPanel<T> {
  constructor($element: JQuery) {
    super($element, false, false);
  }

  create(): void {
    super.create();

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
      this.options.panelOpen && !this.extension.isMetric("sm")
    );

    if (shouldOpenPanel) {
      this.toggle(true);
    }

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_LEFT_PANEL, () => {
      this.toggle();
    });
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

    this.$element.toggleClass("open-finished");
  }

  resize(): void {
    super.resize();
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
    this.$element.parent().addClass("leftPanelOpenFull");
    this.$element.addClass("open");
    super.expandFull();
  }

  collapseFull(): void {
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
