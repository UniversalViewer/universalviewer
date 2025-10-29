const $ = require("jquery");
import { RightPanel } from "../uv-shared-module/RightPanel";
import { TextRightPanel as TextRightPanelConfig } from "../../extensions/uv-openseadragon-extension/config/Config";
import { Events } from "../../../../Events";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import OpenSeadragon from "openseadragon";
import { Bools, Clipboard } from "../../Utils";
import { IExternalImageResourceData } from "manifesto.js";
import { OpenSeadragonCenterPanel } from "../../modules/uv-openseadragoncenterpanel-module/OpenSeadragonCenterPanel";
import { Shell } from "../uv-shared-module/Shell";
import { AnnotationRect } from "@iiif/manifold";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

import { AnnotationPage, Annotation, IManifestoOptions } from "manifesto.js";
interface LineData {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
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

    // function getIntersectionArea(rect1, rect2) {
    //   const xOverlap = Math.max(
    //     0,
    //     Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
    //       Math.max(rect1.x, rect2.x)
    //   );
    //   const yOverlap = Math.max(
    //     0,
    //     Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
    //       Math.max(rect1.y, rect2.y)
    //   );
    //   return xOverlap * yOverlap;
    // }

    // function getIntersectionPercentage(rect1, rect2) {
    //   const intersectionArea = getIntersectionArea(rect1, rect2);
    //   const rect1Area = rect1.width * rect1.height;
    //   return (intersectionArea / rect1Area) * 100;
    // }

