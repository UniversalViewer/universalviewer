import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Events} from "../../extensions/uv-pdf-extension/Events";
import {HeaderPanel} from "../uv-shared-module/HeaderPanel";

export class PDFHeaderPanel extends HeaderPanel {

    $firstButton: JQuery;
    $lastButton: JQuery;
    $nextButton: JQuery;
    $nextOptions: JQuery;
    $prevButton: JQuery;
    $prevOptions: JQuery;
    $search: JQuery;
    $searchButton: JQuery;
    $searchText: JQuery;
    $total: JQuery;

    firstButtonEnabled: boolean = false;
    lastButtonEnabled: boolean = false;
    nextButtonEnabled: boolean = false;
    prevButtonEnabled: boolean = false;

    private _pageIndex: number = 0;
    private _pdfDoc: any = null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfHeaderPanel');

        super.create();

        $.subscribe(Events.PAGE_INDEX_CHANGED, (e: any, pageIndex: number) => {
            this._pageIndex = pageIndex;
            this.render();
        });

        $.subscribe(Events.PDF_LOADED, (e: any, pdfDoc: any) => {
            this._pdfDoc = pdfDoc;
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $(`
          <button class="btn imageBtn first" tabindex="0" title="${this.content.first}">
            <i class="uv-icon-first" aria-hidden="true"></i>${this.content.first}
          </button>
        `);
        this.$prevOptions.append(this.$firstButton);
        this.$firstButton.disable();

        this.$prevButton = $(`
          <button class="btn imageBtn prev" tabindex="0" title="${this.content.previous}">
            <i class="uv-icon-prev" aria-hidden="true"></i>${this.content.previous}
          </button>
        `);
        this.$prevOptions.append(this.$prevButton);
        this.$prevButton.disable();

        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);

        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' + this.content.pageSearchLabel + '"/>');
        this.$search.append(this.$searchText);

        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);

        this.$searchButton = $('<a class="go btn btn-primary" tabindex="0">' + this.content.go + '</a>');
        this.$search.append(this.$searchButton);
        this.$searchButton.disable();

        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);

        this.$nextButton = $(`
          <button class="btn imageBtn next" tabindex="0" title="${this.content.next}">
            <i class="uv-icon-next" aria-hidden="true"></i>${this.content.next}
          </button>
        `);
        this.$nextOptions.append(this.$nextButton);
        this.$nextButton.disable();

        this.$lastButton = $(`
          <button class="btn imageBtn last" tabindex="0" title="${this.content.last}">
            <i class="uv-icon-last" aria-hidden="true"></i>${this.content.last}
          </button>
        `);
        this.$nextOptions.append(this.$lastButton);
        this.$lastButton.disable();

        // ui event handlers.
        this.$firstButton.onPressed(() => {
            $.publish(BaseEvents.FIRST);
        });

        this.$prevButton.onPressed(() => {
            $.publish(BaseEvents.PREV);
        });

        this.$nextButton.onPressed(() => {
            $.publish(BaseEvents.NEXT);
        });

        this.$lastButton.onPressed(() => {
            $.publish(BaseEvents.LAST);
        });

        this.$searchText.onEnter(() => {
            this.$searchText.blur();
            this.search(this.$searchText.val());
        });

        this.$searchText.click(function() {
            $(this).select();
        });

        this.$searchButton.onPressed(() => {
            this.search(this.$searchText.val());
        });
    }

    render(): void {

        // check if the book has more than one page, otherwise hide prev/next options.
        if (this._pdfDoc.numPages === 1) {
            this.$centerOptions.hide();
        }

        this.$searchText.val(this._pageIndex);

        const of: string = this.content.of;
        this.$total.html(Utils.Strings.format(of, this._pdfDoc.numPages.toString()));

        this.$searchButton.enable();

        if (this._pageIndex === 1) {
            this.$firstButton.disable();
            this.$prevButton.disable();
        } else {
            this.$firstButton.enable();
            this.$prevButton.enable();
        }

        if (this._pageIndex === this._pdfDoc.numPages) {
            this.$lastButton.disable();
            this.$nextButton.disable();
        } else {
            this.$lastButton.enable();
            this.$nextButton.enable();
        }
    }

    search(value: string): void {

        if (!value) {
            this.extension.showMessage(this.content.emptyValue);
            return;
        }

        let index: number = parseInt(this.$searchText.val(), 10);

        if (isNaN(index)) {
            this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content.invalidNumber);
            return;
        }

        $.publish(Events.SEARCH, [index]);
    }

    resize(): void {
        super.resize();
    }
}
