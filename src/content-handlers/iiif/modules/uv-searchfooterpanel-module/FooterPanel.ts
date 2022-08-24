const $ = window.$;
import { AutoComplete } from "../uv-shared-module/AutoComplete";
import { IIIFEvents } from "../../IIIFEvents";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { AnnotationResults } from "../uv-shared-module/AnnotationResults";
import { sanitize } from "../../../../Utils";
import { Bools, Strings } from "@edsilv/utils";
import * as KeyCodes from "@edsilv/key-codes";
import { AnnotationGroup } from "@iiif/manifold";
import { Canvas, LanguageMap } from "manifesto.js";

export class FooterPanel extends BaseFooterPanel {
  $clearSearchResultsButton: JQuery;
  $line: JQuery;
  $nextResultButton: JQuery;
  $pagePositionLabel: JQuery;
  $pagePositionMarker: JQuery;
  $placemarkerDetails: JQuery;
  $placemarkerDetailsBottom: JQuery;
  $placemarkerDetailsTop: JQuery;
  $previousResultButton: JQuery;
  $printButton: JQuery;
  $searchButton: JQuery;
  $searchContainer: JQuery;
  $searchLabel: JQuery;
  $searchOptions: JQuery;
  $searchPagerContainer: JQuery;
  $searchPagerControls: JQuery;
  $searchResultsContainer: JQuery;
  $searchResultsInfo: JQuery;
  $searchText: JQuery;
  $searchTextContainer: JQuery;

  currentPlacemarkerIndex: number;
  placemarkerTouched: boolean = false;
  terms: string;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("searchFooterPanel");

