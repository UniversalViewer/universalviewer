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

        $.subscribe(extension.Extension.MODE_CHANGED, (e, mode) => {
            this.modeChanged(mode);
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $('<a class="imageBtn first"></a>');
        this.$prevOptions.append(this.$firstButton);

        this.$prevButton = $('<a class="imageBtn prev"></a>');
        this.$prevOptions.append(this.$prevButton);

        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);

        this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
        this.$modeOptions.append(this.$imageModeLabel);
        this.$imageModeOption = $('<input type="radio" id="image" name="mode"></input>');
        this.$modeOptions.append(this.$imageModeOption);

        this.$pageModeLabel = $('<label for="page">' + this.content.page + '</label>');
        this.$modeOptions.append(this.$pageModeLabel);
        this.$pageModeOption = $('<input type="radio" id="page" name="mode"></input>');
        this.$modeOptions.append(this.$pageModeOption);

        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);

        this.$searchText = $('<input class="searchText" maxlength="5" type="text"></input>');
        this.$search.append(this.$searchText);

        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);

        this.$searchButton = $('<a class="imageBtn go"></a>');
        this.$search.append(this.$searchButton);

        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);

        this.$nextButton = $('<a class="imageBtn next"></a>');
        this.$nextOptions.append(this.$nextButton);

        this.$lastButton = $('<a class="imageBtn last"></a>');
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
        this.$firstButton.on('click', (e) => {
            e.preventDefault();

            $.publish(PagingHeaderPanel.FIRST);
        });

        this.$prevButton.on('click', (e) => {
            e.preventDefault();

            $.publish(PagingHeaderPanel.PREV);
        });

        this.$nextButton.on('click', (e) => {
            e.preventDefault();

            $.publish(PagingHeaderPanel.NEXT);
        });

        this.$imageModeOption.on('click', (e) => {
            $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.IMAGE_MODE]);
        });

        this.$pageModeOption.on('click', (e) => {
            $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.PAGE_MODE]);
        });

        this.$searchText.on('keyup', (e) => {
            if (e.keyCode == 13) { // return pressed
                e.preventDefault();
                this.$searchText.blur();

                // needs to be delayed, otherwise
                // the RETURN event closes
                // not found dialogue.
                setTimeout(() => {
                    this.search();
                }, 1);
            }
        });

        this.$searchButton.on('click', (e) => {
            e.preventDefault();

            this.search();
        });

        this.$lastButton.on('click', (e) => {
            e.preventDefault();

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

    setSearchPlaceholder(index): void {

        var canvas = this.provider.getCanvasByIndex(index);

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {

            var orderLabel = this.provider.getCanvasOrderLabel(canvas);

            if (orderLabel === "-") {
                this.$searchText.val("");
            } else {
                this.$searchText.val(orderLabel);
            }
        } else {
            index++;
            this.$searchText.val(index);
        }
    }

    search(): void {

        var value = this.$searchText.val();

        if (!value) {

            this.extension.showDialogue(this.content.emptyValue);

            return;
        }

        if ((<ISeadragonExtension>this.extension).getMode() === extension.Extension.PAGE_MODE) {
            $.publish(PagingHeaderPanel.PAGE_SEARCH, [value]);
        } else {
            var index = parseInt(this.$searchText.val());

            if (isNaN(index)){
                this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.invalidNumber);
                return;
            }

            var asset = this.provider.getCanvasByIndex(index);

            if (!asset){
                this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
                return;
            }

            index--;
            $.publish(PagingHeaderPanel.IMAGE_SEARCH, [index.toString()]);
        }
    }

    canvasIndexChanged(index): void {
        this.setSearchPlaceholder(index);
    }

    modeChanged(mode): void {
        this.setSearchPlaceholder(this.provider.canvasIndex);
        this.setTitles();
        this.setTotal();
    }

    resize(): void {
        super.resize();
    }
}