/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import app = module("app/seadragon/App");
import baseHeader = module("app/shared/Header");

export class Header extends baseHeader.Header {

    $prevOptions: JQuery;
    $firstButton: JQuery;
    $prevButton: JQuery;
    $modeOptions: JQuery;
    $imageModeOption: JQuery;
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
        super.create();
        
        $.subscribe(baseApp.BaseApp.ASSET_INDEX_CHANGED, (e, assetIndex) => {
            this.assetIndexChanged(assetIndex);
        });

        $.subscribe(app.App.MODE_CHANGED, (e, mode) => {
            this.modeChanged(mode);
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $('<a class="imageButton first"></a>');
        this.$prevOptions.append(this.$firstButton);

        this.$prevButton = $('<a class="imageButton prev"></a>');
        this.$prevOptions.append(this.$prevButton);
             
        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);

        this.$modeOptions.append('<label for="image">' + this.content.header.image + '</label>');
        this.$imageModeOption = $('<input type="radio" id="image" name="mode"></input>');
        this.$modeOptions.append(this.$imageModeOption);
        
        this.$modeOptions.append('<label for="page">' + this.content.header.page + '</label>');
        this.$pageModeOption = $('<input type="radio" id="page" name="mode"></input>');
        this.$modeOptions.append(this.$pageModeOption);
             
        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);
             
        this.$searchText = $('<input class="searchText" maxlength="5" type="text"></input>');
        this.$search.append(this.$searchText);
             
        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);
             
        this.$searchButton = $('<a class="imageButton go"></a>');
        this.$search.append(this.$searchButton);
             
        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);
             
        this.$nextButton = $('<a class="imageButton next"></a>');
        this.$nextOptions.append(this.$nextButton);

        this.$lastButton = $('<a class="imageButton last"></a>');
        this.$nextOptions.append(this.$lastButton);
        
        if ((<app.App>this.app).getMode() == app.App.PAGE_MODE) {
            this.$pageModeOption.attr('checked', 'checked');
            this.$pageModeOption.removeAttr('disabled');
        } else {
            this.$imageModeOption.attr('checked', 'checked');
            // disable page mode option.
            this.$pageModeOption.attr('disabled', 'disabled');
        }

        this.setTitles();

        this.setTotal();

        // check if the book has more than one page, otherwise hide prev/next options.
        if (this.provider.assetSequence.assets.length == 1) {
            this.$centerOptions.hide();
        }
        
        // ui event handlers.
        this.$firstButton.click(function (e) {
            e.preventDefault();
            
            $.publish(Header.FIRST);
        });

        this.$prevButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Header.PREV);
        });

        this.$nextButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Header.NEXT);
        });

        this.$imageModeOption.on('click', (e) => {
            $.publish(Header.MODE_CHANGED, [app.App.IMAGE_MODE]);
        });

        this.$pageModeOption.on('click', (e) => {
            $.publish(Header.MODE_CHANGED, [app.App.PAGE_MODE]);
        });

        this.$searchText.on('keyup', (e) => {
            if (e.keyCode == 13) { // return pressed
                e.preventDefault();
                this.$searchText.blur();
                this.search();
            }
        });

        this.$searchButton.on('click', (e) => {
            e.preventDefault();

            this.search();
        });

        this.$lastButton.on('click', (e) => {
            e.preventDefault();

            $.publish(Header.LAST);
        });
    }

    setTitles(): void {

        var mode;

        if ((<app.App>this.app).getMode() == app.App.PAGE_MODE) {
            mode = "page";
        } else {
            mode = "image";
        }

        this.$firstButton.prop('title', this.provider.config.content.header.first + " " + mode);
        this.$prevButton.prop('title', this.provider.config.content.header.previous + " " + mode);
        this.$nextButton.prop('title', this.provider.config.content.header.next + " " + mode);
        this.$lastButton.prop('title', this.provider.config.content.header.last + " " + mode);
        this.$searchButton.prop('title', this.provider.config.content.header.go);
    }

    setTotal(): void {

        var of = window.app.provider.config.content.header.of;

        if (window.app.getMode() == app.App.PAGE_MODE) {
            this.$total.html(String.prototype.format(of, this.app.getLastAssetOrderLabel()));
        } else {
            this.$total.html(String.prototype.format(of, this.provider.assetSequence.assets.length));
        }
    }

    setSearchPlaceholder(index): void {
        
        var asset = window.app.getAssetByIndex(index);

        if ((<app.App>this.app).getMode() == app.App.PAGE_MODE) {
            if (asset.orderLabel.trim() === "-") {
                this.$searchText.val("");
            } else {
                this.$searchText.val(asset.orderLabel);
            }
        } else {
            index++;
            this.$searchText.val(index);
        }
    }

    search(): void {

        var value = this.$searchText.val();

        if (!value) {
            $.publish(baseApp.BaseApp.SHOW_GENERIC_DIALOGUE, this.content.genericDialogue.emptyValue);
            return;
        }

        if ((<app.App>this.app).getMode() == app.App.PAGE_MODE) {
            $.publish(Header.PAGE_SEARCH, [value]);
        } else {
            var index = parseInt(this.$searchText.val());
            index--;
            $.publish(Header.IMAGE_SEARCH, [index.toString()]);
        }
    }

    assetIndexChanged(index): void {
        this.setSearchPlaceholder(index);
    }

    modeChanged(mode): void {
        this.setSearchPlaceholder(this.app.currentAssetIndex);
        this.setTitles();
        this.setTotal();
    }

    resize(): void {
        super.resize();
    }
}