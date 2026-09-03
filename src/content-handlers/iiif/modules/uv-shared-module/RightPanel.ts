import { Bools } from "../../Utils";
import { ExpandPanel } from "../../extensions/config/ExpandPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";

export class RightPanel<T extends ExpandPanel> extends BaseExpandPanel<T> {
  constructor($element: JQuery) {
    super($element, false, false);
  }

  create(): void {
    super.create();
  }

  init(): void {
    super.init();

    const shouldOpenPanel: boolean = Bools.getBool(
      this.extension.getSettings().rightPanelOpen,
      this.options.panelOpen
    );

    if (shouldOpenPanel) {
      this.toggle(true);
    }

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }
    });

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_RIGHT_PANEL, () => {
      this.toggle();
    });

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_LEFT_PANEL, () => {
      if (this.extension.isMetric("sm") && this.isExpanded) {
        this.toggle(true);
      }
    });
  }

  getTargetWidth(): number {
    return this.isExpanded
      ? this.options.panelCollapsedWidth
      : this.options.panelExpandedWidth;
  }

  getTargetLeft(): number {
    return this.isExpanded
      ? this.$element.parent().width() - this.options.panelCollapsedWidth
      : this.$element.parent().width() - this.options.panelExpandedWidth;
  }

  toggleFinish(): void {
    super.toggleFinish();

    if (this.isExpanded) {
      this.extensionHost.publish(IIIFEvents.OPEN_RIGHT_PANEL);
    } else {
      this.extensionHost.publish(IIIFEvents.CLOSE_RIGHT_PANEL);
    }
    this.extension.updateSettings({ rightPanelOpen: this.isExpanded });

    // there's a strange rendering issue due to the right panel being transformed by 100% to the right
    // for some reason a 100ms timeout on removing open-finished solves the problem
    // this can't be in the base panel class or the timeout interferes with test running even though it works fine
    setTimeout(() => {
      this.$element.toggleClass("open-finished");
    }, 100);
  }

  resize(): void {
    super.resize();
  }

  toggle(autoToggled?: boolean): void {
    if (this.isExpanded) {
      this.$element.parent().removeClass("rightPanelOpen");
    } else {
      this.$element.parent().addClass("rightPanelOpen");
    }

    super.toggle(autoToggled);
  }

  expandFull(): void {
    super.expandFull();
  }
}
