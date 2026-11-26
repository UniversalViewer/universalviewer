const $ = require("jquery");
import { Bools } from "../../Utils";
import { ExpandPanel } from "../../extensions/config/ExpandPanel";
import { BaseView } from "./BaseView";

import { ComponentType, createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import Button, { TooltipPlacement } from "./Button";
import { CollapseLeftPanel, ExpandLeftPanel } from "./Icons";

export class BaseExpandPanel<T extends ExpandPanel> extends BaseView<T> {
  isExpanded: boolean = false;
  isFullyExpanded: boolean = false;
  isUnopened: boolean = true;
  autoToggled: boolean = false;
  expandFullEnabled: boolean = true;

  $closed: JQuery;
  $closedTitle: JQuery;
  $collapseButton: JQuery;
  $expandButton: JQuery;
  $expandFullButton: JQuery;
  $main: JQuery;
  $title: JQuery;
  $top: JQuery;

  collapseButtonRoot: Root;
  expandButtonRoot: Root;

  constructor(
    $element: JQuery,
    fitToParentWidth: boolean = false,
    fitToParentHeight: boolean = true
  ) {
    super($element, fitToParentWidth, fitToParentHeight);
  }

  create(): void {
    super.create();

    this.$top = $('<div class="top"></div>');
    this.$element.append(this.$top);

    this.$title = $('<h2 class="title"></h2>');
    this.$top.append(this.$title);

    this.$expandFullButton = $('<a class="expandFullButton" tabindex="0"></a>');
    this.$top.append(this.$expandFullButton);

    if (!Bools.getBool(this.config.options.expandFullEnabled, true)) {
      this.$expandFullButton.hide();
    }

    this.$collapseButton = $('<div class="collapseButton"></div>');
    this.$top.append(this.$collapseButton);
    this.collapseButtonRoot = createRoot(this.$collapseButton[0]);

    this.$closed = $('<div class="closed"></div>');
    this.$element.append(this.$closed);

    this.$expandButton = $('<div class="expandButton"></div>');
    this.$closed.append(this.$expandButton);
    this.expandButtonRoot = createRoot(this.$expandButton[0]);

    this.$closedTitle = $('<a class="title"></a>');
    this.$closed.append(this.$closedTitle);

    this.$main = $('<div class="main"></div>');
    this.$element.append(this.$main);

    this.$expandFullButton.on("click", () => {
      this.expandFull();
    });

    this.$closedTitle.on("click", () => {
      this.toggle();
    });

    this.$title.on("click", () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.toggle();
      }
    });

    this.renderToggleButtons(false);
  }

  init(): void {
    super.init();
  }

  renderToggleButtons(expanded: boolean): void {
    const tooltipPlacement = this.getToggleTooltipPlacement();

    this.collapseButtonRoot?.render(
      createElement(
        Button,
        {
          className: "collapseButton",
          label: this.content.collapse,
          tooltipPlacement,
          "aria-expanded": expanded,
          onClick: () => {
            if (this.isFullyExpanded) {
              this.collapseFull();
            } else {
              this.toggle();
            }
          },
        },
        createElement(this.getCollapseIcon())
      )
    );

    this.expandButtonRoot?.render(
      createElement(
        Button,
        {
          className: "expandButton",
          label: this.content.expand,
          tooltipPlacement,
          "aria-expanded": expanded,
          onClick: () => this.toggle(),
        },
        createElement(this.getExpandIcon())
      )
    );
  }

  setTitle(title: string): void {
    this.$title.text(title);
    this.$closedTitle.text(title);
  }

  toggle(autoToggled?: boolean): void {
    const settings = this.extension.getSettings();
    const isReducedAnimation = settings.reducedAnimation;

    const oldAnimationDuration =
      document.documentElement.style.getPropertyValue(
        "--uv-animation-duration"
      );
    if (this.options.panelAnimationDuration) {
      document.documentElement.style.setProperty(
        "--uv-animation-duration",
        `${this.options.panelAnimationDuration}ms`
      );
    }

    autoToggled ? (this.autoToggled = true) : (this.autoToggled = false);

    this.$element.toggleClass("open");

    if (this.isExpanded) {
      this.$top.attr("aria-hidden", "true");
      this.$main.attr("aria-hidden", "true");
      this.$closed.attr("aria-hidden", "false");
      this.renderToggleButtons(false);
    }

    let timeout = 0;
    if (!isReducedAnimation) {
      timeout =
        (this.options.panelAnimationDuration ??
          settings.animationDuration ??
          250) + 50;
    }

    setTimeout(() => {
      this.toggled();

      if (oldAnimationDuration) {
        document.documentElement.style.setProperty(
          "--uv-animation-duration",
          `${oldAnimationDuration}`
        );
      }
    }, timeout);
  }

  toggled(): void {
    this.toggleStart();

    this.isExpanded = !this.isExpanded;

    // if expanded show content when animation finished.
    if (this.isExpanded) {
      this.$top.attr("aria-hidden", "false");
      this.$main.attr("aria-hidden", "false");
      this.$closed.attr("aria-hidden", "true");
      this.renderToggleButtons(true);
    }

    this.toggleFinish();

    this.isUnopened = false;
  }

  expandFull(): void {
    const settings = this.extension.getSettings();
    const isReducedAnimation = settings.reducedAnimation;

    const oldAnimationDuration =
      document.documentElement.style.getPropertyValue(
        "--uv-animation-duration"
      );
    if (this.options.panelAnimationDuration) {
      document.documentElement.style.setProperty(
        "--uv-animation-duration",
        `${this.options.panelAnimationDuration * 2}ms`
      );
    }

    this.expandFullStart();

    let timeout = 0;

    if (!isReducedAnimation) {
      timeout =
        (this.options.panelAnimationDuration ??
          settings.animationDuration ??
          250) + 50;

      // double it because it's the full expand
      timeout = timeout * 2;
    }

    setTimeout(() => {
      if (!this.isExpanded) {
        this.toggled();
      }
      this.expandFullFinish();

      if (oldAnimationDuration) {
        document.documentElement.style.setProperty(
          "--uv-animation-duration",
          `${oldAnimationDuration}`
        );
      }
    }, timeout);
  }

  collapseFull(): void {
    const settings = this.extension.getSettings();
    const isReducedAnimation = settings.reducedAnimation;

    const oldAnimationDuration =
      document.documentElement.style.getPropertyValue(
        "--uv-animation-duration"
      );
    if (this.options.panelAnimationDuration) {
      document.documentElement.style.setProperty(
        "--uv-animation-duration",
        `${this.options.panelAnimationDuration * 2}ms`
      );
    }

    this.collapseFullStart();

    // run a timeout either way, zero just means instant(ish)
    let timeout = 0;

    // if we're not reducing animation then set the correct timeout
    if (!isReducedAnimation) {
      timeout =
        (this.options.panelAnimationDuration ??
          settings.animationDuration ??
          250) + 50;

      // double duration for full size anims
      timeout = timeout * 2;
    }

    setTimeout(() => {
      this.collapseFullFinish();

      if (oldAnimationDuration) {
        document.documentElement.style.setProperty(
          "--uv-animation-duration",
          `${oldAnimationDuration}`
        );
      }
    }, timeout);
  }

  getTargetWidth(): number {
    return 0;
  }

  getTargetLeft(): number {
    return 0;
  }

  getFullTargetWidth(): number {
    return 0;
  }

  getFullTargetLeft(): number {
    return 0;
  }

  toggleStart(): void {}

  toggleFinish(): void {
    if (this.autoToggled) {
      return;
    }

    if (this.isExpanded) {
      this.focusCollapseButton();
    } else {
      this.focusExpandButton();
    }
  }

  expandFullStart(): void {}

  expandFullFinish(): void {
    this.isFullyExpanded = true;
    this.$expandFullButton.hide();
    this.renderToggleButtons(this.isExpanded);
  }

  collapseFullStart(): void {}

  collapseFullFinish(): void {
    this.isFullyExpanded = false;

    if (this.expandFullEnabled) {
      this.$expandFullButton.show();
    }
    this.renderToggleButtons(this.isExpanded);
    this.focusExpandFullButton();
  }

  focusExpandButton(): void {
    setTimeout(() => {
      this.$expandButton.find("button").trigger("focus");
    }, 1);
  }

  focusExpandFullButton(): void {
    setTimeout(() => {
      this.$expandFullButton.focus();
    }, 1);
  }

  focusCollapseButton(): void {
    setTimeout(() => {
      this.$collapseButton.find("button").trigger("focus");
    }, 1);
  }

  // this method gets overridden in the right panel
  getToggleTooltipPlacement(): TooltipPlacement {
    return this.isFullyExpanded ? "left" : "right";
  }

  resize(): void {
    super.resize();

    this.$main.height(this.$element.height() - this.$top.outerHeight(true));
  }

  // overridden in the right panel
  getExpandIcon(): ComponentType {
    return ExpandLeftPanel;
  }

  // overridden in the right panel
  getCollapseIcon(): ComponentType {
    return CollapseLeftPanel;
  }
}
