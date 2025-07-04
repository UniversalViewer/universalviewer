const $ = require("jquery");
import { RightPanel } from "../uv-shared-module/RightPanel";
import { TextRightPanel as TextRightPanelConfig } from "../../extensions/uv-openseadragon-extension/config/Config";
import { Events } from "../../../../Events";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import OpenSeadragon from "openseadragon";
import { Bools, Clipboard } from "@edsilv/utils";
import { IExternalImageResourceData } from "manifesto.js";
import { OpenSeadragonCenterPanel } from "../../modules/uv-openseadragoncenterpanel-module/OpenSeadragonCenterPanel";
import { Shell } from "../uv-shared-module/Shell";
import { AnnotationRect } from "@iiif/manifold";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

export class TextRightPanel extends RightPanel<TextRightPanelConfig> {
  $transcribedText: JQuery;
  $spinner: JQuery;
  $existingAnnotation: JQuery = $();
  $copyButton: JQuery;
  $copiedText: JQuery;
  currentCanvasIndex: number = 0;
  currentHitIndex: number = 1;
  currentRectIndex: number = 0;
  currentAnnotationRect: AnnotationRect | undefined;
  offsetX: number = 0;
  index: number = 0;
  clipboardText: string = "";
  shell: Shell;
  centerPanel: OpenSeadragonCenterPanel;
  isProcessingLoad: boolean = false;

  constructor($element: JQuery, shell: Shell) {
    super($element);
    this.shell = shell;
  }

