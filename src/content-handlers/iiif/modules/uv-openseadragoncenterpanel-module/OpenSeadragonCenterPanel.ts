const $ = require("jquery");
import { Async, Bools } from "../../Utils";
import {
  Canvas,
  IExternalResource,
  Annotation,
  AnnotationBody,
  Service,
} from "manifesto.js";
import { sanitize } from "../../../../Utils";
import { ViewingDirection } from "@iiif/vocabulary";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import OpenSeadragon from "openseadragon";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import "@openseadragon-imaging/openseadragon-viewerinputhook";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class OpenSeadragonCenterPanel extends CenterPanel<
  Config["modules"]["openSeadragonCenterPanel"]
> {
  autoHideControls: boolean = this.extension.isDesktopMetric();
  controlsVisible: boolean = false;
  handler: any;
  initialRotation: any;
  isCreated: boolean = false;
  isLoaded: boolean = false;
  isFirstLoad: boolean = true;
  items: any[];
  navigatedFromSearch: boolean = false;
  nextButtonEnabled: boolean = false;
  // pages: IExternalResource[];
  prevButtonEnabled: boolean = false;
  userData: any;
  showAdjustImageButton: boolean;

  $canvas: JQuery;
  $goHomeButton: JQuery;
  $navigator: JQuery;
  $nextButton: JQuery;
  $oneUpButton: JQuery;
  $prevButton: JQuery;
  $rotateButton: JQuery;
  $twoUpButton: JQuery;
  $viewportNavButtonsContainer: JQuery;
  $viewportNavButtons: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;
  $adjustImageButton: JQuery;
  $toggleContainer: JQuery;
  $galleryButton: JQuery;
  $pagingToggleButtons: JQuery;

  $controlsContainer: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  updateSettings(settings: ISettings): void {
    this.extension.updateSettings(settings);
    this.extensionHost.publish(IIIFEvents.UPDATE_SETTINGS, settings);
  }

  create(): void {
    this.setConfig("openSeadragonCenterPanel");

    super.create();

    this.$controlsContainer = $('<div class="controlsContainer"></div>');
    this.$content.prepend(this.$controlsContainer);

    this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
    this.$content.prepend(this.$pagingToggleButtons);
    this.$oneUpButton = $(`
      <button class="btn imageBtn one-up" title="${this.content.oneUp}">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <g>
            <rect x="10" y="8" width="10" height="14" />
          </g>
        </svg>
        <span class="sr-only">${this.content.oneUp}</span>
      </button>
    `);
    this.$twoUpButton = $(`
      <button class="btn imageBtn two-up" title="${this.content.twoUp}">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <g>
            <g>
              <rect x="4" y="8" width="10" height="14" />
            </g>
            <g>
              <rect x="16" y="8" width="10" height="14" />
            </g>
          </g>
        </svg>
        <span class="sr-only">${this.content.twoUp}</span>
      </button>
    `);
    this.$pagingToggleButtons.append(this.$oneUpButton, this.$twoUpButton);
    const hasPaging = (
      this.extension as OpenSeadragonExtension
    ).helper.isPagingAvailable();
    const isPagingEnabled =
      (this.extension as any).getSettings().pagingEnabled ?? false;
    if (hasPaging) {
      this.togglePagingButtons(isPagingEnabled);
    } else {
      this.$oneUpButton.remove();
      this.$twoUpButton.remove();
    }
    this.togglePagingButtons(isPagingEnabled);

    this.$oneUpButton.onPressed(() => {
      this.updateSettings({ pagingEnabled: false });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        false
      );
      this.togglePagingButtons(false);
    });

    this.$twoUpButton.onPressed(() => {
      this.updateSettings({ pagingEnabled: true });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        true
      );
      this.togglePagingButtons(true);
    });

    this.$galleryButton = $(`
      <button class="btn imageBtn gallery" title="${this.content.gallery}" style="display: none;">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14,14H8V8h6V14z M22,8h-6v6h6V8z M14,16H8v6h6V16z M22,16h-6v6h6V16z" />
        </svg>
        <span class="sr-only">${this.content.gallery}</span>
      </button>
    `);
    this.$pagingToggleButtons.append(this.$galleryButton);

    this.$galleryButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL);
    });
  }

  private togglePagingButtons(pagingEnabled: boolean): void {
    if (pagingEnabled) {
      this.$oneUpButton.show();
      this.$twoUpButton.hide();
    } else {
      this.$oneUpButton.hide();
      this.$twoUpButton.show();
    }

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        this.whenResized(async () => {
          if (!this.isCreated) {
            // uv may have reloaded
            this.createUI();
          }
          this.isLoaded = false;
          this.isLoaded = true;
          this.updateGalleryButton();
          this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
          this.extensionHost.publish(Events.LOAD);
        });
      }
    );

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      this.whenCreated(() => {
        this.updateResponsiveView();
      });
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN,
      () => {
        this.openPagesHandler();
      }
    );
  }

  updateGalleryButton(): void {
    if (!this.galleryIsVisible()) {
      this.$galleryButton.hide();
    } else {
      this.$galleryButton.show();
    }
  }

  galleryIsVisible(): boolean {
    return (
      Bools.getBool(this.options.galleryButtonEnabled, true) &&
      this.extension?.isLeftPanelEnabled?.()
    );
  }

  whenCreated(cb: () => void): void {
    Async.waitFor(() => {
      return this.isCreated;
    }, cb);
  }

  whenLoaded(cb: () => void): void {
    Async.waitFor(() => {
      return this.isLoaded;
    }, cb);
  }

  zoomIn(): void {
    this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_IN);
  }

  zoomOut(): void {
    this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_OUT);
  }

  rotateRight(): void {
    this.extensionHost.publish(OpenSeadragonExtensionEvents.ROTATE);
  }

  updateResponsiveView(): void {
    this.setNavigatorVisible();
    this.autoHideControls = this.extension.isDesktopMetric();

    const enableAutoHide = (event: JQuery.FocusOutEvent) => {
      this.autoHideControls = true;
    };

    const disableAutoHide = () => {
      this.autoHideControls = false;
    };

    const buttons = [
      this.$zoomInButton,
      this.$zoomOutButton,
      this.$goHomeButton,
      this.$rotateButton,
      this.$adjustImageButton,
    ];

    buttons.forEach((button) => {
      button.on("focus", disableAutoHide);
      button.on("focusout", enableAutoHide);
    });
  }

  async createUI(): Promise<void> {
    this.showAdjustImageButton = Bools.getBool(
      this.config.options.showAdjustImageControl,
      false
    );

    this.$zoomInButton = $("<button />");
    this.$controlsContainer.append(this.$zoomInButton);
    this.$zoomInButton.attr("tabindex", 0);
    this.$zoomInButton.attr("title", this.content.zoomIn);
    this.$zoomInButton.attr("aria-label", this.content.zoomIn);
    this.$zoomInButton.addClass("zoomIn viewportNavButton");
    this.$zoomInButton.html(`<svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <polygon points="22,14 16,14 16,8 14,8 14,14 8,14 8,16 14,16 14,22 16,22 16,16 22,16 " />
  </svg>`);

    this.onAccessibleClick(this.$zoomInButton, () => {
      this.zoomIn();
    });

    this.$zoomOutButton = $("<button />");
    this.$controlsContainer.append(this.$zoomOutButton);
    this.$zoomOutButton.attr("tabindex", 0);
    this.$zoomOutButton.attr("title", this.content.zoomOut);
    this.$zoomOutButton.attr("aria-label", this.content.zoomOut);
    this.$zoomOutButton.addClass("zoomOut viewportNavButton");
    this.$zoomOutButton.html(`<svg
  width="26"
  height="26"
  viewBox="0 0 26 26"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
>
  <rect x="8" y="14" width="14" height="2" />
</svg>
`);

    this.onAccessibleClick(this.$zoomOutButton, () => {
      this.zoomOut();
    });

    this.$goHomeButton = $("<button />");
    this.$controlsContainer.append(this.$goHomeButton);
    this.$goHomeButton.attr("tabindex", 0);
    this.$goHomeButton.attr("title", this.content.goHome);
    this.$goHomeButton.attr("aria-label", this.content.goHome);
    this.$goHomeButton.addClass("goHome viewportNavButton");

    this.onAccessibleClick(this.$goHomeButton, () => {
      this.goHome();
    });

    this.$rotateButton = $("<button />");
    this.$controlsContainer.append(this.$rotateButton);
    this.$rotateButton.attr("tabindex", 0);
    this.$rotateButton.attr("title", this.content.rotateRight);
    this.$rotateButton.attr("aria-label", this.content.rotateRight);
    this.$rotateButton.addClass("rotate viewportNavButton");
    this.$rotateButton.html(`<svg
    width="30"
    height="30"
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
      this.rotateRight();
    });

    if (this.showAdjustImageButton) {
      this.$adjustImageButton = $("<button />");
      this.$controlsContainer.append(this.$adjustImageButton);
      this.$adjustImageButton.attr("title", this.content.adjustImage);
      this.$adjustImageButton.attr("aria-label", this.content.adjustImage);
      this.$adjustImageButton.switchClass("rotate", "adjustImage");
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

    this.$zoomInButton
      .add(this.$zoomOutButton)
      .add(this.$goHomeButton)
      .add(this.$rotateButton)
      .add(this.$adjustImageButton)
      .on("focus", () => {
        if (this.controlsVisible) return;
        this.controlsVisible = true;
      });

    this.$zoomInButton.add(this.$adjustImageButton).on("blur", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
    });

    this.setNavigatorVisible();

    // events

    this.$element.on("mousemove", () => {
      if (this.controlsVisible) return;
      this.controlsVisible = true;
    });

    this.$element.on("mouseleave", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
    });

    // when mouse move stopped
    this.$element.on(
      //@ts-ignore
      "mousemove",
      () => {
        // if over element, hide controls.
        // When over prev/next buttons keep controls enabled
        if (this.$prevButton.ismouseover()) {
          return;
        }
        if (this.$nextButton.ismouseover()) {
          return;
        }
        if (
          !this.$nextButton.ismouseover() &&
          !this.$prevButton.ismouseover()
        ) {
          if (!this.controlsVisible) return;
          this.controlsVisible = false;
        }
      },
      this.config.options.controlsFadeAfterInactive
    );

    const fadeDelay = 1500;

    let fadeButtonsTimeout: number | undefined;

    const showPagingButtons = () => {
      this.$pagingToggleButtons.removeClass("fade-out");
      this.$galleryButton.removeClass("fade-out");
    };

    const hidePagingButtons = () => {
      this.$pagingToggleButtons.addClass("fade-out");
      this.$galleryButton.addClass("fade-out");
    };

    const resetPagingFadeTimer = () => {
      clearTimeout(fadeButtonsTimeout);
      showPagingButtons();

      fadeButtonsTimeout = window.setTimeout(() => {
        hidePagingButtons();
      }, fadeDelay);
    };

    this.$element.on("mousemove", () => {
      resetPagingFadeTimer();
    });

    this.$pagingToggleButtons.on("mouseenter", () => {
      showPagingButtons();
      clearTimeout(fadeButtonsTimeout);
    });
    this.$galleryButton.on("mouseenter", () => {
      showPagingButtons();
      clearTimeout(fadeButtonsTimeout);
    });

    this.$pagingToggleButtons.on("mouseleave", () => {
      resetPagingFadeTimer();
    });
    this.$galleryButton.on("mouseleave", () => {
      resetPagingFadeTimer();
    });

    showPagingButtons();
    resetPagingFadeTimer();

    this.title = this.extension.helper.getLabel();

    this.createNavigationButtons();
    // this.hidePrevButton();
    // this.hideNextButton();

    this.isCreated = true;
    //this.resize();
  }

  createNavigationButtons() {
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

    this.$content.prepend(this.$nextButton);
    this.$content.prepend(this.$prevButton);

    switch (viewingDirection) {
      case ViewingDirection.BOTTOM_TO_TOP:
      case ViewingDirection.TOP_TO_BOTTOM:
        this.$prevButton.addClass("vertical");
        this.$nextButton.addClass("vertical");
        break;
    }

    const that = this;

    this.onAccessibleClick(this.$prevButton, (e: any) => {
      e.preventDefault();
      OpenSeadragon.cancelEvent(e);

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
      OpenSeadragon.cancelEvent(e);

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

    // When Prev/Next buttons are focused, make sure the controls are enabled
    this.$prevButton.add(this.$nextButton).on("focus", () => {
      if (this.controlsVisible) return;
      this.controlsVisible = true;
    });

    this.$prevButton.add(this.$nextButton).on("blur", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
    });
  }

  async getGirderTileSource(): Promise<any> {
    return new Promise<any>((resolve) => {
      const canvas: Canvas = this.extension.helper.getCurrentCanvas();
      const annotations: Annotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Annotation = annotations[0];
        const body: AnnotationBody[] = annotation.getBody();

        if (body.length) {
          const services: Service[] = body[0].getServices();

          if (services.length) {
            let id: string = services[0].id;
            let tileDescriptor = id;
            if (!tileDescriptor.endsWith("/")) {
              tileDescriptor += "/";
            }
            tileDescriptor += "tiles";

            if (id.endsWith("/")) {
              id = id.substr(0, id.length - 1);
            }
            fetch(tileDescriptor)
              .then((response) => response.json())
              .then((info) => {
                const tileSource = {
                  height: info.sizeY,
                  width: info.sizeX,
                  tileWidth: info.tileWidth,
                  tileHeight: info.tileHeight,
                  minLevel: 0,
                  maxLevel: info.levels - 1,
                  units: "mm",
                  spacing: [info.mm_x, info.mm_y],
                  getTileUrl: function (level, x, y, query) {
                    var url =
                      tileDescriptor + "/zxy/" + level + "/" + x + "/" + y;
                    if (query) {
                      url += "?" + $.param(query);
                    }
                    return url;
                  },
                };

                if (!info.mm_x) {
                  tileSource.units = "pixels";
                  tileSource.spacing = [1, 1];
                }

                resolve(tileSource);
              });
          }
        }
      }
    });
  }

  openPagesHandler(): void {
    if (
      this.extension.helper.isMultiCanvas() &&
      !this.extension.helper.isContinuous()
    ) {
      this.showPrevButton();
      this.showNextButton();

      $(".navigator").addClass("extraMargin");

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
    }

    this.setNavigatorVisible();

    this.isFirstLoad = false;
  }

  goHome(): void {
    this.extensionHost.publish(OpenSeadragonExtensionEvents.GO_HOME);
  }

  disablePrevButton(): void {
    this.prevButtonEnabled = false;
    this.$prevButton.addClass("disabled");
  }

  enablePrevButton(): void {
    this.prevButtonEnabled = true;
    this.$prevButton.removeClass("disabled");
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
  }

  enableNextButton(): void {
    this.nextButtonEnabled = true;
    this.$nextButton.removeClass("disabled");
  }

  hideNextButton(): void {
    this.disableNextButton();
    this.$nextButton.hide();
  }

  showNextButton(): void {
    this.enableNextButton();
    this.$nextButton.show();
  }

  resize(): void {
    super.resize();

    // this.$viewer.height(
    //   this.$content.height() - this.$viewer.verticalMargins()
    // );
    // this.$viewer.width(
    //   this.$content.width() - this.$viewer.horizontalMargins()
    // );

    if (!this.isCreated) return;

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    const viewingDirection: ViewingDirection =
      this.extension.helper.getViewingDirection() ||
      ViewingDirection.LEFT_TO_RIGHT;

    if (this.extension.helper.isRightToLeft()) {
      this.$title.addClass("rtl");
    } else {
      this.$title.removeClass("rtl");
    }

    if (
      this.extension.helper.isMultiCanvas() &&
      this.$prevButton &&
      this.$nextButton
    ) {
      const verticalButtonPos: number = Math.floor(this.$content.width() / 2);

      switch (viewingDirection) {
        case ViewingDirection.BOTTOM_TO_TOP:
          this.$prevButton.addClass("down");
          this.$nextButton.addClass("up");
          this.$prevButton.css(
            "left",
            verticalButtonPos - this.$prevButton.outerWidth() / 2
          );
          this.$prevButton.css(
            "top",
            this.$content.height() - this.$prevButton.height()
          );
          this.$nextButton.css(
            "left",
            verticalButtonPos * -1 - this.$nextButton.outerWidth() / 2
          );
          break;
        case ViewingDirection.TOP_TO_BOTTOM:
          this.$prevButton.css(
            "left",
            verticalButtonPos - this.$prevButton.outerWidth() / 2
          );
          this.$nextButton.css(
            "left",
            verticalButtonPos * -1 - this.$nextButton.outerWidth() / 2
          );
          this.$nextButton.css(
            "top",
            this.$content.height() - this.$nextButton.height()
          );
          break;
        default:
          this.$prevButton.css(
            "top",
            (this.$content.height() - this.$prevButton.height()) / 2
          );
          this.$nextButton.css(
            "top",
            (this.$content.height() - this.$nextButton.height()) / 2
          );
          break;
      }
    }
  }

  setFocus(): void {
    if (this.$canvas && !this.$canvas.is(":focus")) {
      if (this.extension.data.config!.options.allowStealFocus) {
        this.$canvas.focus();
      }
    }
  }

  setNavigatorVisible(): void {
    // TODO: sort this out with a pubsub thing when components are split

    // const navigatorEnabled: boolean =
    //   Bools.getBool(this.extension.getSettings().navigatorEnabled, true) &&
    //   this.extension.isDesktopMetric();

    // if (this.viewer && this.viewer.navigator) {
    //   this.viewer.navigator.setVisible(navigatorEnabled);

    //   if (navigatorEnabled) {
    //     this.$navigator.show();
    //   } else {
    //     this.$navigator.hide();
    //   }
    // }

    console.log("set navigator visible");
  }

  getControlsFadeLength(): number {
    return (<ISettings>this.extension.getSettings()).reducedAnimation
      ? 0
      : this.config.options.controlsFadeLength || 250;
  }
}
