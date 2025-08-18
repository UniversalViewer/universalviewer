const $ = require("jquery");
import { AnnotationGroup, AnnotationRect } from "@iiif/manifold";
import { Async, Bools, Dimensions } from "../../Utils";
import {
  Canvas,
  IExternalResource,
  IExternalImageResourceData,
  IExternalResourceData,
  Annotation,
  AnnotationBody,
  Service,
} from "manifesto.js";
import { debounce, sanitize } from "../../../../Utils";
import { ViewingDirection } from "@iiif/vocabulary";
import { IIIFEvents } from "../../IIIFEvents";
import { XYWHFragment } from "../uv-shared-module/XYWHFragment";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { CroppedImageDimensions } from "../../extensions/uv-openseadragon-extension/CroppedImageDimensions";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IOpenSeadragonExtensionData } from "../../extensions/uv-openseadragon-extension/IOpenSeadragonExtensionData";
import OpenSeadragon from "openseadragon";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import "@openseadragon-imaging/openseadragon-viewerinputhook";
import { MediaType } from "@iiif/vocabulary/dist-commonjs";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class OpenSeadragonCenterPanel extends CenterPanel<
  Config["modules"]["openSeadragonCenterPanel"]
> {
  controlsVisible: boolean = false;
  currentAnnotationRect: AnnotationRect;
  currentBounds: XYWHFragment | null;
  handler: any;
  initialBounds: XYWHFragment | null;
  initialRotation: any;
  isCreated: boolean = false;
  isLoaded: boolean = false;
  isFirstLoad: boolean = true;
  items: any[];
  navigatedFromSearch: boolean = false;
  nextButtonEnabled: boolean = false;
  // pages: IExternalResource[];
  prevButtonEnabled: boolean = false;
  previousAnnotationRect: AnnotationRect;
  userData: any;
  viewer: any;
  viewerId: string;
  showAdjustImageButton: boolean;

  $canvas: JQuery;
  $goHomeButton: JQuery;
  $navigator: JQuery;
  $nextButton: JQuery;
  $prevButton: JQuery;
  $rotateButton: JQuery;
  $spinner: JQuery;
  $viewer: JQuery;
  $viewportNavButtonsContainer: JQuery;
  $viewportNavButtons: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;
  $adjustImageButton: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("openSeadragonCenterPanel");

    super.create();

    this.viewerId = "osd" + new Date().getTime();
    this.$viewer = $('<div id="' + this.viewerId + '" class="viewer"></div>');
    this.$content.prepend(this.$viewer);

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS, (args: any) => {
      this.overlayAnnotations();
    });

    this.extensionHost.subscribe(
      IIIFEvents.SETTINGS_CHANGE,
      (args: ISettings) => {
        this.viewer.gestureSettingsMouse.clickToZoom = args.clickToZoomEnabled;
        this.viewer.controlsFadeLength = this.getControlsFadeLength();
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        this.whenResized(async () => {
          if (!this.isCreated) {
            // uv may have reloaded
            this.createUI();
          }
          this.isLoaded = false;
          await this.openMedia(resources);
          this.isLoaded = true;
          this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
          this.extensionHost.publish(Events.LOAD);
        });
      }
    );

    this.extensionHost.subscribe(IIIFEvents.CLEAR_ANNOTATIONS, () => {
      this.whenCreated(() => {
        (this.extension as OpenSeadragonExtension).currentAnnotationRect = null;
        this.clearAnnotations();
      });
    });

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT,
      () => {
        this.whenCreated(() => {
          this.nextAnnotation();
        });
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT,
      () => {
        this.whenCreated(() => {
          this.prevAnnotation();
        });
      }
    );

    this.extensionHost.subscribe(OpenSeadragonExtensionEvents.ZOOM_IN, () => {
      this.whenCreated(() => {
        this.zoomIn();
      });
    });

    this.extensionHost.subscribe(OpenSeadragonExtensionEvents.ZOOM_OUT, () => {
      this.whenCreated(() => {
        this.zoomOut();
      });
    });

    this.extensionHost.subscribe(OpenSeadragonExtensionEvents.ROTATE, () => {
      this.whenCreated(() => {
        this.rotateRight();
      });
    });

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      this.whenCreated(() => {
        this.updateResponsiveView();
      });
    });

    this.extensionHost.subscribe(
      IIIFEvents.SET_TARGET,
      (target: XYWHFragment) => {
        this.whenLoaded(() => {
          this.fitToBounds(target, false);
        });
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.SET_ROTATION,
      (rotation: number) => {
        this.whenLoaded(() => {
          this.viewer.viewport.setRotation(rotation);
        });
      }
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
    this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 2);
  }

  zoomOut(): void {
    this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 0.5);
  }

  rotateRight(): void {
    this.viewer.viewport.setRotation(this.viewer.viewport.getRotation() + 90);
  }

  updateResponsiveView(): void {
    this.setNavigatorVisible();
    this.viewer.autoHideControls = this.extension.isDesktopMetric();

    const enableAutoHide = (event: JQuery.FocusOutEvent) => {
      this.viewer.autoHideControls = true;
    };

    const disableAutoHide = () => {
      this.viewer.autoHideControls = false;
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
    this.$spinner = $('<div class="spinner"></div>');
    this.$content.append(this.$spinner);

    this.showAdjustImageButton = Bools.getBool(
      this.config.options.showAdjustImageControl,
      false
    );

    // Transparent pixel
    const pixel =
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

    this.viewer = OpenSeadragon({
      // id: this.viewerId,
      element: this.$viewer[0],
      // crossOriginPolicy: "Anonymous",
      showNavigationControl: true,
      showNavigator: true,
      showRotationControl: true,
      showHomeControl: Bools.getBool(
        this.config.options.showHomeControl,
        false
      ),
      showFullPageControl: false,
      defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
      maxZoomPixelRatio: this.config.options.maxZoomPixelRatio || 2,
      controlsFadeDelay: this.config.options.controlsFadeDelay || 250,
      controlsFadeLength: this.getControlsFadeLength(),
      navigatorPosition:
        this.config.options.navigatorPosition || "BOTTOM_RIGHT",
      navigatorHeight: "100px",
      navigatorWidth: "100px",
      animationTime: this.config.options.animationTime || 1.2,
      visibilityRatio: this.config.options.visibilityRatio || 0.5,
      constrainDuringPan: Bools.getBool(
        this.config.options.constrainDuringPan,
        false
      ),
      immediateRender: Bools.getBool(
        this.config.options.immediateRender,
        false
      ),
      blendTime: this.config.options.blendTime || 0,
      autoHideControls: Bools.getBool(
        this.config.options.autoHideControls,
        true
      ),
      prefixUrl: null,
      gestureSettingsMouse: {
        clickToZoom: Bools.getBool(
          this.extension.data.config!.options.clickToZoomEnabled,
          true
        ),
      },
      navImages: {
        zoomIn: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        zoomOut: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        home: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        rotateright: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        rotateleft: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        next: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
        previous: {
          REST: pixel,
          GROUP: pixel,
          HOVER: pixel,
          DOWN: pixel,
        },
      },
      // The max number of milliseconds that an image job may take to complete.
      timeout: this.config.options.tileTimeout || 30_000,
    });

    const that = this;

    const debouncedDoubleClick = debounce((e: any) => {
      const canvas: Canvas = that.extension.helper.getCurrentCanvas();
      var viewportPoint = that.viewer.viewport.pointFromPixel(e.position);
      var imagePoint = that.viewer.viewport.viewportToImageCoordinates(
        viewportPoint.x,
        viewportPoint.y
      );
      this.extensionHost.publish(OpenSeadragonExtensionEvents.DOUBLECLICK, {
        target: `${canvas.id}#xywh=${Math.round(imagePoint.x)},${Math.round(
          imagePoint.y
        )},1,1`,
      });
    }, 100);

    this.viewer.addViewerInputHook({
      hooks: [
        {
          tracker: "viewer",
          handler: "dblClickHandler",
          hookHandler: (e) => {
            const settings: ISettings = this.extension.getSettings();
            const pagingAvailable: boolean =
              this.extension.helper.isPagingAvailable();
            if (
              (pagingAvailable && !settings.pagingEnabled) ||
              !pagingAvailable
            ) {
              if (this.config.options.doubleClickAnnotationEnabled) {
                debouncedDoubleClick(e);
              }
            }
          },
        },
      ],
    });

    const $oldZoomIn = this.$viewer.find('div[title="Zoom in"]');
    this.$zoomInButton = $("<button />").append($oldZoomIn.contents());
    this.$zoomInButton.insertAfter($oldZoomIn);
    $oldZoomIn.remove();
    this.$zoomInButton.attr("tabindex", 0);
    this.$zoomInButton.attr("title", this.content.zoomIn);
    this.$zoomInButton.attr("aria-label", this.content.zoomIn);
    this.$zoomInButton.addClass("zoomIn viewportNavButton");

    this.onAccessibleClick(this.$zoomInButton, () => {
      this.zoomIn();
    });

    const $oldZoomOut = this.$viewer.find('div[title="Zoom out"]');
    this.$zoomOutButton = $("<button />").append($oldZoomOut.contents());
    this.$zoomOutButton.insertAfter($oldZoomOut);
    $oldZoomIn.remove();
    this.$zoomOutButton.attr("tabindex", 0);
    this.$zoomOutButton.attr("title", this.content.zoomOut);
    this.$zoomOutButton.attr("aria-label", this.content.zoomOut);
    this.$zoomOutButton.addClass("zoomOut viewportNavButton");

    this.onAccessibleClick(this.$zoomOutButton, () => {
      this.zoomOut();
    });

    const $oldGoHome = this.$viewer.find('div[title="Go home"]');
    this.$goHomeButton = $("<button />").append($oldGoHome.contents());
    this.$goHomeButton.insertAfter($oldGoHome);
    $oldGoHome.remove();
    this.$goHomeButton.attr("tabindex", 0);
    this.$goHomeButton.attr("title", this.content.goHome);
    this.$goHomeButton.attr("aria-label", this.content.goHome);
    this.$goHomeButton.addClass("goHome viewportNavButton");

    this.onAccessibleClick(this.$goHomeButton, () => {
      this.goHome();
    });

    const $oldRotate = this.$viewer.find('div[title="Rotate right"]');
    this.$rotateButton = $("<button />").append($oldRotate.contents());
    this.$rotateButton.insertAfter($oldRotate);
    $oldRotate.remove();
    this.$rotateButton.attr("tabindex", 0);
    this.$rotateButton.attr("title", this.content.rotateRight);
    this.$rotateButton.attr("aria-label", this.content.rotateRight);
    this.$rotateButton.addClass("rotate viewportNavButton");

    this.onAccessibleClick(this.$rotateButton, () => {
      this.rotateRight();
    });

    if (this.showAdjustImageButton) {
      this.$adjustImageButton = this.$rotateButton.clone();
      this.$adjustImageButton.attr("title", this.content.adjustImage);
      this.$adjustImageButton.attr("aria-label", this.content.adjustImage);
      this.$adjustImageButton.switchClass("rotate", "adjustImage");
      this.$adjustImageButton.attr("tabindex", 0);
      this.$adjustImageButton.onPressed(() => {
        this.extensionHost.publish(IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE);
      });
      this.$adjustImageButton.insertAfter(this.$rotateButton);

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
        this.viewer.setControlsEnabled(true);
      });

    this.$zoomInButton.add(this.$adjustImageButton).on("blur", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
      this.viewer.setControlsEnabled(false);
    });

    this.$viewportNavButtonsContainer = this.$viewer.find(
      ".openseadragon-container > div:not(.openseadragon-canvas):first"
    );

    //this.$viewportNavButtonsContainer.addClass("viewportControls");

    this.$viewportNavButtons =
      this.$viewportNavButtonsContainer.find(".viewportNavButton");

    this.$canvas = $(this.viewer.canvas);

    // Check if we have saved settings for image adjustment
    const settings = this.extension.getSettings();
    if (
      this.extension.data.config?.options.saveUserSettings &&
      settings.rememberSettings
    ) {
      const contrastPercent = settings.contrastPercent;
      const brightnessPercent = settings.brightnessPercent;
      const saturationPercent = settings.saturationPercent;
      (<HTMLCanvasElement>this.$canvas[0].children[0]).style.filter =
        `contrast(${contrastPercent}%) brightness(${brightnessPercent}%) saturate(${saturationPercent}%)`;
    }

    // disable right click on canvas
    this.$canvas.on("contextmenu", () => {
      return false;
    });

    this.$navigator = this.$viewer.find(".navigator");
    this.setNavigatorVisible();

    // events

    this.$element.on("mousemove", () => {
      if (this.controlsVisible) return;
      this.controlsVisible = true;
      this.viewer.setControlsEnabled(true);
    });

    this.$element.on("mouseleave", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
      this.viewer.setControlsEnabled(false);
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
        if (!this.$viewer.find(".navigator").ismouseover()) {
          if (!this.controlsVisible) return;
          this.controlsVisible = false;
          this.viewer.setControlsEnabled(false);
        }
      },
      this.config.options.controlsFadeAfterInactive
    );

    this.viewer.addHandler("tile-drawn", () => {
      this.$spinner.hide();
    });

    //this.viewer.addHandler("open-failed", () => {
    //});

    this.viewer.addHandler("resize", (viewer: any) => {
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.OPENSEADRAGON_RESIZE,
        viewer
      );
      this.viewerResize(viewer);
    });

    this.viewer.addHandler("animation-start", (viewer: any) => {
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_START,
        viewer
      );
    });

    this.viewer.addHandler("animation", (viewer: any) => {
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION,
        viewer
      );
    });

    this.viewer.addHandler("animation-finish", (viewer: any) => {
      this.currentBounds = this.getViewportBounds();

      this.updateVisibleAnnotationRects();

      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_FINISH,
        viewer
      );
    });

    this.viewer.addHandler("rotate", (args: any) => {
      // console.log("rotate");
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION,
        args.degrees
      );
    });

    this.title = this.extension.helper.getLabel();

    this.createNavigationButtons();
    this.hidePrevButton();
    this.hideNextButton();

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

    this.viewer.addControl(this.$prevButton[0], {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    });
    this.viewer.addControl(this.$nextButton[0], {
      anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
    });

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
      this.viewer.setControlsEnabled(true);
    });

    this.$prevButton.add(this.$nextButton).on("blur", () => {
      if (!this.controlsVisible) return;
      this.controlsVisible = false;
      this.viewer.setControlsEnabled(false);
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

  async openMedia(resources?: IExternalResource[]): Promise<void> {
    // uv may have been unloaded
    if (!this.viewer) {
      return;
    }

    this.$spinner.show();
    this.items = [];

    let images: IExternalResourceData[] =
      await this.extension.getExternalResources(resources);

    const isGirder: boolean = this.extension.format === MediaType.GIRDER;

    try {
      this.viewer.close();

      images = this.getPagePositions(images);

      for (let i = 0; i < images.length; i++) {
        const data: any = images[i];

        let tileSource: any;

        if (data.hasServiceDescriptor) {
          // use the info.json descriptor
          tileSource = data;
        } else if (isGirder) {
          // load girder image
          tileSource = await this.getGirderTileSource();
        } else {
          // load image without tiling
          tileSource = {
            type: "image",
            url: data.id,
            buildPyramid: false,
          };
        }

        this.viewer.addTiledImage({
          tileSource: tileSource,
          x: data.x,
          y: data.y,
          width: data.width,
          success: (item: any) => {
            this.items.push(item);
            if (this.items.length === images.length) {
              this.openPagesHandler();
            }
            this.resize();
            this.goHome();
          },
        });
      }
    } catch {
      // do nothing
    }
  }

  getPagePositions(
    resources: IExternalResourceData[]
  ): IExternalResourceData[] {
    let leftPage: any;
    let rightPage: any;
    let topPage: any;
    let bottomPage: any;
    let page: any;
    let nextPage: any;

    // if there's more than one image, determine alignment strategy
    if (resources.length > 1) {
      if (resources.length === 2) {
        // recto verso
        if (this.extension.helper.isVerticallyAligned()) {
          // vertical alignment
          topPage = resources[0];
          topPage.y = 0;
          bottomPage = resources[1];
          bottomPage.y = topPage.height + this.config.options.pageGap;
        } else {
          // horizontal alignment
          leftPage = resources[0];
          leftPage.x = 0;
          rightPage = resources[1];
          rightPage.x = leftPage.width + this.config.options.pageGap;
        }
      } else {
        // scroll
        if (this.extension.helper.isVerticallyAligned()) {
          // vertical alignment
          if (this.extension.helper.isTopToBottom()) {
            // top to bottom
            for (let i = 0; i < resources.length - 1; i++) {
              page = resources[i];
              nextPage = resources[i + 1];
              nextPage.y = (page.y || 0) + page.height;
            }
          } else {
            // bottom to top
            for (let i = resources.length; i > 0; i--) {
              page = resources[i];
              nextPage = resources[i - 1];
              nextPage.y = (page.y || 0) - page.height;
            }
          }
        } else {
          // horizontal alignment
          if (this.extension.helper.isLeftToRight()) {
            // left to right
            for (let i = 0; i < resources.length - 1; i++) {
              page = resources[i];
              nextPage = resources[i + 1];
              nextPage.x = (page.x || 0) + page.width;
            }
          } else {
            // right to left
            for (let i = resources.length - 1; i > 0; i--) {
              page = resources[i];
              nextPage = resources[i - 1];
              nextPage.x = (page.x || 0) - page.width;
            }
          }
        }
      }
    }

    return resources;
  }

  openPagesHandler(): void {
    this.extensionHost.publish(OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN);

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

    this.overlayAnnotations();

    this.updateBounds();

    // this only happens if prev/next search result were clicked and caused a reload
    if (this.navigatedFromSearch) {
      this.navigatedFromSearch = false;
      this.zoomToInitialAnnotation();
    }

    this.isFirstLoad = false;
  }

  zoomToInitialAnnotation(): void {
    const annotationRect: AnnotationRect | null =
      this.getInitialAnnotationRect();

    (this.extension as OpenSeadragonExtension).previousAnnotationRect = null;
    (this.extension as OpenSeadragonExtension).currentAnnotationRect = null;

    if (annotationRect && this.isZoomToSearchResultEnabled()) {
      this.zoomToAnnotation(annotationRect);
    }
  }

  overlayAnnotations(): void {
    const annotations: AnnotationGroup[] =
      this.getAnnotationsForCurrentImages();

    // clear existing annotations
    this.clearAnnotations();

    for (let i = 0; i < annotations.length; i++) {
      const annotation: AnnotationGroup = annotations[i];
      const rects: any[] = this.getAnnotationOverlayRects(annotation);

      for (let k = 0; k < rects.length; k++) {
        const rect = rects[k];

        const div: HTMLElement = document.createElement("DIV");
        div.id = "annotation-" + rect.canvasIndex + "-" + rect.resultIndex;

        div.title = sanitize(rect.chars);

        // if it's a pin
        if (rect.width === 1 && rect.height === 1) {
          div.className = "annotationPin";
          div.onclick = (e: any) => {
            e.preventDefault();
            this.extensionHost.publish(
              IIIFEvents.PINPOINT_ANNOTATION_CLICKED,
              k
            );
          };
          const span: HTMLSpanElement = document.createElement("SPAN");
          span.innerText = String(k + 1);
          div.appendChild(span);
        } else {
          // it's a rect
          div.className = "annotationRect";
        }

        this.viewer.addOverlay(div, rect);
      }
    }

    if (annotations.length && this.shouldZoomToInitialAnnotation()) {
      this.zoomToInitialAnnotation();
    }
  }

  updateBounds(): void {
    const settings: ISettings = this.extension.getSettings();

    // if this is the first load and there are initial bounds, fit to those.
    if (this.isFirstLoad) {
      this.initialRotation = (<IOpenSeadragonExtensionData>(
        this.extension.data
      )).rotation;

      if (this.initialRotation) {
        this.viewer.viewport.setRotation(parseInt(this.initialRotation));
      }

      const xywh: string | undefined = (
        this.extension.data as IOpenSeadragonExtensionData
      ).xywh;

      if (xywh) {
        this.initialBounds = XYWHFragment.fromString(xywh);
        this.currentBounds = this.initialBounds;
        this.fitToBounds(this.currentBounds);
      }
    } else if (settings.preserveViewport && this.currentBounds) {
      // if this isn't the first load and preserveViewport is enabled, fit to the current bounds.
      this.fitToBounds(this.currentBounds);
    } else {
      this.goHome();
    }
  }

  goHome(): void {
    this.viewer.viewport.goHome(true);
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

  fitToBounds(bounds: XYWHFragment, immediate: boolean = true): void {
    const rect = new OpenSeadragon.Rect();
    rect.x = Number(bounds.x);
    rect.y = Number(bounds.y);
    rect.width = Number(bounds.w);
    rect.height = Number(bounds.h);
    setTimeout(() => {
      this.viewer.viewport.fitBoundsWithConstraints(rect, immediate);
    }, 100);
  }

  getCroppedImageBounds(): string | null {
    if (!this.viewer || !this.viewer.viewport) return null;

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const dimensions: CroppedImageDimensions | null = (
      this.extension as OpenSeadragonExtension
    ).getCroppedImageDimensions(canvas, this.viewer);

    if (dimensions) {
      const bounds: XYWHFragment = new XYWHFragment(
        dimensions.regionPos.x,
        dimensions.regionPos.y,
        dimensions.region.width,
        dimensions.region.height
      );
      return bounds.toString();
    }

    return null;
  }

  getViewportBounds(): XYWHFragment | null {
    if (!this.viewer || !this.viewer.viewport) return null;

    const b: any = this.viewer.viewport.getBounds(true);
    const bounds: XYWHFragment = new XYWHFragment(
      Math.floor(b.x),
      Math.floor(b.y),
      Math.floor(b.width),
      Math.floor(b.height)
    );

    return bounds;
  }

  viewerResize(viewer: any): void {
    if (!viewer.viewport) return;

    const center = viewer.viewport.getCenter(true);
    if (!center) return;

    // postpone pan for a millisecond - fixes iPad image stretching/squashing issue.
    setTimeout(function () {
      viewer.viewport.panTo(center, true);
    }, 1);
  }

  clearAnnotations(): void {
    this.viewer.clearOverlays();
  }

  getAnnotationsForCurrentImages(): AnnotationGroup[] {
    const annotationsForCurrentImages: AnnotationGroup[] = [];
    const annotations: AnnotationGroup[] | null = (
      this.extension as OpenSeadragonExtension
    ).annotations;

    if (!annotations || !annotations.length) return annotationsForCurrentImages;

    const indices: number[] = this.extension.getPagedIndices();

    for (let i = 0; i < indices.length; i++) {
      const canvasIndex = indices[i];

      for (let j = 0; j < annotations.length; j++) {
        if (annotations[j].canvasIndex === canvasIndex) {
          annotationsForCurrentImages.push(annotations[j]);
          break;
        }
      }
    }

    return annotationsForCurrentImages;
  }

  getAnnotationRectsForCurrentImages(): AnnotationRect[] {
    const annotations: AnnotationGroup[] =
      this.getAnnotationsForCurrentImages();
    if (annotations.length) {
      return annotations
        .map((x) => {
          return x.rects;
        })
        .reduce((a, b) => {
          return a.concat(b);
        });
    }
    return [];
  }

  updateVisibleAnnotationRects(): void {
    // after animating, loop through all search result rects and flag their visibility based on whether they are inside the current viewport.
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();

    for (let i = 0; i < annotationRects.length; i++) {
      const rect: AnnotationRect = annotationRects[i];
      const viewportBounds: any = this.viewer.viewport.getBounds();

      rect.isVisible = Dimensions.hitRect(
        viewportBounds.x,
        viewportBounds.y,
        viewportBounds.width,
        viewportBounds.height,
        rect.viewportX,
        rect.viewportY
      );
    }
  }

  getAnnotationRectIndex(annotationRect: AnnotationRect): number {
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();
    return annotationRects.indexOf(annotationRect);
  }

  isZoomToSearchResultEnabled(): boolean {
    return Bools.getBool(
      this.extension.data.config!.options.zoomToSearchResultEnabled,
      true
    );
  }

  shouldZoomToInitialAnnotation(): boolean {
    return Bools.getBool(this.config.options.zoomToInitialAnnotation, true);
  }

  prevAnnotation(): void {
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();
    const currentAnnotationRect: AnnotationRect | null = (
      this.extension as OpenSeadragonExtension
    ).currentAnnotationRect;

    const currentAnnotationRectIndex: number = currentAnnotationRect
      ? this.getAnnotationRectIndex(currentAnnotationRect)
      : annotationRects.length;
    //const currentAnnotationRectIndex: number = this.getAnnotationRectIndex(<AnnotationRect>currentAnnotationRect);
    let foundRect: AnnotationRect | null = null;

    // if there's no currentAnnotationRect selected, index is the total available annotation rects for the current images.
    // minusing 1 makes the index the last of the available rects for the current images.
    for (let i = currentAnnotationRectIndex - 1; i >= 0; i--) {
      const rect: AnnotationRect = annotationRects[i];

      // this was removed as users found it confusing.
      // find the prev visible or non-visible rect.
      //if (rect.isVisible) {
      //    continue;
      //} else {
      foundRect = rect;
      break;
      //}
    }

    if (foundRect && this.isZoomToSearchResultEnabled()) {
      // if the rect's canvasIndex is less than the current canvasIndex
      if (foundRect.canvasIndex < this.extension.helper.canvasIndex) {
        (this.extension as OpenSeadragonExtension).currentAnnotationRect =
          foundRect;
        this.navigatedFromSearch = true;
        this.extensionHost.publish(IIIFEvents.ANNOTATION_CANVAS_CHANGE, [
          foundRect,
        ]);
      } else {
        this.zoomToAnnotation(foundRect);
      }
    } else {
      this.navigatedFromSearch = true;
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE
      );
    }
  }

  nextAnnotation(): void {
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();
    const currentAnnotationRect: AnnotationRect | null = (
      this.extension as OpenSeadragonExtension
    ).currentAnnotationRect;

    const currentAnnotationRectIndex: number = currentAnnotationRect
      ? this.getAnnotationRectIndex(currentAnnotationRect)
      : -1;
    let foundRect: AnnotationRect | null = null;

    // if there's no currentAnnotationRect selected, index is -1.
    // adding 1 makes the index 0 of available rects for the current images.
    for (
      let i = currentAnnotationRectIndex + 1;
      i < annotationRects.length;
      i++
    ) {
      const rect: AnnotationRect = annotationRects[i];

      // this was removed as users found it confusing.
      // find the next visible or non-visible rect.
      //if (rect.isVisible) {
      //    continue;
      //} else {
      foundRect = rect;
      break;
      //}
    }

    if (foundRect && this.isZoomToSearchResultEnabled()) {
      // if the rect's canvasIndex is greater than the current canvasIndex
      if (foundRect.canvasIndex > this.extension.helper.canvasIndex) {
        (this.extension as OpenSeadragonExtension).currentAnnotationRect =
          foundRect;
        this.navigatedFromSearch = true;
        this.extensionHost.publish(IIIFEvents.ANNOTATION_CANVAS_CHANGE, [
          foundRect,
        ]);
      } else {
        this.zoomToAnnotation(foundRect);
      }
    } else {
      this.navigatedFromSearch = true;
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE
      );
    }
  }

  getAnnotationRectByIndex(index: number): AnnotationRect | null {
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();
    if (!annotationRects.length) return null;
    return annotationRects[index];
  }

  getInitialAnnotationRect(): AnnotationRect | null {
    const annotationRects: AnnotationRect[] =
      this.getAnnotationRectsForCurrentImages();
    if (!annotationRects.length) return null;

    // if we've got this far it means that a reload has happened
    // check if the lastCanvasIndex is greater or less than the current canvasIndex
    // if greater than, select the last annotation on the current page
    // if less than, select the first annotation on the current page
    // otherwise default to the first annotation

    const previousAnnotationRect: AnnotationRect | null = (
      this.extension as OpenSeadragonExtension
    ).previousAnnotationRect;

    if (!previousAnnotationRect) {
      if (this.extension.lastCanvasIndex > this.extension.helper.canvasIndex) {
        const result = annotationRects.filter(
          (x) => x.canvasIndex === this.extension.helper.canvasIndex
        );
        return result[result.length - 1];
      }
    }

    return annotationRects.filter(
      (x) => x.canvasIndex === this.extension.helper.canvasIndex
    )[0];
  }

  zoomToAnnotation(annotationRect: AnnotationRect): void {
    (this.extension as OpenSeadragonExtension).previousAnnotationRect =
      (this.extension as OpenSeadragonExtension).currentAnnotationRect ||
      annotationRect;
    (this.extension as OpenSeadragonExtension).currentAnnotationRect =
      annotationRect;

    // if zoomToBoundsEnabled, zoom to the annotation's bounds.
    // otherwise, pan into view preserving the current zoom level.
    if (
      Bools.getBool(
        this.extension.data.config!.options.zoomToBoundsEnabled,
        false
      )
    ) {
      this.fitToBounds(
        new XYWHFragment(
          annotationRect.viewportX,
          annotationRect.viewportY,
          annotationRect.width,
          annotationRect.height
        ),
        false
      );
    } else if (this.currentBounds) {
      const x: number =
        annotationRect.viewportX -
        (this.currentBounds.w * 0.5 - annotationRect.width * 0.5);
      const y: number =
        annotationRect.viewportY -
        (this.currentBounds.h * 0.5 - annotationRect.height * 0.5);
      const w: number = this.currentBounds.w;
      const h: number = this.currentBounds.h;

      const bounds: XYWHFragment = new XYWHFragment(x, y, w, h);
      this.fitToBounds(bounds);
    }

    this.highlightAnnotationRect(annotationRect);

    this.extensionHost.publish(IIIFEvents.ANNOTATION_CHANGE);
  }

  highlightAnnotationRect(annotationRect: AnnotationRect): void {
    const $rect = $(
      "#annotation-" + annotationRect.canvasIndex + "-" + annotationRect.index
    );
    $rect.addClass("current");
    $(".annotationRect").not($rect).removeClass("current");
  }

  getAnnotationOverlayRects(annotationGroup: AnnotationGroup): any[] {
    const newRects: any[] = [];

    if (!this.extension.resources) {
      return newRects;
    }

    const resource: any = this.extension.resources.filter(
      (x) => x.index === annotationGroup.canvasIndex
    )[0];
    const index: number = this.extension.resources.indexOf(resource);
    let offsetX: number = 0;

    if (index > 0) {
      offsetX = (<IExternalImageResourceData>(
        this.extension.resources[index - 1]
      )).width;
    }

    for (let i = 0; i < annotationGroup.rects.length; i++) {
      const searchRect: AnnotationRect = annotationGroup.rects[i];

      const x: number =
        searchRect.x + offsetX + (index > 0 ? this.config.options.pageGap : 0);
      const y: number = searchRect.y;
      const w: number = searchRect.width;
      const h: number = searchRect.height;

      const rect = new OpenSeadragon.Rect(x, y, w, h);
      searchRect.viewportX = x;
      searchRect.viewportY = y;
      rect.canvasIndex = searchRect.canvasIndex;
      rect.resultIndex = searchRect.index;
      rect.chars = searchRect.chars;

      newRects.push(rect);
    }

    return newRects;
  }

  resize(): void {
    super.resize();

    this.$viewer.height(
      this.$content.height() - this.$viewer.verticalMargins()
    );
    this.$viewer.width(
      this.$content.width() - this.$viewer.horizontalMargins()
    );

    if (!this.isCreated) return;

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    this.$spinner.css(
      "top",
      this.$content.height() / 2 - this.$spinner.height() / 2
    );
    this.$spinner.css(
      "left",
      this.$content.width() / 2 - this.$spinner.width() / 2
    );

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

    // stretch navigator, allowing time for OSD to resize
    setTimeout(() => {
      if (this.extension.helper.isContinuous()) {
        if (this.extension.helper.isHorizontallyAligned()) {
          const width: number =
            this.$viewer.width() - this.$viewer.rightMargin();
          this.$navigator.width(width);
        } else {
          this.$navigator.height(this.$viewer.height());
        }
      }
    }, 100);
  }

  setFocus(): void {
    if (this.$canvas && !this.$canvas.is(":focus")) {
      if (this.extension.data.config!.options.allowStealFocus) {
        this.$canvas.focus();
      }
    }
  }

  setNavigatorVisible(): void {
    const navigatorEnabled: boolean =
      Bools.getBool(this.extension.getSettings().navigatorEnabled, true) &&
      this.extension.isDesktopMetric();

    if (this.viewer && this.viewer.navigator) {
      this.viewer.navigator.setVisible(navigatorEnabled);

      if (navigatorEnabled) {
        this.$navigator.show();
      } else {
        this.$navigator.hide();
      }
    }
  }

  getControlsFadeLength(): number {
    return (<ISettings>this.extension.getSettings()).reducedAnimation
      ? 0
      : this.config.options.controlsFadeLength || 250;
  }
}
