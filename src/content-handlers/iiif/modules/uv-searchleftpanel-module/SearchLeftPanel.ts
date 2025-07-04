const $ = require("jquery");
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { SearchLeftPanel as SearchLeftPanelConfig } from "../../extensions/uv-openseadragon-extension/config/Config";
import { Events } from "../../../../Events";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IIIFEvents } from "../../IIIFEvents";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { AnnotationRect } from "@iiif/manifold";
import { AnnotationResults } from "../uv-shared-module/AnnotationResults";
import { SearchHit } from "../uv-shared-module/SearchHit";
import { Keyboard, Strings } from "@edsilv/utils";
import * as KeyCodes from "@edsilv/key-codes";
import { URLAdapter } from "../../URLAdapter";
import { XYWHFragment } from "../uv-shared-module/XYWHFragment";

export class SearchLeftPanel extends LeftPanel<SearchLeftPanelConfig> {
  $searchButton: JQuery;
  $searchContainer: JQuery;
  $searchResultContainer: JQuery;
  $searchLabel: JQuery;
  $searchOptions: JQuery;
  $searchTextContainer: JQuery;
  $searchText: JQuery;
  $spinner: JQuery;
  $clearButton: JQuery;
  $searchHitsContainer: JQuery;
  $searchHitsLabel: JQuery;
  $searchPagerContainer: JQuery;
  $searchPagerPrevButton: JQuery;
  $searchPagerLabel: JQuery;
  $searchPagerNextButton: JQuery;
  terms: string;
  currentAnnotationRect: AnnotationRect | undefined;
  currentCanvasTitle: string | null;
  currentHitIndex: number;
  currentHits: number;
  urlAdapter: URLAdapter;
  q: string | null | undefined;
  hi: number | null | undefined;
  xywh: string | null | undefined;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("searchLeftPanel");
    super.create();

    this.$main.html("");
    this.setTitle(this.config.content.title);

    this.urlAdapter = new URLAdapter(false);
    this.q = this.urlAdapter.get("q");
    this.hi = this.urlAdapter.get("hi");
    this.xywh = this.urlAdapter.get("xywh");

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_EMPTY, () => {
      this.hideSearchSpinner();
      this.$clearButton.show();
      this.$searchText.focus();
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_LOADED, () => {
      // This is a new event so we can highlight the current annotation, after they're all loaded.
      this.setCurrentAnnotation(
        this.currentAnnotationRect?.canvasIndex,
        this.currentAnnotationRect?.index
      );
    });

    this.extensionHost.subscribe(
      IIIFEvents.ANNOTATIONS,
      (annotationResults: AnnotationResults) => {
        this.$searchHitsContainer.show();
        this.$searchPagerContainer.show();
        if (annotationResults.annotations.length) {
          this.currentHits = Number(annotationResults.searchHits?.length);
          const instanceFoundText: string = this.content.instanceFound;
          const instancesFoundText: string = this.content.instancesFound;
          let text: string = "";
          if (
            annotationResults.searchHits?.length === 1 &&
            annotationResults.terms !== undefined
          ) {
            text = Strings.format(instanceFoundText, annotationResults.terms);
            this.$searchHitsLabel.html(text);
          } else if (annotationResults.terms !== undefined) {
            text = Strings.format(
              instancesFoundText,
              String(annotationResults.searchHits?.length),
              annotationResults.terms
            );
            this.$searchHitsLabel.html(text);
          }

          this.$clearButton.show();
          this.displaySearchResults(annotationResults.searchHits);
          this.currentAnnotationRect = (<OpenSeadragonExtension>(
            this.extension
          )).annotations[0].rects[0];
          this.currentHitIndex = 1;
          this.extensionHost.publish(IIIFEvents.ANNOTATION_CANVAS_CHANGE, [
            (<OpenSeadragonExtension>this.extension).annotations[0].rects[0],
          ]);

          let hitIndex = 1;

          // we have loaded the viewer with a search result and hit index
          // so make sure it's the hit shown
          if (this.hi !== undefined && this.hi !== null) {
            const div = $(
              '.searchHitNumberSpan[data-index="' + this.hi + '"]'
            ).parent();
            div.trigger("click");
            hitIndex = this.hi;
            const canvasIndex = $(div).attr("data-canvas-index");
            const index = $(div).attr("data-index");
            const currentRect = (<OpenSeadragonExtension>(
              this.extension
            )).annotations.find((e) => {
              return e["canvasIndex"] == canvasIndex;
            })?.rects[index];
            if (currentRect !== null && currentRect !== undefined) {
              this.currentAnnotationRect = currentRect;
            }
            // we need to clear these
            this.hi = undefined;
            this.q = "";
          }
          this.extensionHost.publish(Events.SEARCH_HIT_CHANGED, [
            {
              hitIndex: hitIndex,
              rectIndex: this.currentAnnotationRect.index,
              canvasIndex: this.currentAnnotationRect.canvasIndex,
            },
          ]);
        } else {
          this.$searchHitsLabel.html(this.content.noMatches);
        }
      }
    );

