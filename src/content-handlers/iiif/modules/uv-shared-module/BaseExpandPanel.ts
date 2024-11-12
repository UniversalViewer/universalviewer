const $ = require("jquery");
import { BaseView } from "./BaseView";
import { Bools } from "@edsilv/utils";
import { ExpandPanel } from "../../extensions/config/ExpandPanel";

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

  constructor($element: JQuery) {
    super($element, false, true);
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

    this.$collapseButton = $(
      '<button role="button" class="collapseButton" tabindex="0"></button>'
    );
    this.$collapseButton.prop("title", this.content.collapse);
    this.$top.append(this.$collapseButton);

    this.$closed = $('<div class="closed"></div>');
    this.$element.append(this.$closed);

    this.$expandButton = $(
      '<button role="button" class="expandButton" tabindex="0"></button>'
    );
    this.$expandButton.prop("title", this.content.expand);

    this.$closed.append(this.$expandButton);

    this.$closedTitle = $('<a class="title"></a>');
    this.$closed.append(this.$closedTitle);

    this.$main = $('<div class="main"></div>');
    this.$element.append(this.$main);

    this.onAccessibleClick(this.$expandButton, () => {
      this.toggle();
    });

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

    this.onAccessibleClick(this.$collapseButton, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.toggle();
      }
    });

    this.$top.hide();
    this.$main.hide();
  }

  init(): void {
    super.init();
  }

  setTitle(title: string): void {
    this.$title.text(title);
    this.$closedTitle.text(title);
  }

  toggle(autoToggled?: boolean): void {
    const settings = this.extension.getSettings();
    let isReducedAnimation = settings.reducedAnimation;

    autoToggled ? (this.autoToggled = true) : (this.autoToggled = false);

    // if collapsing, hide contents immediately.
    if (this.isExpanded) {
      this.$top.attr("aria-hidden", "true");
      this.$main.attr("aria-hidden", "true");
      this.$closed.attr("aria-hidden", "false");
      this.$top.hide();
      this.$main.hide();
      this.$closed.show();
    }

    if (isReducedAnimation) {
      // This is reduced motion.
      this.$element.css("width", this.getTargetWidth());
      this.$element.css("left", this.getTargetLeft());
      this.toggled();
    } else {
      // Otherwise animate.
      this.$element.stop().animate(
        {
          width: this.getTargetWidth(),
          left: this.getTargetLeft(),
        },
        this.options.panelAnimationDuration,
        () => {
          this.toggled();
        }
      );
    }
  }

  toggled(): void {
    this.toggleStart();

    this.isExpanded = !this.isExpanded;

    // if expanded show content when animation finished.
    if (this.isExpanded) {
      this.$top.attr("aria-hidden", "false");
      this.$main.attr("aria-hidden", "false");
      this.$closed.attr("aria-hidden", "true");
      this.$closed.hide();
      this.$top.show();
      this.$main.show();
    }

    this.toggleFinish();

    this.isUnopened = false;
  }

  expandFull(): void {
    if (!this.isExpanded) {
      this.toggled();
    }

    const settings = this.extension.getSettings();
    let isReducedAnimation = settings.reducedAnimation;

    var targetWidth: number = this.getFullTargetWidth();
    var targetLeft: number = this.getFullTargetLeft();

    this.expandFullStart();

    if (isReducedAnimation) {
      this.$element.css("width", targetWidth);
      this.$element.css("left", targetLeft);
      this.expandFullFinish();
    } else {
      this.$element.stop().animate(
        {
          width: targetWidth,
          left: targetLeft,
        },
        this.options.panelAnimationDuration,
        () => {
          this.expandFullFinish();
        }
      );
    }
  }

  collapseFull(): void {
    const settings = this.extension.getSettings();
    let isReducedAnimation = settings.reducedAnimation;

    var targetWidth: number = this.getTargetWidth();
    var targetLeft: number = this.getTargetLeft();

    this.collapseFullStart();

    if (isReducedAnimation) {
      this.$element.css("width", targetWidth);
      this.$element.css("left", targetLeft);
      this.collapseFullFinish();
    } else {
      this.$element.stop().animate(
        {
          width: targetWidth,
          left: targetLeft,
        },
        this.options.panelAnimationDuration,
        () => {
          this.collapseFullFinish();
        }
      );
    }
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
    if (this.isExpanded && !this.autoToggled) {
      this.focusCollapseButton();
    } else {
      this.focusExpandButton();
    }
  }

  expandFullStart(): void {}

  expandFullFinish(): void {
    this.isFullyExpanded = true;
    this.$expandFullButton.hide();
  }

  collapseFullStart(): void {}

  collapseFullFinish(): void {
    this.isFullyExpanded = false;

    if (this.expandFullEnabled) {
      this.$expandFullButton.show();
    }

    this.focusExpandFullButton();
  }

  focusExpandButton(): void {
    setTimeout(() => {
      this.$expandButton.focus();
    }, 1);
  }

  focusExpandFullButton(): void {
    setTimeout(() => {
      this.$expandFullButton.focus();
    }, 1);
  }

  focusCollapseButton(): void {
    setTimeout(() => {
      this.$collapseButton.focus();
    }, 1);
  }

  resize(): void {
    super.resize();

    this.$main.height(
      this.$element.parent().height() - this.$top.outerHeight(true)
    );
  }
}