  create(): void {
    this.setConfig("textRightPanel");

    super.create();

    let shouldOpenPanel: boolean = Bools.getBool(
      this.extension.getSettings().textRightPanelOpen,
      this.options.panelOpen
    );

    if (this.extension.isSmMetric()) shouldOpenPanel = false;

    if (shouldOpenPanel) {
      this.toggle(true);
    }

    if (
      this.config.options.copyToClipboardEnabled &&
      Clipboard.supportsCopy()
    ) {
      this.$copyButton = $(
        '<div class="copyText" alt="' +
          this.config.content.copyToClipboard +
          '" title="' +
          this.config.content.copyToClipboard +
          '"></div>'
      );

      this.$copiedText = $(
        '<div class="copiedText">' +
          this.config.content.copiedToClipboard +
          " </div>"
      );
      this.$copiedText.hide();
      this.$copyButton.hide();

      this.$copyButton.append(this.$copiedText);

      const that = this;
      this.$top.on("mouseenter", () => {
        that.$copyButton.show();
      });
      this.$top.on("mouseleave", () => {
        that.$copyButton.hide();
      });
      this.$copyButton.on("mouseleave", () => {
        that.$copiedText.hide();
      });

      this.$copyButton.on("click", () => {
        const text = that.$transcribedText.attr("data-text");
        this.copyText(text);
      });

      this.$top.append(this.$copyButton);
    }

    function getIntersectionArea(rect1, rect2) {
      const xOverlap = Math.max(
        0,
        Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
          Math.max(rect1.x, rect2.x)
      );
      const yOverlap = Math.max(
        0,
        Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
          Math.max(rect1.y, rect2.y)
      );
      return xOverlap * yOverlap;
    }

    function getIntersectionPercentage(rect1, rect2) {
      const intersectionArea = getIntersectionArea(rect1, rect2);
      const rect1Area = rect1.width * rect1.height;
      return (intersectionArea / rect1Area) * 100;
    }

    this.extensionHost.on(Events.SEARCH_HIT_CHANGED, (e) => {
      this.currentRectIndex = e[0].rectIndex;
      const canvasIndex = this.extension.helper.canvasIndex;
      this.currentHitIndex = e[0].hitIndex;
      $(".transcribed-text .searchHitSpan").each(
        (i: Number, searchHit: any) => {
          if ($(searchHit).hasClass("current")) {
            $(searchHit).removeClass("current");
            return;
          }
        }
      );
      if (
        $(
          '.transcribed-text .searchHitSpan[data-index="' +
            this.currentRectIndex +
            '"][data-canvas-index="' +
            canvasIndex +
            '"]'
        )[0] !== undefined
      ) {
        $(
          '.transcribed-text .searchHitSpan[data-index="' +
            this.currentRectIndex +
            '"][data-canvas-index="' +
            canvasIndex +
            '"]'
        ).addClass("current");
        $(
          '.transcribed-text .searchHitSpan[data-index="' +
            this.currentRectIndex +
            '"][data-canvas-index="' +
            canvasIndex +
            '"]'
        )
          .closest("div")[0]
          .scrollIntoView({
            behavior: "instant",
            block: "end",
            inline: "nearest",
          });
        this.setCurrentAnnotation(canvasIndex, this.currentRectIndex);
      }
    });

    this.extensionHost.on(
      OpenSeadragonExtensionEvents.CANVAS_CLICK,
      (e: any) => {
        var target = e.originalTarget || e.originalEvent.target;
        $(target).trigger("click");
      }
    );

    this.extensionHost.on(Events.LOAD, async (e) => {
      if (this.isProcessingLoad) return;

      this.isProcessingLoad = true;
      this.centerPanel = (<OpenSeadragonExtension>this.extension).centerPanel;
      const canvases = this.extension.getCurrentCanvases();
      canvases.sort((a, b) => ((a.index as number) - b.index) as number);

      const canvasExists = canvases.some(
        (x) => x.index === this.currentCanvasIndex
      );

      if (canvasExists) {
        this.$existingAnnotation = $(".lineAnnotation.current");
      } else {
        this.$existingAnnotation = $();
      }
      this.currentCanvasIndex = this.extension.helper.canvasIndex;

      this.$main.html("");
      this.clipboardText = "";
      this.removeLineAnnotationRects();
      for (let i = 0; i < canvases.length; i++) {
        const c = canvases[i];
        const seeAlso = c.getProperty("seeAlso");
        let header;

        if (i === 0 && canvases.length > 1) {
          header = this.content.leftPage;
        } else if (i === 1 && canvases.length > 1) {
          header = this.content.rightPage;
        }

        // Find offset if showing more pages than one
        const res = this.extension.resources;
        this.offsetX = -1;
        this.index = -1;
        if (res !== null && res !== undefined) {
          const resource: any = res.filter((x) => x.index === c.index)[0];
          this.index = res.indexOf(resource);
          this.offsetX = 0;

          if (this.index > 0) {
            this.offsetX = (<IExternalImageResourceData>(
              res[this.index - 1]
            )).width;
          }
        }

        if (this.offsetX === 0 && this.$transcribedText) {
          // Clear transcribedText when switching between one or more pages
          this.$transcribedText.html("");
        }

        // We need to see if seeAlso contains an ALTO file and maybe allow for other HTR/OCR formats in the future
        // and make sure which version of IIIF Presentation API is used
        if (seeAlso.length === undefined) {
          // This is IIIF Presentation API < 3
          if (seeAlso.profile.includes("alto")) {
            await this.processAltoFile(seeAlso["@id"], c.index, header);
          }
        } else {
          // This is IIIF Presentation API >= 3
          if (seeAlso[0].profile.includes("alto")) {
            await this.processAltoFile(seeAlso[0]["id"], c.index, header);
          }
        }

        const annotationRects = (<OpenSeadragonExtension>this.extension)
          .getAnnotationRects()
          .filter((rect) => {
            return rect["canvasIndex"] == c.index;
          });
        annotationRects.forEach((annotationRect) => {
          const rect = {
            x: annotationRect.x,
            y: annotationRect.y,
            width: annotationRect.width,
            height: annotationRect.height,
          };
          $("div.lineAnnotationRect").each(
            (i: Number, lineAnnotationRect: any) => {
              const x = $(lineAnnotationRect).data("x");
              const y = $(lineAnnotationRect).data("y");
              const width = $(lineAnnotationRect).data("width");
              const height = $(lineAnnotationRect).data("height");
              const lineRect = { x: x, y: y, width: width, height: height };

              const p = getIntersectionPercentage(rect, lineRect);
              if (p > 50) {
                let text = $(
                  "div#" + $(lineAnnotationRect).attr("id") + ".lineAnnotation"
                ).text();
                text = text.replace(
                  annotationRect.chars,
                  '<span class="searchHitSpan" data-index="' +
                    annotationRect.index +
                    '" data-canvas-index="' +
                    annotationRect.canvasIndex +
                    '">' +
                    annotationRect.chars +
                    "</span>"
                );
                $(
                  "div#" + $(lineAnnotationRect).attr("id") + ".lineAnnotation"
                ).html("");
                $(
                  "div#" + $(lineAnnotationRect).attr("id") + ".lineAnnotation"
                ).html(text);
              }
            }
          );
        });

        if (
          $(
            '.transcribed-text .searchHitSpan[data-index="' +
              this.currentRectIndex +
              '"][data-canvas-index="' +
              this.currentCanvasIndex +
              '"]'
          )[0] !== undefined
        ) {
          $(
            '.transcribed-text .searchHitSpan[data-index="' +
              this.currentRectIndex +
              '"][data-canvas-index="' +
              this.currentCanvasIndex +
              '"]'
          ).addClass("current");
          $(
            '.transcribed-text .searchHitSpan[data-index="' +
              this.currentRectIndex +
              '"][data-canvas-index="' +
              this.currentCanvasIndex +
              '"]'
          )
            .closest("div")[0]
            .scrollIntoView({
              behavior: "instant",
              block: "end",
              inline: "nearest",
            });
          this.setCurrentAnnotation(
            this.currentCanvasIndex,
            this.currentRectIndex
          );
        }
      }
      this.isProcessingLoad = false;
    });

    this.setTitle(this.config.content.title);
    this.$top.parent().addClass("textRightPanel");
  }

