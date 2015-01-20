/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseHeader = require("../coreplayer-shared-module/headerPanel");
import utils = require("../../utils");
import help = require("../coreplayer-dialogues-module/helpDialogue");
import ISeadragonExtension = require("../../extensions/coreplayer-seadragon-extension/iSeadragonExtension");

export class PagingHeaderPanel extends baseHeader.HeaderPanel {

    $prevOptions: JQuery;
    $firstButton: JQuery;
    $prevButton: JQuery;
    $modeOptions: JQuery;
    $imageModeLabel: JQuery;
    $imageModeOption: JQuery;
    $pageModeLabel: JQuery;
    $pageModeOption: JQuery;
    $search: JQuery;
    $searchText: JQuery;
    $total: JQuery;
    $searchButton: JQuery;
    $nextOptions: JQuery;
    $nextButton: JQuery;
    $lastButton: JQuery;

    firstButtonEnabled: boolean = false;
    lastButtonEnabled: boolean = false;
    prevButtonEnabled: boolean = false;
    nextButtonEnabled: boolean = false;

    static FIRST: string = 'header.onFirst';
    static LAST: string = 'header.onLast';
    static PREV: string = 'header.onPrev';
    static NEXT: string = 'header.onNext';
    static PAGE_SEARCH: string = 'header.onPageSearch';
    static IMAGE_SEARCH: string = 'header.onImageSearch';
    static MODE_CHANGED: string = 'header.onModeChanged';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pagingHeaderPanel');