    this.extensionHost.subscribe(IIIFEvents.ANNOTATION_CANVAS_CHANGE, (e) => {
      let currentCanvasIndex: number = 0;
      let index: number = 0;
      if (e !== null) {
        this.currentAnnotationRect = e[0];
        currentCanvasIndex = e[0].canvasIndex;
        index = e[0].index;
      }
      this.canvasIndexChanged(currentCanvasIndex, index);
    });

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, (e) => {
      const canvasIndex = e;
      const index = this.currentAnnotationRect?.index ?? 1;
      this.extensionHost.publish(Events.SEARCH_HIT_CHANGED, [
        {
          hitIndex: this.currentHitIndex,
          rectIndex: index,
          canvasIndex: canvasIndex,
        },
      ]);
      this.canvasIndexChanged(canvasIndex, Number(index));
      this.currentAnnotationRect = (<OpenSeadragonExtension>(
        this.extension
      )).annotations.find((e) => {
        return e["canvasIndex"] == canvasIndex;
      })?.rects[0];
    });

    this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, (e) => {
      if (
        $(
          'div.searchHit[data-index="0"][data-canvas-index="' +
            e.data.index +
            '"]'
        )[0] !== undefined
      ) {
        const canvasIndex: number = e.data.index;
        this.currentAnnotationRect = (<OpenSeadragonExtension>(
          this.extension
        )).annotations.find((e) => {
          return e["canvasIndex"] == canvasIndex;
        })?.rects[0];
      } else {
        this.currentAnnotationRect = undefined;
      }
      this.currentHitIndex = 0;
      this.canvasIndexChanged(e.data.index, this.currentHitIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.CLEAR_ANNOTATIONS, (e) => {
      this.$searchResultContainer.html("");
      if (e) {
        this.$searchText.val("");
      }
      this.$searchHitsLabel.text("");
      this.$searchHitsContainer.hide();
      this.$searchPagerContainer.hide();
      this.$clearButton.hide();
      this.$searchText.focus();
      // we need to clear these
      this.hi = undefined;
      this.q = "";
    });

    this.extensionHost.subscribe(Events.SEARCH_HIT_CHANGED, (e) => {
      const searchHitOf: string = this.content.searchHitOf;
      this.currentHitIndex = e[0].hitIndex;
      this.$searchPagerLabel.html(
        Strings.format(
          searchHitOf,
          String(this.currentHitIndex),
          String(this.currentHits)
        )
      );
      this.$searchPagerPrevButton.prop("disabled", false);
      this.$searchPagerNextButton.prop("disabled", false);
      if (this.currentHitIndex == 1) {
        this.$searchPagerPrevButton.prop("disabled", true);
      } else if (this.currentHitIndex == this.currentHits) {
        this.$searchPagerNextButton.prop("disabled", true);
      }
    });

    // search input
    this.$searchContainer = $('<div class="search"></div>');
    this.$main.append(this.$searchContainer);

    this.$searchOptions = $('<div class="searchOptions"></div>');
    this.$searchContainer.append(this.$searchOptions);

    this.$searchLabel = $(
      '<label class="label" for="searchLeftPanelInput">' +
        this.content.searchWithin +
        "</label>"
    );
    this.$searchOptions.append(this.$searchLabel);

    this.$searchTextContainer = $('<div class="searchTextContainer"></div>');
    this.$searchOptions.append(this.$searchTextContainer);

    this.$searchText = $(
      '<input class="searchText" id="searchLeftPanelInput" autocomplete="off" type="text" maxlength="100" placeholder="' +
        this.content.enterKeyword +
        '" value="" aria-label="' +
        this.content.searchWithin +
        '"/>'
    );

    this.$searchTextContainer.append(this.$searchText);

    this.$spinner = $('<span class="spinner"></span>');

    this.$spinner.hide();

    this.$searchTextContainer.append(this.$spinner);

    this.$clearButton = $(
      '<button class="clearButton" title="' +
        this.content.clearSearch +
        '"></button>'
    );
    this.$clearButton.hide();

    this.$searchButton = $(
      '<button class="searchButton"title="' +
        this.content.doSearch +
        '"></button>'
    );

    this.$searchHitsContainer = $('<div class="searchHitsContainer"></div>');
    this.$searchHitsLabel = $('<span class="searchHitsLabel"></span>');
    this.$searchHitsContainer.append(this.$searchHitsLabel);
    this.$searchHitsContainer.hide();

    this.$searchContainer.append(this.$searchHitsContainer);

    this.$searchPagerContainer = $('<div class="searchPagerContainer"></div>');
    this.$searchPagerPrevButton = $(
      '<button class="prev" title="' +
        this.content.previousResult +
        '"></button>'
    );
    this.$searchPagerPrevButton.prop("disabled", true);
    this.$searchPagerLabel = $("<span>0 of 100</span>");
    this.$searchPagerNextButton = $(
      '<button class="next" title="' + this.content.nextResult + '"></button>'
    );
    this.$searchPagerContainer.append(this.$searchPagerPrevButton);
    this.$searchPagerContainer.append(this.$searchPagerLabel);
    this.$searchPagerContainer.append(this.$searchPagerNextButton);
    this.$searchPagerContainer.hide();

    this.$searchContainer.append(this.$searchPagerContainer);

    this.$searchResultContainer = $('<div class="searchResult"></div>');
    this.$main.append(this.$searchResultContainer);

    this.$clearButton.on("click", (e: any) => {
      e.preventDefault();
      this.extensionHost.publish(IIIFEvents.CLEAR_ANNOTATIONS, true);
    });

    this.$searchButton.on("click", (e: any) => {
      e.preventDefault();
      this.search(this.$searchText.val());
    });

    this.$searchText.on("keypress", (e: any) => {
      const originalEvent: KeyboardEvent = <KeyboardEvent>e.originalEvent;
      const charCode: number = Keyboard.getCharCode(originalEvent);
      if (charCode === KeyCodes.KeyDown.Enter) {
        e.preventDefault();
        this.$searchButton.click();
      }
    });

    this.$searchPagerPrevButton.on("click", (e: any) => {
      this.currentHitIndex--;
      $('.searchHitNumberSpan[data-index="' + this.currentHitIndex + '"]')
        .closest("div")[0]
        .scrollIntoView({
          behavior: "instant",
          block: "end",
          inline: "nearest",
        });
      $('.searchHitNumberSpan[data-index="' + this.currentHitIndex + '"]')
        .closest("div")
        .trigger("click");
    });

    this.$searchPagerNextButton.on("click", (e: any) => {
      this.currentHitIndex++;
      $('.searchHitNumberSpan[data-index="' + this.currentHitIndex + '"]')
        .closest("div")[0]
        .scrollIntoView({
          behavior: "instant",
          block: "end",
          inline: "nearest",
        });
      $('.searchHitNumberSpan[data-index="' + this.currentHitIndex + '"]')
        .closest("div")
        .trigger("click");
    });

    this.$searchTextContainer.append(this.$clearButton);
    this.$searchTextContainer.append(this.$searchButton);

    setTimeout(() => {
      if (this.q !== null && this.q !== "" && this.q !== undefined) {
        if (this.xywh) {
          (<OpenSeadragonExtension>(
            this.extension
          )).centerPanel.preserveViewportForQuery = true;
          (<OpenSeadragonExtension>this.extension).centerPanel.queryBounds =
            XYWHFragment.fromString(this.urlAdapter.get("xywh") as string);
        }
        if (!this.extension.isSmMetric()) {
          // this should be removed when we have a search button in mobile view
          this.$expandButton.trigger("click");
        }
        this.$searchText.val(this.q);
        this.$searchButton.trigger("click");
      } else {
        (<OpenSeadragonExtension>(
          this.extension
        )).centerPanel.preserveViewportForQuery = false;
      }
    }, 100); // unfortunately this is needed :-(
  }

  search(terms: string): void {
    this.terms = terms;

    if (this.terms === "") {
      this.extensionHost.publish(IIIFEvents.CLEAR_ANNOTATIONS, false);
      this.extension.showMessage(
        this.extension.data.config!.modules.genericDialogue.content.emptyValue
      );
      this.$searchText.focus();
      return;
    }

    this.$searchHitsLabel.text("");
    this.$searchResultContainer.html("");
    this.$searchText.blur();
    this.showSearchSpinner();
    this.extensionHost.publish(OpenSeadragonExtensionEvents.SEARCH, this.terms);
  }

  showSearchSpinner(): void {
    this.$spinner.show();
  }

  hideSearchSpinner(): void {
    this.$spinner.hide();
  }

  canvasIndexChanged(canvasIndex: number, index: number): void {
    $("div.searchHit").each((i: Number, searchHit: any) => {
      if ($(searchHit).hasClass("current")) {
        $(searchHit).removeClass("current");
        return;
      }
    });
    if (
      $(
        'div.searchHit[data-index="' +
          index +
          '"][data-canvas-index="' +
          canvasIndex +
          '"]'
      )[0] !== undefined
    ) {
      this.setCurrentAnnotation(canvasIndex, index);
      $(
        'div.searchHit[data-index="' +
          index +
          '"][data-canvas-index="' +
          canvasIndex +
          '"]'
      ).addClass("current");
      $(
        'div.searchHit[data-index="' +
          index +
          '"][data-canvas-index="' +
          canvasIndex +
          '"]'
      )[0].scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }
  }

  displaySearchResults(searchHits?: SearchHit[]): void {
    if (searchHits !== undefined) {
      searchHits.forEach((searchHit, i) => {
        const div = $(
          '<div id="searchhit-' +
            searchHit.canvasIndex +
            "-" +
            searchHit.index +
            '" class="searchHit" data-canvas-index="' +
            searchHit.canvasIndex +
            '" data-index="' +
            searchHit.index +
            '" tabindex="0"></div>'
        );
        const canvasTitle = this.extension.helper
          .getCanvasByIndex(searchHit.canvasIndex)
          .getLabel()
          .getValue();
        const hitNumberSpan = $(
          '<span class="searchHitNumberSpan" data-index="' +
            (i + 1) +
            '"></div>'
        );
        hitNumberSpan.append(i + 1);
        const searchHitSpan = $(
          '<span class="searchHitSpan">' + searchHit.match + "</span>"
        );

        div.append(
          hitNumberSpan[0].outerHTML +
            searchHit.before +
            searchHitSpan[0].outerHTML +
            searchHit.after
        );
        $(div).on("keydown", (e: any) => {
          const originalEvent: KeyboardEvent = <KeyboardEvent>e.originalEvent;
          const charCode: number = Keyboard.getCharCode(originalEvent);
          if (charCode === KeyCodes.KeyDown.Enter) {
            e.preventDefault();
            $(e.target).trigger("click");
          }
        });

        $(div, searchHitSpan).on("click", (e: any) => {
          let canvasIndex: number = 0;
          let index: number = 0;
          let hitIndex = 0;

          if (e.target.tagName.toLowerCase() === "span") {
            canvasIndex = $(e.target).closest("div").attr("data-canvas-index");
            index = $(e.target).closest("div").attr("data-index");
            hitIndex = $(e.target)
              .closest("div")
              .find(".searchHitNumberSpan")
              .attr("data-index");
          } else {
            canvasIndex = $(e.target).attr("data-canvas-index");
            index = $(e.target).attr("data-index");
            hitIndex = $(e.target)
              .find(".searchHitNumberSpan")
              .attr("data-index");
          }
          const currentRect = (<OpenSeadragonExtension>(
            this.extension
          )).annotations.find((e) => {
            return e["canvasIndex"] == canvasIndex;
          })?.rects[index];
          this.extensionHost.publish(Events.SEARCH_HIT_CHANGED, [
            {
              hitIndex: hitIndex,
              rectIndex: currentRect?.index,
              canvasIndex: currentRect?.canvasIndex,
            },
          ]);

          if (currentRect !== undefined) {
            if (
              this.currentAnnotationRect !== undefined &&
              currentRect.canvasIndex == this.currentAnnotationRect.canvasIndex
            ) {
              this.canvasIndexChanged(canvasIndex, index);
              return;
            }
            this.currentAnnotationRect = currentRect;
            this.extensionHost.publish(IIIFEvents.ANNOTATION_CANVAS_CHANGE, [
              currentRect,
            ]);
          }
        });

        if (canvasTitle !== this.currentCanvasTitle) {
          this.$searchResultContainer.append(
            $('<div class="canvasTitle">' + canvasTitle + "</div>")
          );
        }
        this.currentCanvasTitle = canvasTitle;
        this.$searchResultContainer.append(div);
      });
      this.$searchText.focus();
    }

    //this.canvasIndexChanged(this.extension.helper.canvasIndex, 0);
    this.hideSearchSpinner();
    this.resize();
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

  resize(): void {
    super.resize();
  }
}