  toggleFinish(): void {
    super.toggleFinish();
  }

  resize(): void {
    super.resize();

    this.$main.height(
      this.$element.height() - this.$top.height() - this.$main.verticalMargins()
    );

    /*     this.$element.css({
          left: Math.floor(
            this.$element.parent().width() - this.$element.outerWidth() - this.options.panelCollapsedWidth
          ),
        }); */
  }

  // Let's load the ALTO file and do some parsing
  processAltoFile = async (altoUrl, canvasIndex, header?): Promise<void> => {
    this.$spinner = $('<div class="spinner"></div>');
    this.$spinner.css(
      "top",
      this.$main.height() / 2 - this.$spinner.height() / 2
    );
    this.$main.append(this.$spinner);
    this.$spinner.show();
    try {
      const response = await fetch(altoUrl);
      const data = await response.text();
      const altoDoc = new DOMParser().parseFromString(data, "application/xml");
      const textLines = altoDoc.querySelectorAll("TextLine");

      const lines = Array.from(textLines).map((e, i) => {
        const strings = e.querySelectorAll("String");
        const t = Array.from(strings).map((e, i) => {
          return e.getAttribute("CONTENT");
        });
        let x = Number(e.getAttribute("HPOS"));
        const y = Number(e.getAttribute("VPOS"));
        const width = Number(e.getAttribute("WIDTH"));
        const height = Number(e.getAttribute("HEIGHT"));
        x =
          x +
          this.offsetX +
          (this.index > 0 ? this.centerPanel.config.options.pageGap : 0);
        const text = t.join(" ");
        this.clipboardText += text + " ";

        const line = $(
          '<div id="line-annotation-' +
            canvasIndex +
            "-" +
            i +
            '" class="lineAnnotation" tabindex="0">' +
            text +
            "</div>"
        );

        if (!this.extension.isMobile()) {
          const div = $(
            '<div id="line-annotation-' +
              canvasIndex +
              "-" +
              i +
              '" class="lineAnnotationRect" title="' +
              text +
              '" data-x="' +
              x +
              '" data-y="' +
              y +
              '" data-width="' +
              width +
              '" data-height="' +
              height +
              '" tabindex="0"></div>'
          );
          $(div).on("keydown", (e: any) => {
            if (e.keyCode === 13) {
              $(e.target).trigger("click");
            }
          });
          $(div).on("click", (e: any) => {
            const canvasIndex = Number(
              e.target.getAttribute("id").split("-")[2]
            );
            // We change the current canvas index to the clicked page (if we're in two page view)
            if (canvasIndex !== this.currentCanvasIndex) {
              this.extension.helper.canvasIndex = canvasIndex;
              this.currentCanvasIndex = canvasIndex;
            }
            this.clearLineAnnotationRects();
            this.clearLineAnnotations();
            this.setCurrentLineAnnotation(e.target, true);
            this.setCurrentLineAnnotationRect(e.target);
          });
          // Add overlay to OpenSeadragon canvas
          const osRect = new OpenSeadragon.Rect(x, y, width, height);
          (<OpenSeadragonExtension>(
            this.extension
          )).centerPanel.viewer.addOverlay(div[0], osRect);

          line.on("keydown", (e: any) => {
            if (e.keyCode === 13) {
              $(e.target).trigger("click");
            }
          });
          // Sync line click with line annotation
          line.on("click", (e: any) => {
            const target = e.currentTarget;
            const canvasIndex = Number(target.getAttribute("id").split("-")[2]);
            // We change the current canvas index to the clicked page (if we're in two page view)
            if (canvasIndex !== this.currentCanvasIndex) {
              this.extension.helper.canvasIndex = canvasIndex;
              this.currentCanvasIndex = canvasIndex;
            }
            this.clearLineAnnotationRects();
            this.clearLineAnnotations();
            this.setCurrentLineAnnotation(target, false);
            this.setCurrentLineAnnotationRect(target);
          });
        }
        return line;
      });

      if (!this.$transcribedText) {
        this.$transcribedText = $('<div class="transcribed-text"></div>');
      }
      if (header) {
        this.$transcribedText.append(
          $('<div class="label">' + header + "</div>")
        );
      }
      if (lines.length > 0) {
        this.$transcribedText.append(lines);
        this.$transcribedText.attr("data-text", this.clipboardText.trimEnd());
      } else {
        this.$transcribedText.append(
          $("<div>" + this.content.textNotFound + "</div>")
        );
      }

      if (
        this.$transcribedText[0]?.firstElementChild?.firstChild
          ?.toString()
          .trim()
      ) {
        this.$spinner.hide();
      }

      this.$main.append(this.$transcribedText);

      // If we already have a selected line annotation, make sure it's selected again after load
      if (this.$existingAnnotation[0] !== undefined) {
        const id = $(this.$existingAnnotation).attr("id");
        if ($("div#" + id).length > 0) {
          // Make sure the line annotation exists in the DOM
          this.setCurrentLineAnnotation($("div#" + id)[0], true);
          this.setCurrentLineAnnotationRect($("div#" + id)[0]);
        }
      }
    } catch (error) {
      throw new Error("Unable to fetch Alto file: " + error.message);
    }
  };