        super.create();

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasIndexChanged(canvasIndex);
        });

        $.subscribe(extension.Extension.SETTINGS_CHANGED, (e, mode) => {
            this.modeChanged(mode);
        });

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGE_FAILED, (e) => {
            this.setSearchFieldValue(this.provider.canvasIndex);
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $('<a class="imageBtn first" tabindex="13"></a>');
        this.$prevOptions.append(this.$firstButton);

        this.$prevButton = $('<a class="imageBtn prev" tabindex="14"></a>');
        this.$prevOptions.append(this.$prevButton);

        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);

        this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
        this.$modeOptions.append(this.$imageModeLabel);
        this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="15"></input>');
        this.$modeOptions.append(this.$imageModeOption);

        this.$pageModeLabel = $('<label for="page">' + this.content.page + '</label>');
        this.$modeOptions.append(this.$pageModeLabel);
        this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="16"></input>');
        this.$modeOptions.append(this.$pageModeOption);

        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);

        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="17"></input>');
        this.$search.append(this.$searchText);

        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);

        this.$searchButton = $('<a class="imageBtn go" tabindex="18"></a>');
        this.$search.append(this.$searchButton);

        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);

        this.$nextButton = $('<a class="imageBtn next" tabindex="1"></a>');
        this.$nextOptions.append(this.$nextButton);

        this.$lastButton = $('<a class="imageBtn last" tabindex="2"></a>');
        this.$nextOptions.append(this.$lastButton);

        if ((<ISeadragonExtension>this.extension).getMode() == extension.Extension.PAGE_MODE) {
            this.$pageModeOption.attr('checked', 'checked');
            this.$pageModeOption.removeAttr('disabled');
            this.$pageModeLabel.removeClass('disabled');
        } else {
            this.$imageModeOption.attr('checked', 'checked');
            // disable page mode option.
            this.$pageModeOption.attr('disabled', 'disabled');
            this.$pageModeLabel.addClass('disabled');
        }

        this.setTitles();

        this.setTotal();

        // check if the book has more than one page, otherwise hide prev/next options.
        if (this.provider.getTotalCanvases() == 1) {
            this.$centerOptions.hide();
        }

        // ui event handlers.
        this.$firstButton.onPressed(() => {
            $.publish(PagingHeaderPanel.FIRST);
        });

        this.$prevButton.onPressed(() => {
            $.publish(PagingHeaderPanel.PREV);
        });

        this.$nextButton.onPressed(() => {
            $.publish(PagingHeaderPanel.NEXT);
        });

        this.$imageModeOption.on('click', (e) => {
            $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.IMAGE_MODE]);
        });

        this.$pageModeOption.on('click', (e) => {
            $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.PAGE_MODE]);
        });

        this.$searchText.onEnter(() => {
            this.$searchText.blur();
            this.search();
        });

        this.$searchButton.onPressed(() => {
            this.search();
        });

        this.$lastButton.onPressed(() => {
            $.publish(PagingHeaderPanel.LAST);
        });

        if (this.options.modeOptionsEnabled === false){
            this.$modeOptions.hide();
            this.$centerOptions.addClass('modeOptionsDisabled');
        }

        if (this.options.helpEnabled === false){
            this.$helpButton.hide();
        }
    }

    setTitles(): void {

        var mode;

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {
            mode = "page";
        } else {
            mode = "image";
        }

        this.$firstButton.prop('title', this.content.first + " " + mode);
        this.$prevButton.prop('title', this.content.previous + " " + mode);
        this.$nextButton.prop('title', this.content.next + " " + mode);
        this.$lastButton.prop('title', this.content.last + " " + mode);
        this.$searchButton.prop('title', this.content.go);
    }

    setTotal(): void {

        var of = this.content.of;

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {
            this.$total.html(String.prototype.format(of, this.provider.getLastCanvasOrderLabel()));
        } else {
            this.$total.html(String.prototype.format(of, this.provider.getTotalCanvases()));
        }
    }

    setSearchFieldValue(index): void {

        var canvas = this.provider.getCanvasByIndex(index);

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {

            var orderLabel = this.provider.getCanvasOrderLabel(canvas);

            if (orderLabel === "-") {
                this.$searchText.val("");
            } else {
                this.$searchText.val(orderLabel);
            }
        } else {
            index += 1;
            this.$searchText.val(index);
        }
    }

    search(): void {

        var value = this.$searchText.val();

        if (!value) {

            this.extension.showDialogue(this.content.emptyValue);
            $.publish(baseExtension.BaseExtension.CANVAS_INDEX_CHANGE_FAILED);

            return;
        }

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {
            $.publish(PagingHeaderPanel.PAGE_SEARCH, [value]);
        } else {
            var index = parseInt(this.$searchText.val());

            index -= 1;

            if (isNaN(index)){
                this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.invalidNumber);
                $.publish(baseExtension.BaseExtension.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            var asset = this.provider.getCanvasByIndex(index);

            if (!asset){
                this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
                $.publish(baseExtension.BaseExtension.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            $.publish(PagingHeaderPanel.IMAGE_SEARCH, [index]);
        }
    }

    canvasIndexChanged(index): void {
        this.setSearchFieldValue(index);

        if (this.provider.isFirstCanvas()){
            this.disableFirstButton();
            this.disablePrevButton();
        } else {
            this.enableFirstButton();
            this.enablePrevButton();
        }

        if (this.provider.isLastCanvas()){
            this.disableLastButton();
            this.disableNextButton();
        } else {
            this.enableLastButton();
            this.enableNextButton();
        }
    }

    disableFirstButton () {
        this.firstButtonEnabled = false;
        this.$firstButton.addClass('disabled');
    }

    enableFirstButton () {
        this.firstButtonEnabled = true;
        this.$firstButton.removeClass('disabled');
    }

    disableLastButton () {
        this.lastButtonEnabled = false;
        this.$lastButton.addClass('disabled');
    }

    enableLastButton () {
        this.lastButtonEnabled = true;
        this.$lastButton.removeClass('disabled');
    }

    disablePrevButton () {
        this.prevButtonEnabled = false;
        this.$prevButton.addClass('disabled');
    }

    enablePrevButton () {
        this.prevButtonEnabled = true;
        this.$prevButton.removeClass('disabled');
    }

    disableNextButton () {
        this.nextButtonEnabled = false;
        this.$nextButton.addClass('disabled');
    }

    enableNextButton () {
        this.nextButtonEnabled = true;
        this.$nextButton.removeClass('disabled');
    }

    modeChanged(mode): void {
        this.setSearchFieldValue(this.provider.canvasIndex);
        this.setTitles();
        this.setTotal();
    }

    resize(): void {
        super.resize();
    }
}