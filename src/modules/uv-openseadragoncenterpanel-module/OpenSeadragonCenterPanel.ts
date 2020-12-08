import { AnnotationGroup, AnnotationRect } from "@iiif/manifold";
import { Async, Bools, Dimensions } from "@edsilv/utils";
import {
  Canvas,
  IExternalResource,
  IExternalImageResourceData,
  IExternalResourceData
} from "manifesto.js";
import { sanitize } from "../../Utils";
import { ViewingDirection } from "@iiif/vocabulary";
import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { XYWH } from "../../extensions/uv-openseadragon-extension/XYWH";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { CroppedImageDimensions } from "../../extensions/uv-openseadragon-extension/CroppedImageDimensions";
import { Events } from "../../extensions/uv-openseadragon-extension/Events";
import { IOpenSeadragonExtensionData } from "../../extensions/uv-openseadragon-extension/IOpenSeadragonExtensionData";
// todo: replace when #1853 is merged
//import OpenSeadragon from "../../lib/openseadragon";
import OpenSeadragon from "openseadragon";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";

export class OpenSeadragonCenterPanel extends CenterPanel {
  controlsVisible: boolean = false;
  currentAnnotationRect: AnnotationRect;
  currentBounds: XYWH | null;
  handler: any;
  initialBounds: XYWH | null;
  initialRotation: any;
  isCreated: boolean = false;
  isLoaded: boolean = false;
  isFirstLoad: boolean = true;
  items: any[];
  navigatedFromSearch: boolean = false;
  nextButtonEnabled: boolean = false;
  pages: IExternalResource[];
  prevButtonEnabled: boolean = false;
  previousAnnotationRect: AnnotationRect;
  userData: any;
  viewer: any;
  viewerId: string;

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

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("openSeadragonCenterPanel");

    super.create();

    this.viewerId = "osd" + new Date().getTime();
    this.$viewer = $('<div id="' + this.viewerId + '" class="viewer"></div>');
    this.$content.prepend(this.$viewer);

    this.component.subscribe(BaseEvents.ANNOTATIONS, (args: any) => {
      this.overlayAnnotations();
      this.zoomToInitialAnnotation();
    });