  copyText(text: string): void {
    Clipboard.copy(text);

    this.$copiedText.show();

    setTimeout(() => {
      this.$copiedText.hide();
    }, 2000);
  }

  setCurrentLineAnnotationRect(e: any): void {
    $("div.lineAnnotationRect").each((i: Number, lineAnnotationRect: any) => {
      if ($(lineAnnotationRect).hasClass("current")) {
        $(lineAnnotationRect).removeClass("current");
      }
    });
    $("div#" + e.getAttribute("id") + ".lineAnnotationRect").addClass(
      "current"
    );
  }

  setCurrentLineAnnotation(e: any, scrollIntoView: Boolean): void {
    $(".lineAnnotation").each((i: Number, lineAnnotation: any) => {
      if ($(lineAnnotation).hasClass("current")) {
        $(lineAnnotation).removeClass("current");
      }
    });
    $("div#" + e.getAttribute("id") + ".lineAnnotation").addClass("current");
    if (scrollIntoView) {
      $("div#" + e.getAttribute("id") + ".lineAnnotation")[0].scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }
  }

  clearLineAnnotationRects(): void {
    $("div.lineAnnotationRect").each((i: Number, lineAnnotationRect: any) => {
      if ($(lineAnnotationRect).hasClass("current")) {
        $(lineAnnotationRect).removeClass("current");
      }
    });
  }

  clearLineAnnotations(): void {
    $(".lineAnnotation").each((i: Number, lineAnnotation: any) => {
      if ($(lineAnnotation).hasClass("current")) {
        $(lineAnnotation).removeClass("current");
      }
    });
  }

  removeLineAnnotationRects(): void {
    $("div.lineAnnotationRect").remove();
  }

  setCurrentAnnotation(canvasIndex: any, index: any): void {
    $(".annotationRect").each((i: number, annotation: any) => {
      if ($(annotation).hasClass("current")) {
        $(annotation).removeClass("current");
        return;
      }
    });
    $("div#annotation-" + canvasIndex + "-" + index).addClass("current");
  }
}