    this.extensionHost.on(Events.SEARCH_HIT_CHANGED, (e) => {
      // this reacts to a new search hit being selected and styles the elements (rect on the canvas, span in the full text) appropriately

      // the e object has hitIndex, rectIndex, and canvasIndex for the search result that was just selected.
      // rectIndex is the index of the rect on the canvas. hit index is the result index
      // console.log(e);

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
        console.log(e.originalTarget);
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

        const annotations = c.getAnnotations();

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

        if (annotations.length) {
          // Check for annotations on the canvas first
          await this.processWebAnnotations(annotations, c.index, header);
        } else if (seeAlso && seeAlso.length === undefined) {
          // This is IIIF Presentation API < 3
          if (seeAlso.profile.includes("alto")) {
            await this.processAltoFile(seeAlso["@id"], c.index, header);
          }
        } else if (seeAlso && seeAlso.length > 0) {
          // This is IIIF Presentation API >= 3
          if (seeAlso[0].profile.includes("alto")) {
            await this.processAltoFile(seeAlso[0]["id"], c.index, header);
          }
        }

        // const annotationRects = (<OpenSeadragonExtension>this.extension)
        //   .getAnnotationRects()
        //   .filter((rect) => {
        //     return rect["canvasIndex"] == c.index;
        //   });

        // annotationRects.forEach((annotationRect) => {
        //   const rect = {
        //     x: annotationRect.x,
        //     y: annotationRect.y,
        //     width: annotationRect.width,
        //     height: annotationRect.height,
        //   };

        //   $("div.lineAnnotationRect").each(
        //     (i: Number, lineAnnotationRect: any) => {
        //       const x = $(lineAnnotationRect).data("x");
        //       const y = $(lineAnnotationRect).data("y");
        //       const width = $(lineAnnotationRect).data("width");
        //       const height = $(lineAnnotationRect).data("height");
        //       const lineRect = { x: x, y: y, width: width, height: height };

        //       const p = getIntersectionPercentage(rect, lineRect);
        //       if (p > 50) {
        //         const lineElement = $(
        //           "div#" + $(lineAnnotationRect).attr("id") + ".lineAnnotation"
        //         );
        //         if (lineElement[0]) {
        //           this.highlightSearchHit(
        //             lineElement[0],
        //             annotationRect.chars,
        //             annotationRect.index,
        //             annotationRect.canvasIndex
        //           );
        //         }
        //       }
        //     }
        //   );
        // });

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

  // highlightSearchHit(
  //   element: Element,
  //   searchText: string,
  //   index: string | number,
  //   canvasIndex: string | number
  // ): void {
  //   // traverse only text nodes
  //   const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
  //     acceptNode: function (node: Node): number {
  //       // skip text nodes that are already inside searchHitSpan elements
  //       const parent = node.parentElement;
  //       if (parent && parent.classList.contains("searchHitSpan")) {
  //         return NodeFilter.FILTER_REJECT;
  //       }
  //       return NodeFilter.FILTER_ACCEPT;
  //     },
  //   });

  //   let currentNode: Node | null;
  //   const textNodes: Text[] = [];

  //   // collect all valid text nodes
  //   while ((currentNode = walker.nextNode())) {
  //     textNodes.push(currentNode as Text);
  //   }

  //   // find the first occurrence of search hit
  //   for (const textNode of textNodes) {
  //     const textContent = textNode.textContent || "";
  //     const hitIndex = textContent.indexOf(searchText);

  //     if (hitIndex !== -1) {
  //       // split the text node and wrap the match
  //       const beforeText = textContent.substring(0, hitIndex);
  //       const matchText = textContent.substring(
  //         hitIndex,
  //         hitIndex + searchText.length
  //       );
  //       const afterText = textContent.substring(hitIndex + searchText.length);

  //       // create highlight span
  //       const highlightSpan = document.createElement("span");
  //       highlightSpan.className = "searchHitSpan";
  //       highlightSpan.setAttribute("data-index", String(index));
  //       highlightSpan.setAttribute("data-canvas-index", String(canvasIndex));
  //       highlightSpan.textContent = matchText;

  //       const parent = textNode.parentNode;

  //       if (parent) {
  //         // replace original text node with the parts
  //         if (beforeText) {
  //           const beforeNode = document.createTextNode(beforeText);
  //           parent.insertBefore(beforeNode, textNode);
  //         }

  //         parent.insertBefore(highlightSpan, textNode);

  //         if (afterText) {
  //           const afterNode = document.createTextNode(afterText);
  //           parent.insertBefore(afterNode, textNode);
  //         }

  //         // remove the original text node
  //         parent.removeChild(textNode);
  //       }

  //       // stop after finding and wrapping the first occurrence
  //       break;
  //     }
  //   }
  // }

  toggleFinish(): void {
    super.toggleFinish();
  }

  resize(): void {
    super.resize();

    this.$main.height(
      this.$element.height() - this.$top.height() - this.$main.verticalMargins()
    );
  }

  private extractAltoData(altoDoc: Document): LineData[] {
    const textLines = altoDoc.querySelectorAll("TextLine");

    return Array.from(textLines).map((e) => {
      const strings = e.querySelectorAll("String");
      const t = Array.from(strings).map((s) => s.getAttribute("CONTENT"));
      const text = t.join(" ");

      let x = Number(e.getAttribute("HPOS"));
      const y = Number(e.getAttribute("VPOS"));
      const width = Number(e.getAttribute("WIDTH"));
      const height = Number(e.getAttribute("HEIGHT"));

      x =
        x +
        this.offsetX +
        (this.index > 0 ? this.centerPanel.config.options.pageGap : 0);

      this.clipboardText += text + " ";

      return { text, x, y, width, height };
    });
  }

  private extractWebAnnotationData(annotations: Annotation[]): LineData[] {
    console.log("processing ", annotations);
    return annotations
      .map((a) => {
        const bodies = a.getBody();
        if (!bodies || bodies.length === 0) return null;

        const body = bodies[0];
        const text = body.getValue();
        const target = a?.getTarget();

        if (!target) return null;

        const xywh = target.split("#xywh=")[1];

        let baseX: number, y: number, width: number, height: number;

        if (!xywh) {
          // Target is the whole canvas - give 0 dimension.
          baseX = 0;
          y = 0;
          width = 0;
          height = 0;
        } else {
          [baseX, y, width, height] = xywh.split(",").map(Number);
        }

        const x =
          baseX +
          this.offsetX +
          (this.index > 0 ? this.centerPanel.config.options.pageGap : 0);

        this.clipboardText += text + " ";

        return { text, x, y, width, height };
      })
      .filter((line): line is LineData => line !== null);
  }

  private createLineElements(
    lineDataArray: LineData[],
    canvasIndex: number
  ): JQuery[] {
    return lineDataArray.map((lineData, i) => {
      const { text, x, y, width, height } = lineData;

      const line = $(
        `<div id="line-annotation-${canvasIndex}-${i}" class="lineAnnotation" tabindex="0"></div>`
      ).text(text);

      if (!this.extension.isMobile()) {
        // Create overlay rectangle
        const div = $(
          `<div id="line-annotation-${canvasIndex}-${i}" class="lineAnnotationRect" ` +
            `data-x="${x}" data-y="${y}" ` +
            `data-width="${width}" data-height="${height}" tabindex="0"></div>`
        ).attr("title", text);

        this.attachLineEventHandlers(div, line);

        // Add overlay to OpenSeadragon canvas
        const osRect = new OpenSeadragon.Rect(x, y, width, height);
        (<OpenSeadragonExtension>this.extension).centerPanel.viewer.addOverlay(
          div[0],
          osRect
        );
      }

      return line;
    });
  }

  private attachLineEventHandlers(div: JQuery, line: JQuery): void {
    const handleClick = (target: HTMLElement) => {
      const canvasIndex = Number(target.getAttribute("id")!.split("-")[2]);
      if (canvasIndex !== this.currentCanvasIndex) {
        this.extension.helper.canvasIndex = canvasIndex;
        this.currentCanvasIndex = canvasIndex;
      }

      this.clearLineAnnotationRects();
      this.clearLineAnnotations();
      this.setCurrentLineAnnotation(target, true);
      this.setCurrentLineAnnotationRect(target);
    };

    // Div (overlay) handlers
    div.on("keydown", (e: any) => {
      if (e.keyCode === 13) $(e.target).trigger("click");
    });
    div.on("click", (e: any) => handleClick(e.target));

    // Line (text) handlers
    line.on("keydown", (e: any) => {
      if (e.keyCode === 13) $(e.target).trigger("click");
    });
    line.on("click", (e: any) => handleClick(e.currentTarget));
  }

  private renderTranscribedText(lines: JQuery[], header?: string): void {
    if (!this.$transcribedText) {
      this.$transcribedText = $('<div class="transcribed-text"></div>');
    }

    if (header) {
      this.$transcribedText.append($(`<div class="label">${header}</div>`));
    }

    if (lines.length > 0) {
      this.$transcribedText.append(lines);
      this.$transcribedText.attr("data-text", this.clipboardText.trimEnd());
    } else {
      this.$transcribedText.append(
        $(`<div>${this.content.textNotFound}</div>`)
      );
    }

    if (
      this.$transcribedText[0]?.firstElementChild?.firstChild?.toString().trim()
    ) {
      this.$spinner.hide();
    }

    this.$main.append(this.$transcribedText);

    // Restore previously selected annotation
    if (this.$existingAnnotation[0] !== undefined) {
      const id = $(this.$existingAnnotation).attr("id");
      if ($("div#" + id).length > 0) {
        this.setCurrentLineAnnotation($("div#" + id)[0], true);
        this.setCurrentLineAnnotationRect($("div#" + id)[0]);
      }
    }
  }

  private showSpinner(): void {
    this.$spinner = $('<div class="spinner"></div>');
    this.$spinner.css(
      "top",
      this.$main.height() / 2 - this.$spinner.height() / 2
    );
    this.$main.append(this.$spinner);
    this.$spinner.show();
  }

  processAltoFile = async (
    altoUrl: string,
    canvasIndex: number,
    header?: string
  ): Promise<void> => {
    this.showSpinner();

    try {
      const response = await fetch(altoUrl);
      const data = await response.text();
      const altoDoc = new DOMParser().parseFromString(data, "application/xml");

      const lineDataArray = this.extractAltoData(altoDoc);
      const lines = this.createLineElements(lineDataArray, canvasIndex);

      this.renderTranscribedText(lines, header);
    } catch (error) {
      throw new Error("Unable to fetch Alto file: " + error.message);
    }
  };

  processWebAnnotations = async (
    annotations: AnnotationPage[],
    canvasIndex: number,
    header?: string
  ): Promise<void> => {
    this.showSpinner();

    try {
      for (const annotationPageRef of annotations) {
        let annotationPage: AnnotationPage;

        // Check if annotations are embedded or referenced
        const embeddedAnnotations = annotationPageRef.getAnnotations();

        if (embeddedAnnotations && embeddedAnnotations.length > 0) {
          // Annotations are embedded
          annotationPage = annotationPageRef;
        } else if (annotationPageRef.id) {
          // Annotations are referenced
          const response = await fetch(annotationPageRef.id);
          const annotationPageData = await response.json();

          const options: IManifestoOptions = <IManifestoOptions>{
            locale: this.extension.helper.options.locale ?? "en-GB",
          };

          annotationPage = new AnnotationPage(annotationPageData, options);
        } else {
          // No annotations
          continue;
        }

        const annotationsList = annotationPage.getAnnotations();

        if (annotationsList && annotationsList.length > 0) {
          const lineDataArray = this.extractWebAnnotationData(annotationsList);
          const lines = this.createLineElements(lineDataArray, canvasIndex);

          this.renderTranscribedText(lines, header);
        }
      }
    } catch (error) {
      console.error("Error processing annotations:", error);
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

  //this styles the annotation on the OSD canvas. BUT it doesn't bring that rect into view if it's currently off screen. do we want that?
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
