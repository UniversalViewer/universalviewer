const $ = require("jquery");
import { Bools } from "../../Utils";
import { sanitize } from "../../../../Utils";
import { ViewingDirection } from "@iiif/vocabulary";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import ImageControls from "./ImageControls";

export class OpenSeadragonCenterPanel extends CenterPanel<
  Config["modules"]["openSeadragonCenterPanel"]
> {
  autoHideControls: boolean;
  controlsFadeTimeout: number;
  isCreated: boolean = false;
  nextButtonEnabled: boolean = false;
  prevButtonEnabled: boolean = false;
  showAdjustImageButton: boolean;
  showHomeButton: boolean;

  $nextButton: JQuery;
  $prevButton: JQuery;

  $navigator: JQuery;
  $imageControlsContainer: JQuery;

  imageControlsRoot: Root;
  hasChoices: boolean = false;

  // The AdjustImageDialogue and ChoiceSwitchDialogue position themselves against the old jquery buttons,
  // so these getters allow them access - but ultimately the dialogues should be redesigned and become part of the ImageControls react component,
  // then we can remove this workaround.
  get $adjustImageButton(): JQuery {
    return this.$imageControlsContainer.find(".adjustImage");
  }

  get $choiceSwitchButton(): JQuery {
    return this.$imageControlsContainer.find(".choiceSwitch");
  }

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("openSeadragonCenterPanel");

    super.create();

    // needs to happen here so that the element already exists for OSD to render the nav inside it
    this.createNavigator();

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN,
      () => {
        this.openPagesHandler();
      }
    );

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      this.setNavigatorVisible();
    });

    this.extensionHost.subscribe(IIIFEvents.SETTINGS_CHANGE, () => {
      this.setNavigatorVisible();
    });

    this.createUI();
  }

  createUI(): void {
    this.createImageControls();
    this.createNavigationButtons();
    this.hidePrevButton();
    this.hideNextButton();
    this.setupControlsFade();
  }

  createNavigator(): void {
    this.$navigator = $('<div id="osd-navigator-container"></div>');
    // navigator needs to be appended to the .centerPanel, not .content, so it moves with the grid resize on panels opening
    this.$content.append(this.$navigator);
    this.setNavigatorVisible();
  }

  setNavigatorVisible(): void {
    const enabled: boolean =
      Bools.getBool(this.extension.getSettings().navigatorEnabled, true) &&
      this.extension.isDesktopMetric();

    this.$navigator.toggle(enabled);

    this.$navigator.toggleClass(
      "continuous",
      this.extension.helper.isContinuous()
    );
  }

  createImageControls(): void {
    this.showAdjustImageButton = Bools.getBool(
      this.config.options.showAdjustImageControl,
      false
    );

    this.showHomeButton = Bools.getBool(
      this.config.options.showHomeControl,
      false
    );

    this.$imageControlsContainer = $(
      '<div class="imageControlsContainer"></div>'
    );
    this.$content.prepend(this.$imageControlsContainer);
    this.imageControlsRoot = createRoot(this.$imageControlsContainer[0]);
    this.renderImageControls();
  }

  renderImageControls(): void {
    if (!this.imageControlsRoot) return;

    this.imageControlsRoot.render(
      createElement(ImageControls, {
        extensionHost: this.extensionHost,
        content: this.content,
        showHomeButton: this.showHomeButton,
        showAdjustImageButton: this.showAdjustImageButton,
        hasChoices: this.hasChoices,
      })
    );
  }

  indicesIncludeChoices(indices: number[]): boolean {
    return indices.some((index) => {
      const canvas = this.extension.helper.getCanvasByIndex(index);
      return canvas.getChoices().length > 0;
    });
  }

  updateChoiceSwitchVisibility(): void {
    const indices = this.extension.getPagedIndices();
    this.hasChoices = this.indicesIncludeChoices(indices);
    this.renderImageControls();
  }

  createNavigationButtons(): void {
    const viewingDirection: ViewingDirection =
      this.extension.helper.getViewingDirection() ||
      ViewingDirection.LEFT_TO_RIGHT;

    this.$prevButton = $(
      `<button class="btn btn-default paging prev" title="${this.content.previousImage}">
          <i class="uv-icon-prev" aria-hidden="true"></i>
          <span class="sr-only">${this.content.previousImage}</span>
        </button>`
    );

    if (this.extension.helper.isRightToLeft()) {
      this.$prevButton
        .prop("title", this.content.nextImage)
        .attr("aria-label", this.content.nextImage);
    } else {
      this.$prevButton
        .prop("title", this.content.previousImage)
        .attr("aria-label", this.content.previousImage);
    }

    this.$nextButton = $(
      `<button class="btn btn-default paging next" title="${this.content.nextImage}">
        <i class="uv-icon-next" aria-hidden="true"></i>
        <span class="sr-only">${this.content.nextImage}</span>
      </button>`
    );

    if (this.extension.helper.isRightToLeft()) {
      this.$nextButton
        .prop("title", this.content.previousImage)
        .attr("aria-label", this.content.previousImage);
    } else {
      this.$nextButton
        .prop("title", this.content.nextImage)
        .attr("aria-label", this.content.nextImage);
    }

    this.$content.append(this.$prevButton);
    this.$content.append(this.$nextButton);

    switch (viewingDirection) {
      case ViewingDirection.TOP_TO_BOTTOM:
        this.$prevButton.addClass("vertical");
        this.$nextButton.addClass("vertical");
        break;
      case ViewingDirection.BOTTOM_TO_TOP:
        this.$prevButton.addClass("vertical down");
        this.$nextButton.addClass("vertical up");
        break;
    }

    const that = this;

    this.onAccessibleClick(this.$prevButton, (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (!that.prevButtonEnabled) return;

      switch (viewingDirection) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.extensionHost.publish(IIIFEvents.PREV);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.NEXT);
          break;
      }
    });

    this.onAccessibleClick(this.$nextButton, (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (!that.nextButtonEnabled) return;

      switch (viewingDirection) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.extensionHost.publish(IIIFEvents.NEXT);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.PREV);
          break;
      }
    });
  }

  openPagesHandler(): void {
    this.isCreated = true;

    this.title = this.extension.helper.getLabel();
    this.resize();

    if (
      this.extension.helper.isMultiCanvas() &&
      !this.extension.helper.isContinuous()
    ) {
      this.showPrevButton();
      this.showNextButton();

      const viewingDirection: ViewingDirection =
        this.extension.helper.getViewingDirection() ||
        ViewingDirection.LEFT_TO_RIGHT;

      if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
        if (this.extension.helper.isFirstCanvas()) {
          this.disableNextButton();
        } else {
          this.enableNextButton();
        }

        if (this.extension.helper.isLastCanvas()) {
          this.disablePrevButton();
        } else {
          this.enablePrevButton();
        }
      } else {
        if (this.extension.helper.isFirstCanvas()) {
          this.disablePrevButton();
        } else {
          this.enablePrevButton();
        }

        if (this.extension.helper.isLastCanvas()) {
          this.disableNextButton();
        } else {
          this.enableNextButton();
        }
      }
    } else {
      this.hidePrevButton();
      this.hideNextButton();
    }

    this.updateChoiceSwitchVisibility();
    this.setNavigatorVisible();
  }

  disablePrevButton(): void {
    this.prevButtonEnabled = false;
    this.$prevButton.addClass("disabled");
    this.$prevButton.attr("tabindex", -1);
  }

  enablePrevButton(): void {
    this.prevButtonEnabled = true;
    this.$prevButton.removeClass("disabled");
    this.$prevButton.attr("tabindex", 0);
  }

  hidePrevButton(): void {
    this.disablePrevButton();
    this.$prevButton.hide();
  }

  showPrevButton(): void {
    this.enablePrevButton();
    this.$prevButton.show();
  }

  disableNextButton(): void {
    this.nextButtonEnabled = false;
    this.$nextButton.addClass("disabled");
    this.$nextButton.attr("tabindex", -1);
  }

  enableNextButton(): void {
    this.nextButtonEnabled = true;
    this.$nextButton.removeClass("disabled");
    this.$nextButton.attr("tabindex", 0);
  }

  hideNextButton(): void {
    this.disableNextButton();
    this.$nextButton.hide();
  }

  showNextButton(): void {
    this.enableNextButton();
    this.$nextButton.show();
  }

  setupControlsFade(): void {
    this.autoHideControls = Bools.getBool(
      this.config.options.autoHideControls,
      true
    );
    if (!this.autoHideControls) return;

    // select the element to detect interaction activity on
    const $activeArea = this.$element.parent();

    // pointer events also cover touch
    $activeArea.on("pointermove pointerdown", () => this.showControls());

    // stay visible when using keyboard to navigate
    this.$element.on("focusin", () => this.showControls());

    this.showControls();
  }

  showControls(): void {
    clearTimeout(this.controlsFadeTimeout);
    this.$element
      .css("--fade-length", `${this.getControlsFadeLength()}ms`)
      .removeClass("fade-out");

    this.controlsFadeTimeout = window.setTimeout(
      () => this.hideControls(),
      this.config.options.controlsFadeAfterInactive || 3000
    );
  }

  hideControls(): void {
    const el = this.$element[0];

    // hovered or keyboard-focused content keeps the controls visible
    if (el.matches(":hover") || el.querySelector(":focus-visible")) {
      this.showControls();
      return;
    }
    this.$element.addClass("fade-out");
  }

  getControlsFadeLength(): number {
    return (<ISettings>this.extension.getSettings()).reducedAnimation
      ? 0
      : this.config.options.controlsFadeLength || 250;
  }

  resize(): void {
    super.resize();

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    if (this.extension.helper.isRightToLeft()) {
      this.$title.addClass("rtl");
    } else {
      this.$title.removeClass("rtl");
    }
  }
}
