import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseFooterPanel = require("../uv-shared-module/FooterPanel");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import DownloadDialogue = require("../../extensions/uv-seadragon-extension/DownloadDialogue");
import AutoComplete = require("../uv-shared-module/AutoComplete");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");
import Params = require("../../Params");

class FooterPanel extends BaseFooterPanel {

    $clearSearchResultsButton: JQuery;
    $line: JQuery;
    $nextResultButton: JQuery;
    $pagePositionLabel: JQuery;
    $pagePositionMarker: JQuery;
    $placemarkerDetails: JQuery;
    $placemarkerDetailsBottom: JQuery;
    $placemarkerDetailsTop: JQuery;
    $previousResultButton: JQuery;
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

        this.setConfig('searchFooterPanel');

        super.create();

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasIndexChanged();
        });

        // todo: this should be a setting
        $.subscribe(Commands.MODE_CHANGED, (e, mode) => {
            this.settingsChanged();
        });

        $.subscribe(Commands.SEARCH, (e, terms) => {
            this.terms = terms;
        });

        $.subscribe(Commands.SEARCH_RESULTS, (e, obj) => {
            this.displaySearchResults(obj.terms, obj.results);
        });

        // search input.
        this.$searchContainer = $('<div class="search"></div>');
        this.$element.prepend(this.$searchContainer);

        this.$searchOptions = $('<div class="searchOptions"></div>');
        this.$searchContainer.append(this.$searchOptions);

        this.$searchLabel = $('<span class="label">' + this.content.searchWithin + '</span>');
        this.$searchOptions.append(this.$searchLabel);

        this.$searchTextContainer = $('<div class="searchTextContainer"></div>');
        this.$searchOptions.append(this.$searchTextContainer);

        this.$searchText = $('<input class="searchText" type="text" maxlength="100" value="' + this.content.enterKeyword + '" />');
        this.$searchTextContainer.append(this.$searchText);

        this.$searchButton = $('<a class="imageButton searchButton"></a>');
        this.$searchTextContainer.append(this.$searchButton);

        // search results.
        this.$searchPagerContainer = $('<div class="searchPager"></div>');
        this.$element.prepend(this.$searchPagerContainer);

        this.$searchPagerControls = $('<div class="controls"></div>');
        this.$searchPagerContainer.prepend(this.$searchPagerControls);

        this.$previousResultButton = $('<a class="previousResult" title="' + this.content.previousResult + '">' + this.content.previousResult + '</a>');
        this.$searchPagerControls.append(this.$previousResultButton);

        this.$searchResultsInfo = $('<div class="searchResultsInfo"><span class="number">x</span> <span class="foundFor"></span> \'<span class="terms">y</span>\'</div>');
        this.$searchPagerControls.append(this.$searchResultsInfo);

        this.$clearSearchResultsButton = $('<a class="clearSearch" title="' + this.content.clearSearch + '">' + this.content.clearSearch + '</a>');
        this.$searchResultsInfo.append(this.$clearSearchResultsButton);

        this.$nextResultButton = $('<a class="nextResult" title="' + this.content.nextResult + '">' + this.content.nextResult + '</a>');
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

        this.$placemarkerDetailsTop = $('<h1></h1>');
        this.$placemarkerDetails.append(this.$placemarkerDetailsTop);

        this.$placemarkerDetailsBottom = $('<p></p>');
        this.$placemarkerDetails.append(this.$placemarkerDetailsBottom);

        // initialise ui.
        this.$searchPagerContainer.hide();
        this.$placemarkerDetails.hide();

        // ui event handlers.
        var that = this;

        this.$searchButton.on('click', (e) => {
            e.preventDefault();

            this.search(this.$searchText.val());
        });

        this.$searchText.on('focus', () => {
            // clear initial text.
            if (this.$searchText.val() === this.content.enterKeyword) this.$searchText.val('');
        });

        this.$placemarkerDetails.on('mouseover', () => {
            $.publish(Commands.SEARCH_PREVIEW_START, [this.currentPlacemarkerIndex]);
        });

        this.$placemarkerDetails.on('mouseleave', function() {
            $(this).hide();

            $.publish(Commands.SEARCH_PREVIEW_FINISH);

            // reset all placemarkers.
            var placemarkers = that.getSearchResultPlacemarkers();
            placemarkers.removeClass('hover');
        });

        this.$placemarkerDetails.on('click', (e) => {
            $.publish(Commands.VIEW_PAGE, [this.currentPlacemarkerIndex]);
        });

        this.$previousResultButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Commands.PREV_SEARCH_RESULT);
        });

        this.$nextResultButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Commands.NEXT_SEARCH_RESULT);
        });

        this.$clearSearchResultsButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Commands.CLEAR_SEARCH);
            this.clearSearchResults();
        });

        // hide search options if not enabled/supported.
        if (!(<ISeadragonProvider>this.provider).isSearchWithinEnabled()) {
            this.$searchContainer.hide();
            this.$searchPagerContainer.hide();
            this.$searchResultsContainer.hide();

            this.$element.addClass('min');
        }

        var autocompleteService = (<ISeadragonProvider>this.provider).getAutoCompleteUri();

        if (autocompleteService){

            new AutoComplete(this.$searchText,
                (terms: string, cb: (results: string[]) => void) => {
                    $.getJSON(String.format(autocompleteService, terms), (results: string[]) => {
                        cb(results);
                    });
                },
                (results: any) => {
                    return _.map(results.terms, (result: any) => {
                        return result.match;
                    });
                },
                (terms: string) => {
                    this.search(terms);
                },
                300, 2, true
            );

        }
    }

    search(terms: string): void {

        this.terms = terms;

        if (this.terms === '' || this.terms === this.content.enterKeyword) {
            this.extension.showMessage(this.config.modules.genericDialogue.content.emptyValue, function(){
                    this.$searchText.focus();
                });

            return;
        }

        // blur search field
        this.$searchText.blur();

        $.publish(Commands.SEARCH, [this.terms]);
    }

    getSearchResultPlacemarkers(): JQuery {
        return this.$searchResultsContainer.find('.searchResultPlacemarker');
    }

    positionSearchResultPlacemarkers(): void {

        var results = (<ISeadragonProvider>this.provider).searchResults;

        if (!results.length) return;

        // clear all existing placemarkers
        var placemarkers = this.getSearchResultPlacemarkers();
        placemarkers.remove();

        var pageWidth = this.getPageLineRatio();
        var lineTop = this.$line.position().top;
        var lineLeft = this.$line.position().left;

        var that = this;

        // for each page with a result, place a marker along the line.
        for (var i = 0; i < results.length; i++) {
            var result = results[i];

            var distance = result.canvasIndex * pageWidth;

            var $placemarker = $('<div class="searchResultPlacemarker" data-index="' + result.canvasIndex + '"></div>');

            $placemarker[0].ontouchstart = function (e) { that.onPlacemarkerTouchStart.call(this, that) };
            $placemarker.click(function (e) { that.onPlacemarkerClick.call(this, that) });
            $placemarker.mouseenter(function (e) { that.onPlacemarkerMouseEnter.call(this, that) });
            $placemarker.mouseleave(function (e) { that.onPlacemarkerMouseLeave.call(this, e, that) });

            this.$searchResultsContainer.append($placemarker);

            var top = lineTop - $placemarker.height();
            var left = lineLeft + distance - ($placemarker.width() / 2);

            $placemarker.css({
                top: top,
                left: left
            });
        }
    }

    onPlacemarkerTouchStart(that): void {
        that.placemarkerTouched = true;

        var $placemarker = $(this);
        var index = parseInt($placemarker.attr('data-index'));

        $.publish(Commands.VIEW_PAGE, [index]);
    }

    onPlacemarkerClick(that): void {
        if (that.placemarkerTouched) return;

        that.placemarkerTouched = false;

        var $placemarker = $(this);
        var index = parseInt($placemarker.attr('data-index'));

        $.publish(Commands.VIEW_PAGE, [index]);
    }

    onPlacemarkerMouseEnter(that): void {
        if (that.placemarkerTouched) return;

        var $placemarker = $(this);

        $placemarker.addClass('hover');

        var canvasIndex = parseInt($placemarker.attr('data-index'));

        $.publish(Commands.SEARCH_PREVIEW_START, [canvasIndex]);

        var placemarkers = that.getSearchResultPlacemarkers();
        var elemIndex = placemarkers.index($placemarker[0]);

        that.currentPlacemarkerIndex = canvasIndex;

        that.$placemarkerDetails.show();

        var title = "{0} {1}";

        var mode = that.extension.getMode();

        if (mode.toString() === Mode.page.toString()) {
            var canvas: Manifesto.ICanvas = that.provider.getCanvasByIndex(canvasIndex);

            var label = canvas.getLabel();

            if (label === "") {
                label = this.provider.manifest.options.defaultLabel;
            }

            title = String.format(title, that.content.pageCaps, label);
        } else {
            title = String.format(title, that.content.imageCaps, canvasIndex + 1);
        }

        that.$placemarkerDetailsTop.html(title);

        var result = that.provider.searchResults[elemIndex];

        var terms = Utils.Strings.Ellipsis(that.terms, that.options.elideDetailsTermsCount);

        var instancesFoundText;

        if (result.rects.length == 1) {
            instancesFoundText = that.content.instanceFound;
            instancesFoundText = String.format(instancesFoundText, terms);
        } else {
            instancesFoundText = that.content.instancesFound;
            instancesFoundText = String.format(instancesFoundText, result.rects.length, terms);
        }

        that.$placemarkerDetailsBottom.html(instancesFoundText);

        var pos = $placemarker.position();

        var top = pos.top - that.$placemarkerDetails.height();
        var left = pos.left;

        if (left < that.$placemarkerDetails.width() / 2) {
            left = 0 - ($placemarker.width() / 2);
        } else if (left > that.$line.width() - (that.$placemarkerDetails.width() / 2)) {
            left = that.$line.width() - that.$placemarkerDetails.width() + ($placemarker.width() / 2);
        } else {
            left -= (that.$placemarkerDetails.width() / 2);
        }

        that.$placemarkerDetails.css({
            top: top,
            left: left
        });
    }

    onPlacemarkerMouseLeave(e, that): void {
        $.publish(Commands.SEARCH_PREVIEW_FINISH);

        var $placemarker = $(this);

        var newElement = e.toElement || e.relatedTarget;

        var isChild = $(newElement).closest(that.$placemarkerDetails).length;

        if (newElement != that.$placemarkerDetails.get(0) && isChild == 0) {
            that.$placemarkerDetails.hide();
            $placemarker.removeClass('hover');
        }
    }

    setPageMarkerPosition(): void {

        if (this.provider.canvasIndex == null) return;

        // position placemarker showing current page.
        var pageLineRatio = this.getPageLineRatio();
        var lineTop = this.$line.position().top;
        var lineLeft = this.$line.position().left;

        var position = this.provider.canvasIndex * pageLineRatio;
        var top = lineTop;
        var left = lineLeft + position;

        this.$pagePositionMarker.css({
            top: top,
            left: left
        });

        // if the remaining distance to the right is less than the width of the label
        // shift it to the left.
        var lineWidth = this.$line.width();

        if (left + this.$pagePositionLabel.outerWidth(true) > lineWidth) {
            left -= this.$pagePositionLabel.outerWidth(true);
            this.$pagePositionLabel.removeClass('right');
            this.$pagePositionLabel.addClass('left');
        } else {
            this.$pagePositionLabel.removeClass('left');
            this.$pagePositionLabel.addClass('right');
        }

        this.$pagePositionLabel.css({
            top: top,
            left: left
        });
    }

    clearSearchResults(): void {

        (<ISeadragonProvider>this.provider).searchResults = [];

        // clear all existing placemarkers
        var placemarkers = this.getSearchResultPlacemarkers();
        placemarkers.remove();

        // clear search input field.
        this.$searchText.val(this.content.enterKeyword);

        // hide pager.
        this.$searchContainer.show();
        this.$searchPagerContainer.hide();

        // set focus to search box.
        this.$searchText.focus();
    }

    getPageLineRatio(): number {

        var lineWidth = this.$line.width();

        // find page/width ratio by dividing the line width by the number of pages in the book.
        if (this.provider.getTotalCanvases() === 1) return 0;

        return lineWidth / (this.provider.getTotalCanvases() - 1);
    }

    canvasIndexChanged(): void {
        this.setPageMarkerPosition();
        this.setPlacemarkerLabel();
    }

    settingsChanged(): void {
        this.setPlacemarkerLabel();
    }

    setPlacemarkerLabel(): void {

        var displaying = this.content.displaying;
        var index = this.provider.canvasIndex;

        if (this.isPageModeEnabled()) {
            var canvas: Manifesto.ICanvas = this.provider.getCanvasByIndex(index);

            var label = canvas.getLabel();

            if (label === "") {
                label = this.content.defaultLabel;
            }

            var lastCanvasOrderLabel = this.provider.getLastCanvasLabel(true);
            this.$pagePositionLabel.html(String.format(displaying, this.content.page, label, lastCanvasOrderLabel));
        } else {
            this.$pagePositionLabel.html(String.format(displaying, this.content.image, index + 1, this.provider.getTotalCanvases()));
        }
    }

    isPageModeEnabled(): boolean {
        return this.config.options.pageModeEnabled && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
    }

    displaySearchResults(terms, results): void {

        if (!results) return;

        this.positionSearchResultPlacemarkers();

        // show pager.
        this.$searchContainer.hide();

        this.$searchPagerControls.css({
            'left': 0
        });

        var $number = this.$searchPagerContainer.find('.number');
        $number.text(results.resources.length);

        var foundFor = this.$searchResultsInfo.find('.foundFor');

        if (results.resources.length === 1) {
            foundFor.html(this.content.resultFoundFor);
        } else {
            foundFor.html(this.content.resultsFoundFor);
        }

        var $terms = this.$searchPagerContainer.find('.terms');
        $terms.html(Utils.Strings.Ellipsis(terms, this.options.elideResultsTermsCount));
        $terms.prop('title', terms);

        this.$searchPagerContainer.show();

        this.resize();
    }

    resize(): void {
        super.resize();

        if ((<ISeadragonProvider>this.provider).searchResults.length) {
            this.positionSearchResultPlacemarkers();
        }

        this.setPageMarkerPosition();

        this.$searchPagerContainer.width(this.$element.width());

        var center = this.$element.width() / 2;

        // position search pager controls.
        this.$searchPagerControls.css({
            'left': center - (this.$searchPagerControls.width() / 2)
        });

        // position search input.
        this.$searchOptions.css({
            'left': center - (this.$searchOptions.outerWidth() / 2)
        });
    }
}

export = FooterPanel;