    super.create();

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      this.canvasIndexChanged();
      this.setCurrentSearchResultPlacemarker();
      this.updatePrevButton();
      this.updateNextButton();
    });

    this.extensionHost.subscribe(IIIFEvents.CLEAR_ANNOTATIONS, () => {
      this.clearSearchResults();
    });

    // todo: this should be a setting
    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.MODE_CHANGE,
      () => {
        this.settingsChanged();
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.SEARCH,
      (terms: string) => {
        this.terms = terms;
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.ANNOTATIONS,
      (annotationResults: AnnotationResults) => {
        if (annotationResults.annotations.length) {
          this.displaySearchResults(
            annotationResults.annotations,
            annotationResults.terms
          );
          this.setCurrentSearchResultPlacemarker();
          this.updatePrevButton();
          this.updateNextButton();
        }
      }
    );

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_EMPTY, () => {
      this.hideSearchSpinner();
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATION_CHANGE, () => {
      this.updatePrevButton();
      this.updateNextButton();
    });

    this.$printButton = $(`
          <button class="print btn imageBtn" title="${this.content.print}" tabindex="0">
            <i class="uv-icon uv-icon-print" aria-hidden="true"></i>${this.content.print}
          </button>
        `);
    this.$options.prepend(this.$printButton);

    // search input.
    this.$searchContainer = $('<div class="search"></div>');
    this.$element.prepend(this.$searchContainer);

    this.$searchOptions = $('<div class="searchOptions"></div>');
    this.$searchContainer.append(this.$searchOptions);

    this.$searchLabel = $(
      '<label class="label" for="searchWithinInput">' +
        this.content.searchWithin +
        "</label>"
    );
    this.$searchOptions.append(this.$searchLabel);

    this.$searchTextContainer = $('<div class="searchTextContainer"></div>');
    this.$searchOptions.append(this.$searchTextContainer);

    this.$searchText = $(
      '<input class="searchText" id="searchWithinInput" autocomplete="off" type="text" maxlength="100" value="' +
        this.content.enterKeyword +
        '" aria-label="' +
        this.content.searchWithin +
        '"/>'
    );
    this.$searchTextContainer.append(this.$searchText);

    this.$searchButton = $(
      '<button class="imageButton searchButton"></button>'
    );
    this.$searchTextContainer.append(this.$searchButton);

    // search results.
    this.$searchPagerContainer = $('<div class="searchPager"></div>');
    this.$element.prepend(this.$searchPagerContainer);

    this.$searchPagerControls = $('<div class="controls"></div>');
    this.$searchPagerContainer.prepend(this.$searchPagerControls);

    this.$previousResultButton = $(
      '<button class="previousResult">' +
        this.content.previousResult +
        "</button>"
    );
    this.$searchPagerControls.append(this.$previousResultButton);

    this.$searchResultsInfo = $(
      '<div class="searchResultsInfo"><span class="info"><span class="number">x</span> <span class="foundFor"></span> \'<span class="terms">y</span>\'</span></div>'
    );
    this.$searchPagerControls.append(this.$searchResultsInfo);

    this.$clearSearchResultsButton = $(
      '<button class="clearSearch">' + this.content.clearSearch + "</button>"
    );
    this.$searchResultsInfo.append(this.$clearSearchResultsButton);

    this.$nextResultButton = $(
      '<button class="nextResult">' + this.content.nextResult + "</button>"
    );
    this.$searchPagerControls.append(this.$nextResultButton);

    // placemarker line.
    this.$searchResultsContainer = $('<div class="searchResults"></div>');
    this.$element.prepend(this.$searchResultsContainer);

    this.$line = $('<div class="line"></div>');
    this.$searchResultsContainer.append(this.$line);

    this.$pagePositionMarker = $('<div class="positionPlacemarker"></div>');
    this.$searchResultsContainer.append(this.$pagePositionMarker);

    this.$pagePositionLabel = $('<div class="label"></div>');
    this.$searchResultsContainer.append(this.$pagePositionLabel);

    this.$placemarkerDetails = $('<div class="placeMarkerDetails"></div>');
    this.$searchResultsContainer.append(this.$placemarkerDetails);

    this.$placemarkerDetailsTop = $(
      `<div role="heading" class="heading"></div>`
    );
    this.$placemarkerDetails.append(this.$placemarkerDetailsTop);

    this.$placemarkerDetailsBottom = $("<p></p>");
    this.$placemarkerDetails.append(this.$placemarkerDetailsBottom);

    // initialise ui.
    this.$searchPagerContainer.hide();
    this.$placemarkerDetails.hide();

    // ui event handlers.
    var that = this;

    this.$searchButton.on("click", (e: any) => {
      e.preventDefault();
      this.search(this.$searchText.val());
    });

    this.$searchText.on("focus", () => {
      // clear initial text.
      if (this.$searchText.val() === this.content.enterKeyword)
        this.$searchText.val("");
    });

    this.$placemarkerDetails.on("mouseover", () => {
      that.extensionHost.publish(
        OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START,
        this.currentPlacemarkerIndex
      );
    });

    this.$placemarkerDetails.on("mouseleave", function() {
      $(this).hide();

      that.extensionHost.publish(
        OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH
      );

      // reset all placemarkers.
      var placemarkers = that.getSearchResultPlacemarkers();
      placemarkers.removeClass("hover");
    });

    this.onAccessibleClick(this.$placemarkerDetails, () => {
      that.extensionHost.publish(
        IIIFEvents.CANVAS_INDEX_CHANGE,
        this.currentPlacemarkerIndex
      );
    });

    this.$previousResultButton.on("click", (e: any) => {
      e.preventDefault();
      if (this.isPreviousButtonEnabled()) {
        that.extensionHost.publish(
          OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT
        );
      }
    });

    this.$nextResultButton.on("click", (e: any) => {
      e.preventDefault();
      if (this.isNextButtonEnabled()) {
        that.extensionHost.publish(
          OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT
        );
      }
    });

    this.$clearSearchResultsButton.on("click", (e: any) => {
      e.preventDefault();
      that.extensionHost.publish(IIIFEvents.CLEAR_ANNOTATIONS);
    });

    // hide search options if not enabled/supported.
    if (!this.isSearchEnabled()) {
      this.$searchContainer.hide();
      this.$searchPagerContainer.hide();
      this.$searchResultsContainer.hide();
      this.$element.addClass("min");
    }

    if (this.extension.helper.getTotalCanvases() === 1) {
      this.$searchResultsContainer.hide();
    }

    const autocompleteService: string | null = (<OpenSeadragonExtension>(
      this.extension
    )).getAutoCompleteUri();

    if (autocompleteService) {
      new AutoComplete(
        this.$searchText,
        (terms: string, cb: (results: string[]) => void) => {
          fetch(Strings.format(autocompleteService, terms))
            .then((response) => response.json())
            .then((results) => {
              cb(results);
            });
        },
        (results: any) => {
          return $.map(results.terms, (result: any) => {
            return result.match;
          });
        },
        (terms: string) => {
          this.search(terms);
        },
        300,
        2,
        true,
        Bools.getBool(this.options.autocompleteAllowWords, false)
      );
    } else {
      this.$searchText.on("keyup", (e) => {
        if (e.keyCode === KeyCodes.KeyDown.Enter) {
          that.search(that.$searchText.val());
        }
      });
    }

    this.$printButton.onPressed(() => {
      that.extensionHost.publish(OpenSeadragonExtensionEvents.PRINT);
    });

    this.updatePrintButton();

    var positionMarkerEnabled: boolean = Bools.getBool(
      this.config.options.positionMarkerEnabled,
      true
    );

    if (!positionMarkerEnabled) {
      this.$pagePositionMarker.hide();
      this.$pagePositionLabel.hide();
    }
  }

  isSearchEnabled(): boolean {
    return (<OpenSeadragonExtension>this.extension).isSearchEnabled();
  }

  isZoomToSearchResultEnabled(): boolean {
    return Bools.getBool(
      this.extension.data.config.options.zoomToSearchResultEnabled,
      true
    );
  }

  isPreviousButtonEnabled(): boolean {
    const currentCanvasIndex: number = this.extension.helper.canvasIndex;
    const firstSearchResultCanvasIndex: number = this.getFirstSearchResultCanvasIndex();
    const currentSearchResultRectIndex: number = this.getCurrentSearchResultRectIndex();

    // if zoom to search result is enabled and there is a highlighted search result.
    if (
      this.isZoomToSearchResultEnabled() &&
      (<OpenSeadragonExtension>this.extension).currentAnnotationRect
    ) {
      if (currentCanvasIndex < firstSearchResultCanvasIndex) {
        return false;
      } else if (currentCanvasIndex === firstSearchResultCanvasIndex) {
        if (currentSearchResultRectIndex === 0) {
          return false;
        }
      }

      return true;
    }

    return currentCanvasIndex > firstSearchResultCanvasIndex;
  }

  isNextButtonEnabled(): boolean {
    const currentCanvasIndex: number = this.extension.helper.canvasIndex;
    const lastSearchResultCanvasIndex: number = this.getLastSearchResultCanvasIndex();
    const currentSearchResultRectIndex: number = this.getCurrentSearchResultRectIndex();

    // if zoom to search result is enabled and there is a highlighted search result.
    if (
      this.isZoomToSearchResultEnabled() &&
      (<OpenSeadragonExtension>this.extension).currentAnnotationRect
    ) {
      if (currentCanvasIndex > lastSearchResultCanvasIndex) {
        return false;
      } else if (currentCanvasIndex === lastSearchResultCanvasIndex) {
        if (
          currentSearchResultRectIndex === this.getLastSearchResultRectIndex()
        ) {
          return false;
        }
      }

      return true;
    }

    return currentCanvasIndex < lastSearchResultCanvasIndex;
  }

  getSearchResults(): AnnotationGroup[] {
    return (<OpenSeadragonExtension>this.extension).annotations;
  }

  getCurrentSearchResultRectIndex(): number {
    return (<OpenSeadragonExtension>(
      this.extension
    )).getCurrentAnnotationRectIndex();
  }

  getFirstSearchResultCanvasIndex(): number {
    const searchResults: AnnotationGroup[] | null = this.getSearchResults();
    if (!searchResults || !searchResults.length) return -1;
    let firstSearchResultCanvasIndex: number = searchResults[0].canvasIndex;
    return firstSearchResultCanvasIndex;
  }

  getLastSearchResultCanvasIndex(): number {
    const searchResults: AnnotationGroup[] | null = this.getSearchResults();
    if (!searchResults || !searchResults.length) return -1;
    let lastSearchResultCanvasIndex: number =
      searchResults[searchResults.length - 1].canvasIndex;
    return lastSearchResultCanvasIndex;
  }

  getLastSearchResultRectIndex(): number {
    return (<OpenSeadragonExtension>(
      this.extension
    )).getLastAnnotationRectIndex();
  }

  updateNextButton(): void {
    const searchResults: AnnotationGroup[] | null = this.getSearchResults();

    if (searchResults && searchResults.length) {
      if (this.isNextButtonEnabled()) {
        this.$nextResultButton.removeClass("disabled");
      } else {
        this.$nextResultButton.addClass("disabled");
      }
    }
  }

  updatePrevButton(): void {
    const searchResults: AnnotationGroup[] | null = this.getSearchResults();

    if (searchResults && searchResults.length) {
      if (this.isPreviousButtonEnabled()) {
        this.$previousResultButton.removeClass("disabled");
      } else {
        this.$previousResultButton.addClass("disabled");
      }
    }
  }

  updatePrintButton(): void {
    const configEnabled: boolean = Bools.getBool(
      this.options.printEnabled,
      false
    );
    //var printService: manifesto.Service = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());

    //if (configEnabled && printService && this.extension.isOnHomeDomain()){
    if (configEnabled) {
      this.$printButton.show();
    } else {
      this.$printButton.hide();
    }
  }

  search(terms: string): void {
    this.terms = terms;

    if (this.terms === "" || this.terms === this.content.enterKeyword) {
      this.extension.showMessage(
        this.extension.data.config.modules.genericDialogue.content.emptyValue,
        function() {
          this.$searchText.focus();
        }
      );

      return;
    }

    // blur search field
    this.$searchText.blur();

    this.showSearchSpinner();

    this.extensionHost.publish(OpenSeadragonExtensionEvents.SEARCH, this.terms);
  }

  getSearchResultPlacemarkers(): JQuery {
    return this.$searchResultsContainer.find(".searchResultPlacemarker");
  }

  setCurrentSearchResultPlacemarker(): void {
    const placemarkers: JQuery = this.getSearchResultPlacemarkers();
    placemarkers
      .parent()
      .find(".current")
      .removeClass("current");
    const $current: JQuery = $(
      '.searchResultPlacemarker[data-index="' +
        this.extension.helper.canvasIndex +
        '"]'
    );
    $current.addClass("current");
  }

  positionSearchResultPlacemarkers(): void {
    const searchResults: AnnotationGroup[] | null = this.getSearchResults();

    if (!searchResults || !searchResults.length) return;

    // clear all existing placemarkers
    const placemarkers: JQuery = this.getSearchResultPlacemarkers();
    const shouldFocus = placemarkers.length === 0;
    placemarkers.remove();

    const pageWidth = this.getPageLineRatio();
    const lineTop = this.$line.position().top;
    const lineLeft = this.$line.position().left;

    const that = this;

    // for each page with a result, place a marker along the line.
    for (let i = 0; i < searchResults.length; i++) {
      const result: AnnotationGroup = searchResults[i];
      const distance: number = result.canvasIndex * pageWidth;
      const $placemarker: JQuery = $(
        '<div class="searchResultPlacemarker" tabindex="0" data-index="' +
          result.canvasIndex +
          '"></div>'
      );

      ($placemarker[0] as any).ontouchstart = function(e: any) {
        that.onPlacemarkerTouchStart.call(this, that);
      };
      $placemarker.click(function(e: any) {
        that.onPlacemarkerClick.call(this, that);
      });
      $placemarker.mouseenter(function(e: any) {
        that.onPlacemarkerMouseEnter.call(this, that);
      });
      // todo: this causes the placemarker to appear after a search
      // $placemarker.focus(function(e: any) {
      //   that.onPlacemarkerMouseEnter.call(this, that);
      // });
      this.onAccessibleClick(
        $placemarker,
        (e) => {
          that.extensionHost.publish(
            IIIFEvents.CANVAS_INDEX_CHANGE,
            this.currentPlacemarkerIndex
          );
          that.onPlacemarkerMouseLeave.call(this, e, that);
        },
        false
      );
      $placemarker.mouseleave(function(e: any) {
        that.onPlacemarkerMouseLeave.call(this, e, that);
      });
      $placemarker.blur(function(e: any) {
        that.onPlacemarkerMouseLeave.call(this, e, that);
      });

      this.$searchResultsContainer.append($placemarker);

      const top: number = lineTop - $placemarker.height();
      const left: number = lineLeft + distance - $placemarker.width() / 2;

      $placemarker.css({
        top: top,
        left: left,
      });

      if (i === 0 && shouldFocus) {
        $placemarker.focus();
      }
    }
  }

  onPlacemarkerTouchStart(that: any): void {
    that.placemarkerTouched = true;

    //const $placemarker: JQuery = $(this);
    //const index: number = parseInt($placemarker.attr('data-index'));

    //this.extensionHost.publish(Events.VIEW_PAGE, [index]);
  }

  onPlacemarkerClick(that: any): void {
    if (that.placemarkerTouched) return;

    that.placemarkerTouched = false;

    //const $placemarker: JQuery = $(this);
    //const index: number = parseInt($placemarker.attr('data-index'));

    //this.extensionHost.publish(Events.VIEW_PAGE, [index]);
  }

  onPlacemarkerMouseEnter(that: any): void {
    if (that.placemarkerTouched) return;

    const $placemarker: JQuery = $(this);

    $placemarker.addClass("hover");

    const canvasIndex: number = parseInt($placemarker.attr("data-index"));

    that.extensionHost.publish(
      OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START,
      canvasIndex
    );

    const $placemarkers: JQuery = that.getSearchResultPlacemarkers();
    const elemIndex: number = $placemarkers.index($placemarker[0]);

    that.currentPlacemarkerIndex = canvasIndex;

    that.$placemarkerDetails.show();

    let title: string = "{0} {1}";

    if (that.isPageModeEnabled()) {
      const canvas: Canvas = that.extension.helper.getCanvasByIndex(
        canvasIndex
      );
      let label: string | null = LanguageMap.getValue(canvas.getLabel());

      if (!label && that.extension.helper.manifest) {
        label = that.extension.helper.manifest.options.defaultLabel;
      }

      if (label) {
        title = Strings.format(title, that.content.pageCaps, label);
      }
    } else {
      title = Strings.format(
        title,
        that.content.imageCaps,
        String(canvasIndex + 1)
      );
    }

    that.$placemarkerDetailsTop.html(title);

    const searchResults: AnnotationGroup[] | null = that.getSearchResults();

    if (searchResults) {
      const result: AnnotationGroup = searchResults[elemIndex];

      let terms: string = "";

      if (that.terms) {
        terms = Strings.ellipsis(
          that.terms,
          that.options.elideDetailsTermsCount
        );
      }

      let instanceFoundText: string = that.content.instanceFound;
      let instancesFoundText: string = that.content.instancesFound;
      let text: string = "";

      if (result.rects.length === 1) {
        text = Strings.format(instanceFoundText, terms);
        that.$placemarkerDetailsBottom.html(text);
      } else {
        text = Strings.format(
          instancesFoundText,
          String(result.rects.length),
          terms
        );
        that.$placemarkerDetailsBottom.html(text);
      }
    }

    const pos: any = $placemarker.position();

    let top: number = pos.top - that.$placemarkerDetails.height();
    let left: number = pos.left;

    if (left < that.$placemarkerDetails.width() / 2) {
      left = 0 - $placemarker.width() / 2;
    } else if (
      left >
      that.$line.width() - that.$placemarkerDetails.width() / 2
    ) {
      left =
        that.$line.width() -
        that.$placemarkerDetails.width() +
        $placemarker.width() / 2;
    } else {
      left -= that.$placemarkerDetails.width() / 2;
    }

    that.$placemarkerDetails.css({
      top: top,
      left: left,
    });
  }

  onPlacemarkerMouseLeave(e: any, that: any): void {
    that.extensionHost.publish(
      OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH
    );

    const $placemarker: JQuery = $(this);
    const newElement: Element = e.toElement || e.relatedTarget;
    const isChild: number = $(newElement).closest(that.$placemarkerDetails)
      .length;

    if (newElement != that.$placemarkerDetails.get(0) && isChild === 0) {
      that.$placemarkerDetails.hide();
      $placemarker.removeClass("hover");
    }
  }

  setPageMarkerPosition(): void {
    if (this.extension.helper.canvasIndex === null) return;

    // position placemarker showing current page.
    const pageLineRatio: number = this.getPageLineRatio();
    const lineTop: number = this.$line.position().top;
    const lineLeft: number = this.$line.position().left;

    const position: number = this.extension.helper.canvasIndex * pageLineRatio;
    const top: number = lineTop;
    let left: number = lineLeft + position;

    this.$pagePositionMarker.css({
      top: top,
      left: left,
    });

    // if the remaining distance to the right is less than the width of the label
    // shift it to the left.
    const lineWidth: number = this.$line.width();

    if (left + this.$pagePositionLabel.outerWidth(true) > lineWidth) {
      left -= this.$pagePositionLabel.outerWidth(true);
      this.$pagePositionLabel.removeClass("right");
      this.$pagePositionLabel.addClass("left");
    } else {
      this.$pagePositionLabel.removeClass("left");
      this.$pagePositionLabel.addClass("right");
    }

    this.$pagePositionLabel.css({
      top: top,
      left: left,
    });
  }

  clearSearchResults(): void {
    if (!this.isSearchEnabled()) {
      return;
    }

    // clear all existing placemarkers
    const $placemarkers: JQuery = this.getSearchResultPlacemarkers();
    $placemarkers.remove();

    // clear search input field.
    this.$searchText.val(this.content.enterKeyword);

    // hide pager.
    this.$searchContainer.show();
    this.$searchPagerContainer.hide();

    // set focus to search box.
    this.$searchText.focus();
  }

  getPageLineRatio(): number {
    const lineWidth: number = this.$line.width();

    // find page/width ratio by dividing the line width by the number of pages in the book.
    if (this.extension.helper.getTotalCanvases() === 1) return 0;

    return lineWidth / (this.extension.helper.getTotalCanvases() - 1);
  }

  canvasIndexChanged(): void {
    this.setPageMarkerPosition();
    this.setPlacemarkerLabel();
  }

  settingsChanged(): void {
    this.setPlacemarkerLabel();
  }

  setPlacemarkerLabel(): void {
    const displaying: string = this.content.displaying;
    const index: number = this.extension.helper.canvasIndex;

    if (this.isPageModeEnabled()) {
      const canvas: Canvas = this.extension.helper.getCanvasByIndex(index);
      let label: string | null = LanguageMap.getValue(canvas.getLabel());

      if (!label) {
        label = this.content.defaultLabel;
      }

      const lastCanvasOrderLabel:
        | string
        | null = this.extension.helper.getLastCanvasLabel(true);

      if (lastCanvasOrderLabel) {
        this.$pagePositionLabel.html(
          Strings.format(
            displaying,
            this.content.page,
            sanitize(<string>label),
            sanitize(<string>lastCanvasOrderLabel)
          )
        );
      }
    } else {
      this.$pagePositionLabel.html(
        Strings.format(
          displaying,
          this.content.image,
          String(index + 1),
          this.extension.helper.getTotalCanvases().toString()
        )
      );
    }
  }

  isPageModeEnabled(): boolean {
    return (
      this.config.options.pageModeEnabled &&
      (<OpenSeadragonExtension>this.extension).getMode().toString() ===
        Mode.page.toString() &&
      !Bools.getBool(this.config.options.forceImageMode, false)
    );
  }

  showSearchSpinner(): void {
    this.$searchText.addClass("searching");
  }

  hideSearchSpinner(): void {
    this.$searchText.removeClass("searching");
  }

  displaySearchResults(results: AnnotationGroup[], terms?: string): void {
    if (!this.isSearchEnabled()) {
      return;
    }

    this.hideSearchSpinner();
    this.positionSearchResultPlacemarkers();

    // show pager.
    this.$searchContainer.hide();

    this.$searchPagerControls.css({
      left: 0,
    });

    const $info: JQuery = this.$searchResultsInfo.find(".info");
    const $number: JQuery = $info.find(".number");
    const $foundFor: JQuery = $info.find(".foundFor");
    const $terms: JQuery = $info.find(".terms");

    if (terms) {
      $info.show();

      $number.text(
        (<OpenSeadragonExtension>this.extension).getTotalAnnotationRects()
      );

      if (results.length === 1) {
        $foundFor.html(this.content.resultFoundFor);
      } else {
        $foundFor.html(this.content.resultsFoundFor);
      }

      $terms.html(Strings.ellipsis(terms, this.options.elideResultsTermsCount));
      $terms.prop("title", terms);
    } else {
      $info.hide();
    }

    this.$searchPagerContainer.show();

    this.resize();
  }

  resize(): void {
    super.resize();

    const searchResults: AnnotationGroup[] | null = this.getSearchResults();

    if (searchResults && searchResults.length) {
      this.positionSearchResultPlacemarkers();
    }

    this.setPageMarkerPosition();

    this.$searchPagerContainer.width(this.$element.width());

    const center: number = this.$element.width() / 2;

    // position search pager controls.
    this.$searchPagerControls.css({
      left: center - this.$searchPagerControls.width() / 2,
    });

    // position search input.
    this.$searchOptions.css({
      left: center - this.$searchOptions.outerWidth() / 2,
    });
  }
}
