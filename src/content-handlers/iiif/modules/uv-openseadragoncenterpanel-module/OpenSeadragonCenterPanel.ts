const $ = require("jquery");
import { Bools } from "../../Utils";
import { sanitize } from "../../../../Utils";
import { ViewingDirection } from "@iiif/vocabulary";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";
// import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension"

export class OpenSeadragonCenterPanel extends CenterPanel<
  Config["modules"]["openSeadragonCenterPanel"]
> {
  autoHideControls: boolean;
  controlsFadeTimeout: number;
  controlsVisible: boolean = false;
  isCreated: boolean = false;
  nextButtonEnabled: boolean = false;
  prevButtonEnabled: boolean = false;
  showAdjustImageButton: boolean;
  showHomeButton: boolean;

  $goHomeButton: JQuery;
  $nextButton: JQuery;
  $prevButton: JQuery;
  $rotateButton: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;
  $adjustImageButton: JQuery;
  $choiceSwitchButton: JQuery;

  $navigator: JQuery;
  $imageControlsContainer: JQuery;

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

    this.$zoomInButton = $("<button />");
    this.$imageControlsContainer.append(this.$zoomInButton);
    this.$zoomInButton.attr("tabindex", 0);
    this.$zoomInButton.attr("title", this.content.zoomIn);
    this.$zoomInButton.attr("aria-label", this.content.zoomIn);
    this.$zoomInButton.addClass("zoomIn imageControlButton viewportNavButton");
    this.$zoomInButton.html(`  <svg
    width=30
    height=30
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  >
    <polygon points="22,14 16,14 16,8 14,8 14,14 8,14 8,16 14,16 14,22 16,22 16,16 22,16 " />
  </svg>`);
    this.onAccessibleClick(this.$zoomInButton, () => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_IN);
    });

    this.$zoomOutButton = $("<button />");
    this.$imageControlsContainer.append(this.$zoomOutButton);
    this.$zoomOutButton.attr("tabindex", 0);
    this.$zoomOutButton.attr("title", this.content.zoomOut);
    this.$zoomOutButton.attr("aria-label", this.content.zoomOut);
    this.$zoomOutButton.addClass(
      "zoomOut imageControlButton viewportNavButton"
    );
    this.$zoomOutButton.html(`<svg
    width=30
    height=30
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  >
    <rect x="8" y="14" width="14" height="2" />
</svg>
`);
    this.onAccessibleClick(this.$zoomOutButton, () => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_OUT);
    });

    if (this.showHomeButton) {
      this.$goHomeButton = $("<button />");
      this.$imageControlsContainer.append(this.$goHomeButton);
      this.$goHomeButton.attr("tabindex", 0);
      this.$goHomeButton.attr("title", this.content.goHome);
      this.$goHomeButton.attr("aria-label", this.content.goHome);
      this.$goHomeButton.addClass(
        "goHome imageControlButton viewportNavButton"
      );
      this.onAccessibleClick(this.$goHomeButton, () => {
        this.extensionHost.publish(OpenSeadragonExtensionEvents.GO_HOME);
      });
      // todo: add goHome SVG and remove icon as background image from styles.less
    }

    this.$rotateButton = $("<button />");
    this.$imageControlsContainer.append(this.$rotateButton);
    this.$rotateButton.attr("tabindex", 0);
    this.$rotateButton.attr("title", this.content.rotateRight);
    this.$rotateButton.attr("aria-label", this.content.rotateRight);
    this.$rotateButton.addClass("rotate imageControlButton viewportNavButton");
    this.$rotateButton.html(`<svg
    width=30
    height=30
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  >
    <g>
      <path
        d="M15,22.5c-2.1,0-3.9-0.7-5.3-2.2S7.5,17.1,7.5,15s0.7-3.9,2.2-5.3s3.2-2.2,5.3-2.2
		c1.1,0,2.1,0.2,3.1,0.7s1.8,1.1,2.5,1.9V7.5h1.9v6.6h-6.6v-1.9h3.9c-0.5-0.9-1.2-1.6-2.1-2.1C17,9.6,16,9.4,15,9.4
		c-1.6,0-2.9,0.5-4,1.6s-1.6,2.4-1.6,4s0.5,2.9,1.6,4s2.4,1.6,4,1.6c1.2,0,2.3-0.3,3.3-1s1.6-1.6,2-2.7h2c-0.4,1.7-1.3,3-2.7,4.1
		S16.7,22.5,15,22.5z"
      />
    </g>
  </svg>`);

    this.onAccessibleClick(this.$rotateButton, () => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ROTATE);
    });

    if (this.showAdjustImageButton) {
      this.$adjustImageButton = $("<button />");
      this.$imageControlsContainer.append(this.$adjustImageButton);
      this.$adjustImageButton.attr("title", this.content.adjustImage);
      this.$adjustImageButton.attr("aria-label", this.content.adjustImage);
      this.$adjustImageButton.addClass(
        "adjustImage imageControlButton viewportNavButton"
      );
      this.$adjustImageButton.attr("tabindex", 0);
      this.$adjustImageButton.onPressed(() => {
        this.extensionHost.publish(IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE);
      });
      this.$adjustImageButton.html(`  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <g>
      <path
        d="M15,22.5c-1,0-2-0.2-2.9-0.6c-0.9-0.4-1.7-0.9-2.4-1.6c-0.7-0.7-1.2-1.5-1.6-2.4
		C7.7,17,7.5,16,7.5,15s0.2-2,0.6-2.9S9,10.4,9.7,9.7c0.7-0.7,1.5-1.2,2.4-1.6C13,7.7,14,7.5,15,7.5s2,0.2,2.9,0.6s1.7,0.9,2.4,1.6
		c0.7,0.7,1.2,1.5,1.6,2.4c0.4,0.9,0.6,1.9,0.6,2.9s-0.2,2-0.6,2.9c-0.4,0.9-0.9,1.7-1.6,2.4c-0.7,0.7-1.5,1.2-2.4,1.6
		C17,22.3,16,22.5,15,22.5z M15.8,20.9c1.5-0.2,2.7-0.8,3.7-2s1.5-2.4,1.5-4s-0.5-2.9-1.5-4s-2.3-1.8-3.7-2V20.9z"
      />
    </g>
  </svg>`);
      this.onAccessibleClick(this.$adjustImageButton, () => {
        this.extensionHost.publish(IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE);
      });
    }

    this.createChoiceSwitch();
  }

  createChoiceSwitch(): void {
    this.$choiceSwitchButton = this.$rotateButton.clone();
    this.$choiceSwitchButton.attr("aria-label", this.content.layers);
    this.$choiceSwitchButton.attr("title", this.content.layers);
    this.$choiceSwitchButton.switchClass("rotate", "choiceSwitch");
    this.$choiceSwitchButton.attr("tabindex", 0);
    this.$choiceSwitchButton.css("visibility", "hidden");
    // this svg is a hacky transformation of the google icons svg - will need to make a proper one when we add the svg icon library
    this.$choiceSwitchButton.html(
      `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
    viewBox="0 0 30 30" fill="currentColor">
    <g transform="translate(15 15) scale(0.0185) translate(-480 480)">
      <path d="M480-118 120-398l66-50 294 228 294-228 66 50-360 280Zm0-202L120-600l360-280 360 280-360 280Zm0-280Zm0 178 230-178-230-178-230 178 230 178Z"/>
    </g>
  </svg>`
    );

    if (this.showAdjustImageButton && this.$adjustImageButton) {
      this.$choiceSwitchButton.insertAfter(this.$adjustImageButton);
    } else {
      this.$choiceSwitchButton.insertAfter(this.$rotateButton);
    }
    this.onAccessibleClick(this.$choiceSwitchButton, () => {
      this.extensionHost.publish(IIIFEvents.SHOW_CHOICE_SWITCH_DIALOGUE);
    });
  }

  indicesIncludeChoices(indices: number[]): boolean {
    return indices.some((index) => {
      const canvas = this.extension.helper.getCanvasByIndex(index);
      return canvas.getChoices().length > 0;
    });
  }

  updateChoiceSwitchVisibility(): void {
    if (!this.$choiceSwitchButton) return;

    const indices = this.extension.getPagedIndices();
    const hasChoices = this.indicesIncludeChoices(indices);

    this.$choiceSwitchButton.css(
      "visibility",
      hasChoices ? "visible" : "hidden"
    );
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
    this.autoHideControls = Bools.getBool(this.config.options.autoHideControls, true);
    if (!this.autoHideControls) return;

    // select the element to detect interaction activity on
    const $activeArea = this.$element.parent();

    // pointer events also cover touch; focusin covers keyboard
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
      this.config.options.controlsFadeAfterInactive
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
