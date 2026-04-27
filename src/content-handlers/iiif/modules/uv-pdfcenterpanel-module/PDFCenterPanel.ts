const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { PDFExtensionEvents } from "../../extensions/uv-pdf-extension/Events";
import { Bools } from "../../Utils";
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { Events } from "../../../../Events";
import { loadScripts } from "../../../../Utils";
import { Config } from "../../extensions/uv-pdf-extension/config/Config";

// declare var PDFJS: any;

export class PDFCenterPanel extends CenterPanel<
  Config["modules"]["pdfCenterPanel"]
> {
  // private _$spinner: JQuery;
  private _$canvas: JQuery;
  private _$nextButton: JQuery;
  private _$pdfContainer: JQuery;
  private _$prevButton: JQuery;
  private _$progress: JQuery;
  private _$zoomInButton: JQuery;
  private _$zoomOutButton: JQuery;
  private _canvas: HTMLCanvasElement;
  private _ctx: any;
  private _lastMediaUri: string | null = null;
  private _nextButtonEnabled: boolean = false;
  private _pageIndex: number = 1;
  private _pageIndexPending: number | null = null;
  private _pageRendering: boolean = false;
  private _pdfDoc: any = null;
  private _pdfjsLib: any = null;
  private _prevButtonEnabled: boolean = false;
  private _renderTask: any;
  private _scale: number = 0.7;
  private _viewport: any;

  constructor($element: JQuery) {
    super($element);
  }

  private _getDecreasedScale(): number {
    return this._scale > 0.5 ? this._scale - 0.5 : this._scale / 1.5;
  }

  private _getIncreasedScale(): number {
    return this._scale >= 0.5 ? this._scale + 0.5 : this._scale * 1.5;
  }

  private _getMinScale(): number {
    const minScale = Number(this.options.minScale);
    return minScale > 0 ? minScale : 0.7;
  }

  private _getMaxScale(): number {
    const maxScale = Number(this.options.maxScale);
    return maxScale > 0 ? maxScale : 5;
  }

  create(): void {
    this.setConfig("pdfCenterPanel");

    super.create();

    this._$pdfContainer = $('<div class="pdfContainer"></div>');
    this._$canvas = $("<canvas></canvas>");
    // this._$spinner = $('<div class="spinner"></div>');
    this._$progress = $('<progress max="100" value="0"></progress>');
    this._canvas = <HTMLCanvasElement>this._$canvas[0];
    this._ctx = this._canvas.getContext("2d");
    this._$prevButton = $(
      `<button class="btn btn-default paging prev" title="${this.content.previous}">
        <i class="uv-icon-prev" aria-hidden="true"></i>
        <span class="sr-only">${this.content.previous}</span>
      </button>`
    );
    this._$nextButton = $(
      `<button class="btn btn-default paging next" title="${this.content.next}">
        <i class="uv-icon-next" aria-hidden="true"></i>
        <span class="sr-only">${this.content.next}</span>
      </button>`
    );
    this._$zoomInButton = $(
      '<button class="btn zoomIn" tabindex="0"></button>'
    );
    this._$zoomInButton.attr("title", this.content.zoomIn);
    this._$zoomInButton.attr("aria-label", this.content.zoomIn);
    this._$zoomOutButton = $(
      '<button class="btn zoomOut" tabindex="0"></button>'
    );
    this._$zoomOutButton.attr("title", this.content.zoomOut);
    this._$zoomOutButton.attr("aria-label", this.content.zoomOut);

    // Only attach PDF controls if we're using PDF.js; they have no meaning in
    // PDFObject. However, we still create the objects above so that references
    // to them do not cause errors (simpler than putting usePdfJs checks all over):
    if (Bools.getBool(this.options.usePdfJs, false)) {
      // this.$content.append(this._$spinner);
      this.$content.append(this._$progress);
      this.$content.append(this._$prevButton);
      this.$content.append(this._$nextButton);
      this.$content.append(this._$zoomInButton);
      this.$content.append(this._$zoomOutButton);
    }

    this._$pdfContainer.append(this._$canvas);

    this.$content.prepend(this._$pdfContainer);

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        this.openMedia(resources);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.FIRST, () => {
      if (!this._pdfDoc) {
        return;
      }

      this._pageIndex = 1;

      this._queueRenderPage(this._pageIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.PREV, () => {
      if (!this._pdfDoc) {
        return;
      }

      if (this._pageIndex <= 1) {
        return;
      }

      this._pageIndex--;

      this._queueRenderPage(this._pageIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.NEXT, () => {
      if (!this._pdfDoc) {
        return;
      }

      if (this._pageIndex >= this._pdfDoc.numPages) {
        return;
      }

      this._pageIndex++;

      this._queueRenderPage(this._pageIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.LAST, () => {
      if (!this._pdfDoc) {
        return;
      }

      this._pageIndex = this._pdfDoc.numPages;

      this._queueRenderPage(this._pageIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      if (!this._pdfDoc) {
        return;
      }

      this._pageIndex = 1;

      this._queueRenderPage(this._pageIndex);
    });

    this.extensionHost.subscribe(
      PDFExtensionEvents.SEARCH,
      (pageIndex: number) => {
        if (!this._pdfDoc) {
          return;
        }

        if (pageIndex < 1 || pageIndex > this._pdfDoc.numPages) {
          return;
        }

        this._pageIndex = pageIndex;

        this._queueRenderPage(this._pageIndex);
      }
    );

    this.extensionHost.subscribe(PDFExtensionEvents.ZOOM_IN, () => {
      const newScale: number = this._getIncreasedScale();
      const maxScale: number = this._getMaxScale();
      if (newScale < maxScale) {
        this._scale = newScale;
      } else {
        this._scale = maxScale;
      }

      this._render(this._pageIndex);
    });

    this.extensionHost.subscribe(PDFExtensionEvents.ZOOM_OUT, () => {
      const newScale: number = this._getDecreasedScale();
      const minScale: number = this._getMinScale();
      if (newScale > minScale) {
        this._scale = newScale;
      } else {
        this._scale = minScale;
      }

      this._render(this._pageIndex);
    });

    this._$prevButton.onPressed((e: any) => {
      e.preventDefault();

      if (!this._prevButtonEnabled) return;

      this.extensionHost.publish(IIIFEvents.PREV);
    });

    this.disablePrevButton();

    this._$nextButton.onPressed((e: any) => {
      e.preventDefault();

      if (!this._nextButtonEnabled) return;

      this.extensionHost.publish(IIIFEvents.NEXT);
    });

    this.disableNextButton();

    this.onAccessibleClick(this._$zoomInButton, () => {
      this.extensionHost.publish(PDFExtensionEvents.ZOOM_IN);
    });

    this.onAccessibleClick(this._$zoomOutButton, () => {
      this.extensionHost.publish(PDFExtensionEvents.ZOOM_OUT);
    });
  }

  disablePrevButton(): void {
    this._prevButtonEnabled = false;
    this._$prevButton.addClass("disabled");
  }

  enablePrevButton(): void {
    this._prevButtonEnabled = true;
    this._$prevButton.removeClass("disabled");
  }

  hidePrevButton(): void {
    this.disablePrevButton();
    this._$prevButton.hide();
  }

  showPrevButton(): void {
    this.enablePrevButton();
    this._$prevButton.show();
  }

  disableNextButton(): void {
    this._nextButtonEnabled = false;
    this._$nextButton.addClass("disabled");
  }

  enableNextButton(): void {
    this._nextButtonEnabled = true;
    this._$nextButton.removeClass("disabled");
  }

  hideNextButton(): void {
    this.disableNextButton();
    this._$nextButton.hide();
  }

  showNextButton(): void {
    this.enableNextButton();
    this._$nextButton.show();
  }

  async openMedia(resources: IExternalResource[]) {
    // this._$spinner.show();

    await this.extension.getExternalResources(resources);

    let mediaUri: string | null = null;
    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const formats: AnnotationBody[] | null =
      this.extension.getMediaFormats(canvas);
    const pdfUri: string = canvas.id;

    if (formats && formats.length) {
      mediaUri = formats[0].id;
    } else {
      mediaUri = canvas.id;
    }

    if (mediaUri === this._lastMediaUri) {
      return;
    }

    this._lastMediaUri = mediaUri;

    if (!Bools.getBool(this.options.usePdfJs, false)) {
      window.PDFObject = await import(
        /* webpackChunkName: "pdfobject" */ /* webpackMode: "lazy" */ "pdfobject"
      );
      window.PDFObject.embed(pdfUri, ".pdfContainer", { id: "PDF" });
    } else {
      // PDFJS = await import(
      //   /* webpackChunkName: "pdfjs" */ /* webpackMode: "lazy" */ "pdfjs-dist"
      // );

      // PDFJS.disableWorker = true;

      // use pdfjs cdn, it just isn't working with webpack
      if (!this._pdfjsLib) {
        await loadScripts([
          "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
        ]);
        this._pdfjsLib = window["pdfjs-dist/build/pdf"];
        this._pdfjsLib.GlobalWorkerOptions.workerSrc =
          "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      } else {
        this._$progress[0].setAttribute("value", "0");
        this._$progress.show();
        this._$canvas.hide();
      }

      const parameter = {
        url: mediaUri,
        withCredentials: canvas.externalResource.isAccessControlled(),
      };

      const loadingTask = this._pdfjsLib.getDocument(parameter);
      loadingTask.onProgress = (progress) => {
        const percentLoaded = (progress.loaded / progress.total) * 100;
        this._$progress[0].setAttribute("value", String(percentLoaded));
        if (percentLoaded === 100) {
          this._$progress.hide();
          this._$canvas.show();
        }
      };
      loadingTask.promise.then((pdf) => {
        this._pdfDoc = pdf;
        this._render(this._pageIndex);
        this.extensionHost.publish(PDFExtensionEvents.PDF_LOADED, pdf);
      });
    }

    this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
    this.extensionHost.publish(Events.LOAD);
  }

  private _render(num: number): void {
    if (!Bools.getBool(this.options.usePdfJs, false)) {
      return;
    }

    this._pageRendering = true;
    this._$zoomOutButton.enable();
    this._$zoomInButton.enable();

    // disable zoom if not possible
    const lowScale: number = this._getDecreasedScale();
    const highScale: number = this._getIncreasedScale();
    if (lowScale < this._getMinScale()) {
      this._$zoomOutButton.disable();
    }
    if (highScale > this._getMaxScale()) {
      this._$zoomInButton.disable();
    }

    if (this.extension.isMetric("sm")) {
      this._$zoomOutButton.hide();
      this._$zoomInButton.hide();
    } else {
      this._$zoomOutButton.show();
      this._$zoomInButton.show();
    }

    //this._pdfDoc.getPage(num).then((page: any) => {
    this._pdfDoc.getPage(num).then((page: any) => {
      if (this._renderTask) {
        this._renderTask.cancel();
      }

      // how to fit to the available space
      // const height: number = this.$content.height();
      // this._canvas.height = height;
      // this._viewport = page.getViewport(this._canvas.height / page.getViewport(1.0).height);
      // const width: number = this._viewport.width;
      // this._canvas.width = width;

      // this._$canvas.css({
      //     left: (this.$content.width() / 2) - (width / 2)
      // });

      // scale viewport
      this._viewport = page.getViewport({ scale: this._scale });
      this._canvas.height = this._viewport.height;
      this._canvas.width = this._viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: this._ctx,
        viewport: this._viewport,
      };

      this._renderTask = page.render(renderContext);

      // Wait for rendering to finish
      this._renderTask.promise
        .then(() => {
          this.extensionHost.publish(
            PDFExtensionEvents.PAGE_INDEX_CHANGE,
            this._pageIndex
          );

          this._pageRendering = false;

          if (this._pageIndexPending !== null) {
            // New page rendering is pending
            this._render(this._pageIndexPending);
            this._pageIndexPending = null;
          }

          if (this._pageIndex === 1) {
            this.disablePrevButton();
          } else {
            this.enablePrevButton();
          }

          if (this._pageIndex === this._pdfDoc.numPages) {
            this.disableNextButton();
          } else {
            this.enableNextButton();
          }
        })
        .catch((_err: any) => {
          //console.log(err);
        });
    });
  }

  private _queueRenderPage(num: number) {
    if (this._pageRendering) {
      this._pageIndexPending = num;
    } else {
      this._render(num);
    }
  }

  resize() {
    super.resize();

    this._$pdfContainer.width(this.$content.width());
    this._$pdfContainer.height(this.$content.height());

    // this._$spinner.css(
    //   "top",
    //   this.$content.height() / 2 - this._$spinner.height() / 2
    // );
    // this._$spinner.css(
    //   "left",
    //   this.$content.width() / 2 - this._$spinner.width() / 2
    // );

    this._$progress.css(
      "top",
      this.$content.height() / 2 - this._$progress.height() / 2
    );
    this._$progress.css(
      "left",
      this.$content.width() / 2 - this._$progress.width() / 2
    );

    this._$prevButton.css({
      top: (this.$content.height() - this._$prevButton.height()) / 2,
      left: this._$prevButton.horizontalMargins(),
    });

    this._$nextButton.css({
      top: (this.$content.height() - this._$nextButton.height()) / 2,
      left:
        this.$content.width() -
        (this._$nextButton.width() + this._$nextButton.horizontalMargins()),
    });

    if (!this._viewport) {
      return;
    }

    this._render(this._pageIndex);
  }
}