    this.component.subscribe(BaseEvents.SETTINGS_CHANGE, (args: ISettings) => {
      this.viewer.gestureSettingsMouse.clickToZoom = args.clickToZoomEnabled;
    });

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        this.whenResized(async () => {
          if (!this.isCreated) {
            // uv may have reloaded
            this.createUI();
          }
          this.isLoaded = false;
          await this.openMedia(resources);
          this.isLoaded = true;
          this.component.publish(BaseEvents.EXTERNAL_RESOURCE_OPENED);
          this.component.publish(BaseEvents.LOAD);
        });
      }
    );

    this.component.subscribe(BaseEvents.CLEAR_ANNOTATIONS, () => {
      this.whenCreated(() => {
        (this.extension as OpenSeadragonExtension).currentAnnotationRect = null;
        this.clearAnnotations();
      });
    });

    this.component.subscribe(Events.NEXT_SEARCH_RESULT, () => {
      this.whenCreated(() => {
        this.nextAnnotation();
      });
    });

    this.component.subscribe(Events.PREV_SEARCH_RESULT, () => {
      this.whenCreated(() => {
        this.prevAnnotation();
      });
    });

    this.component.subscribe(Events.ZOOM_IN, () => {
      this.whenCreated(() => {
        this.zoomIn();
      });
    });

    this.component.subscribe(Events.ZOOM_OUT, () => {
      this.whenCreated(() => {
        this.zoomOut();
      });
    });

    this.component.subscribe(Events.ROTATE, () => {
      this.whenCreated(() => {
        this.rotateRight();
      });
    });

    this.component.subscribe(BaseEvents.METRIC_CHANGE, () => {
      this.whenCreated(() => {
        this.updateResponsiveView();
      });
    });

    this.component.subscribe(BaseEvents.SET_TARGET, (target: XYWH) => {
      this.whenLoaded(() => {
        this.fitToBounds(target, false);
      });
    });
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

    if (!this.extension.isDesktopMetric()) {
      this.viewer.autoHideControls = false;
    } else {
      this.viewer.autoHideControls = true;
    }
  }

  async createUI(): Promise<void> {
    this.$spinner = $('<div class="spinner"></div>');
    this.$content.append(this.$spinner);

    this.viewer = OpenSeadragon({
      id: this.viewerId,
      crossOriginPolicy: "Anonymous",
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
      controlsFadeLength: this.config.options.controlsFadeLength || 250,
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
      prefixUrl: this.extension.data.assetsDir + "/img/",
      gestureSettingsMouse: {
        clickToZoom: Bools.getBool(
          this.extension.data.config.options.clickToZoomEnabled,
          true
        )
      },
      navImages: {
        zoomIn: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        zoomOut: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        home: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        rotateright: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        rotateleft: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        next: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        },
        previous: {
          REST: "pixel.gif",
          GROUP: "pixel.gif",
          HOVER: "pixel.gif",
          DOWN: "pixel.gif"
        }
      }
    });

    this.$zoomInButton = this.$viewer.find('div[title="Zoom in"]');
    this.$zoomInButton.attr("tabindex", 0);
    this.$zoomInButton.prop("title", this.content.zoomIn);
    this.$zoomInButton.addClass("zoomIn viewportNavButton");

    this.$zoomOutButton = this.$viewer.find('div[title="Zoom out"]');
    this.$zoomOutButton.attr("tabindex", 0);
    this.$zoomOutButton.prop("title", this.content.zoomOut);
    this.$zoomOutButton.addClass("zoomOut viewportNavButton");

    this.$goHomeButton = this.$viewer.find('div[title="Go home"]');
    this.$goHomeButton.attr("tabindex", 0);
    this.$goHomeButton.prop("title", this.content.goHome);
    this.$goHomeButton.addClass("goHome viewportNavButton");

    this.$rotateButton = this.$viewer.find('div[title="Rotate right"]');
    this.$rotateButton.attr("tabindex", 0);
    this.$rotateButton.prop("title", this.content.rotateRight);
    this.$rotateButton.addClass("rotate viewportNavButton");

    this.$viewportNavButtonsContainer = this.$viewer.find(
      ".openseadragon-container > div:not(.openseadragon-canvas):first"
    );

    //this.$viewportNavButtonsContainer.addClass("viewportControls");

    this.$viewportNavButtons = this.$viewportNavButtonsContainer.find(
      ".viewportNavButton"
    );

    this.$canvas = $(this.viewer.canvas);

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
      this.component.publish(Events.OPENSEADRAGON_RESIZE, viewer);
      this.viewerResize(viewer);
    });

    this.viewer.addHandler("animation-start", (viewer: any) => {
      this.component.publish(Events.OPENSEADRAGON_ANIMATION_START, viewer);
    });

    this.viewer.addHandler("animation", (viewer: any) => {
      this.component.publish(Events.OPENSEADRAGON_ANIMATION, viewer);
    });

    this.viewer.addHandler("animation-finish", (viewer: any) => {
      this.currentBounds = this.getViewportBounds();

      this.updateVisibleAnnotationRects();

      this.component.publish(Events.OPENSEADRAGON_ANIMATION_FINISH, viewer);
    });

    this.viewer.addHandler("rotate", (args: any) => {
      this.component.publish(Events.OPENSEADRAGON_ROTATION, args.degrees);
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

    this.$prevButton = $('<div class="paging btn prev" tabindex="0"></div>');

    if (this.extension.helper.isRightToLeft()) {
      this.$prevButton.prop("title", this.content.next);
    } else {
      this.$prevButton.prop("title", this.content.previous);
    }

    this.$nextButton = $('<div class="paging btn next" tabindex="0"></div>');

    if (this.extension.helper.isRightToLeft()) {
      this.$nextButton.prop("title", this.content.previous);
    } else {
      this.$nextButton.prop("title", this.content.next);
    }

    this.viewer.addControl(this.$prevButton[0], {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT
    });
    this.viewer.addControl(this.$nextButton[0], {
      anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT
    });

    switch (viewingDirection) {
      case ViewingDirection.BOTTOM_TO_TOP:
      case ViewingDirection.TOP_TO_BOTTOM:
        this.$prevButton.addClass("vertical");
        this.$nextButton.addClass("vertical");
        break;
    }

    const that = this;

    this.$prevButton.onPressed((e: any) => {
      e.preventDefault();
      OpenSeadragon.cancelEvent(e);

      if (!that.prevButtonEnabled) return;

      switch (viewingDirection) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.component.publish(BaseEvents.PREV);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.component.publish(BaseEvents.NEXT);
          break;
      }
    });

    this.$nextButton.onPressed((e: any) => {
      e.preventDefault();
      OpenSeadragon.cancelEvent(e);

      if (!that.nextButtonEnabled) return;

      switch (viewingDirection) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.component.publish(BaseEvents.NEXT);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.component.publish(BaseEvents.PREV);
          break;
      }
    });

    // When Prev/Next buttons are focused, make sure the controls are enabled
    this.$prevButton.on("focus", () => {
      if (this.controlsVisible) return;
      this.controlsVisible = true;
      this.viewer.setControlsEnabled(true);
    });

    this.$nextButton.on("focus", () => {
      if (this.controlsVisible) return;
      this.controlsVisible = true;
      this.viewer.setControlsEnabled(true);
    });
  }

  async openMedia(resources?: IExternalResource[]): Promise<void> {
    // uv may have been unloaded
    if (!this.viewer) {
      return;
    }

    this.$spinner.show();
    this.items = [];

    let images: IExternalResourceData[] = await this.extension.getExternalResources(
      resources
    );

    try {
      this.viewer.close();

      images = this.getPagePositions(images);

      const canvases: Canvas[] = this.extension.helper.getCanvases();

      const layers = [];

      const viewingDirection: ViewingDirection =
        this.extension.helper.getViewingDirection() ||
        ViewingDirection.LEFT_TO_RIGHT;

      for (let i = 0; i < images.length; i++) {
        const data: any = images[i];

        let tileSource: any;

        if (data.hasServiceDescriptor) {
          tileSource = data;
        } else {
          tileSource = {
            type: "image",
            url: data.id,
            buildPyramid: false
          };
        }

        const canvasWorld = new CanvasWorld(canvases, [], viewingDirection);
        const contentResource = canvasWorld.contentResource(infoResponse.id);

        this.viewer.addTiledImage({
          error: event => reject(event),
          fitBounds: new OpenSeadragon.Rect(
            ...canvasWorld.contentResourceToWorldCoordinates(contentResource),
          ),
          index: canvasWorld.layerIndexOfImageResource(contentResource),
          opacity: canvasWorld.layerOpacityOfImageResource(contentResource),
          success: (item: any) => {
            this.items.push(item);
            if (this.items.length === images.length) {
              this.openPagesHandler();
            }
            this.resize();
          },
          tileSource,
        });

        // this.viewer.addTiledImage({
        //   tileSource: tileSource,
        //   x: data.x,
        //   y: data.y,
        //   width: data.width,
        //   success: (item: any) => {
        //     this.items.push(item);
        //     if (this.items.length === images.length) {
        //       this.openPagesHandler();
        //     }
        //     this.resize();
        //   }
        // });
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
    this.component.publish(Events.OPENSEADRAGON_OPEN);

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
    let annotationRect: AnnotationRect | null = this.getInitialAnnotationRect();

    (this.extension as OpenSeadragonExtension).previousAnnotationRect = null;
    (this.extension as OpenSeadragonExtension).currentAnnotationRect = null;

    if (annotationRect && this.isZoomToSearchResultEnabled()) {
      this.zoomToAnnotation(annotationRect);
    }
  }

  overlayAnnotations(): void {
    const annotations: AnnotationGroup[] = this.getAnnotationsForCurrentImages();

    for (let i = 0; i < annotations.length; i++) {
      const annotation: AnnotationGroup = annotations[i];
      const overlayRects: any[] = this.getAnnotationOverlayRects(annotation);

      for (let k = 0; k < overlayRects.length; k++) {
        const overlayRect = overlayRects[k];

        const div: HTMLElement = document.createElement("div");
        div.id =
          "searchResult-" +
          overlayRect.canvasIndex +
          "-" +
          overlayRect.resultIndex;
        div.className = "searchOverlay";
        div.title = sanitize(overlayRect.chars);

        this.viewer.addOverlay(div, overlayRect);
      }
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

      const xywh: string | null = (this.extension
        .data as IOpenSeadragonExtensionData).xywh;

      if (xywh) {
        this.initialBounds = XYWH.fromString(xywh);
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

  fitToBounds(bounds: XYWH, immediate: boolean = true): void {
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
    const dimensions: CroppedImageDimensions | null = (this
      .extension as OpenSeadragonExtension).getCroppedImageDimensions(
      canvas,
      this.viewer
    );

    if (dimensions) {
      const bounds: XYWH = new XYWH(
        dimensions.regionPos.x,
        dimensions.regionPos.y,
        dimensions.region.width,
        dimensions.region.height
      );
      return bounds.toString();
    }

    return null;
  }

  getViewportBounds(): XYWH | null {
    if (!this.viewer || !this.viewer.viewport) return null;

    const b: any = this.viewer.viewport.getBounds(true);
    const bounds: XYWH = new XYWH(
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
    setTimeout(function() {
      viewer.viewport.panTo(center, true);
    }, 1);
  }

  clearAnnotations(): void {
    this.$canvas.find(".searchOverlay").hide();
  }

  getAnnotationsForCurrentImages(): AnnotationGroup[] {
    let annotationsForCurrentImages: AnnotationGroup[] = [];
    const annotations: AnnotationGroup[] | null = (this
      .extension as OpenSeadragonExtension).annotations;

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
    const annotations: AnnotationGroup[] = this.getAnnotationsForCurrentImages();
    if (annotations.length) {
      return annotations
        .map(x => {
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
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();

    for (let i = 0; i < annotationRects.length; i++) {
      let rect: AnnotationRect = annotationRects[i];
      let viewportBounds: any = this.viewer.viewport.getBounds();

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
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();
    return annotationRects.indexOf(annotationRect);
  }

  isZoomToSearchResultEnabled(): boolean {
    return Bools.getBool(
      this.extension.data.config.options.zoomToSearchResultEnabled,
      true
    );
  }

  prevAnnotation(): void {
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();
    const currentAnnotationRect: AnnotationRect | null = (this
      .extension as OpenSeadragonExtension).currentAnnotationRect;

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
        (this
          .extension as OpenSeadragonExtension).currentAnnotationRect = foundRect;
        this.navigatedFromSearch = true;
        this.component.publish(BaseEvents.ANNOTATION_CANVAS_CHANGE, [
          foundRect
        ]);
      } else {
        this.zoomToAnnotation(foundRect);
      }
    } else {
      this.navigatedFromSearch = true;
      this.component.publish(Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
    }
  }

  nextAnnotation(): void {
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();
    const currentAnnotationRect: AnnotationRect | null = (this
      .extension as OpenSeadragonExtension).currentAnnotationRect;

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
        (this
          .extension as OpenSeadragonExtension).currentAnnotationRect = foundRect;
        this.navigatedFromSearch = true;
        this.component.publish(BaseEvents.ANNOTATION_CANVAS_CHANGE, [
          foundRect
        ]);
      } else {
        this.zoomToAnnotation(foundRect);
      }
    } else {
      this.navigatedFromSearch = true;
      this.component.publish(Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
    }
  }

  getAnnotationRectByIndex(index: number): AnnotationRect | null {
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();
    if (!annotationRects.length) return null;
    return annotationRects[index];
  }

  getInitialAnnotationRect(): AnnotationRect | null {
    const annotationRects: AnnotationRect[] = this.getAnnotationRectsForCurrentImages();
    if (!annotationRects.length) return null;

    // if we've got this far it means that a reload has happened
    // check if the lastCanvasIndex is greater or less than the current canvasIndex
    // if greater than, select the last annotation on the current page
    // if less than, select the first annotation on the current page
    // otherwise default to the first annotation

    const previousAnnotationRect: AnnotationRect | null = (this
      .extension as OpenSeadragonExtension).previousAnnotationRect;

    if (!previousAnnotationRect) {
      if (this.extension.lastCanvasIndex > this.extension.helper.canvasIndex) {
        const result = annotationRects.filter(
          x => x.canvasIndex === this.extension.helper.canvasIndex
        );
        return result[result.length - 1];
      }
    }

    return annotationRects.filter(
      x => x.canvasIndex === this.extension.helper.canvasIndex
    )[0];
  }

  zoomToAnnotation(annotationRect: AnnotationRect): void {
    (this.extension as OpenSeadragonExtension).previousAnnotationRect =
      (this.extension as OpenSeadragonExtension).currentAnnotationRect ||
      annotationRect;
    (this
      .extension as OpenSeadragonExtension).currentAnnotationRect = annotationRect;

    // if zoomToBoundsEnabled, zoom to the annotation's bounds.
    // otherwise, pan into view preserving the current zoom level.
    if (
      Bools.getBool(
        this.extension.data.config.options.zoomToBoundsEnabled,
        false
      )
    ) {
      this.fitToBounds(
        new XYWH(
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

      const bounds: XYWH = new XYWH(x, y, w, h);
      this.fitToBounds(bounds);
    }

    this.highlightAnnotationRect(annotationRect);

    this.component.publish(BaseEvents.ANNOTATION_CHANGE);
  }

  highlightAnnotationRect(annotationRect: AnnotationRect): void {
    const $rect = $(
      "#searchResult-" + annotationRect.canvasIndex + "-" + annotationRect.index
    );
    $rect.addClass("current");
    $(".searchOverlay")
      .not($rect)
      .removeClass("current");
  }

  getAnnotationOverlayRects(annotationGroup: AnnotationGroup): any[] {
    let newRects: any[] = [];

    if (!this.extension.resources) {
      return newRects;
    }

    let resource: any = this.extension.resources.filter(
      x => x.index === annotationGroup.canvasIndex
    )[0];
    let index: number = this.extension.resources.indexOf(resource);
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
    if (!this.$canvas.is(":focus")) {
      if (this.extension.data.config.options.allowStealFocus) {
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
}
