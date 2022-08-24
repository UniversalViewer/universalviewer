const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { PDFExtensionEvents } from "../../extensions/uv-pdf-extension/Events";
import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
import { Strings } from "@edsilv/utils";

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
    this.setConfig("pdfHeaderPanel");

    super.create();

    this.extensionHost.subscribe(
      PDFExtensionEvents.PAGE_INDEX_CHANGE,
      (pageIndex: number) => {
        this._pageIndex = pageIndex;
        this.render();
      }
    );

    this.extensionHost.subscribe(
      PDFExtensionEvents.PDF_LOADED,
      (pdfDoc: any) => {
        this._pdfDoc = pdfDoc;
      }
    );

    this.$prevOptions = $('<div class="prevOptions"></div>');
    this.$centerOptions.append(this.$prevOptions);

    this.$firstButton = $(`
          <button class="btn imageBtn first" tabindex="0" title="${this.content.first}">
            <i class="uv-icon-first" aria-hidden="true"></i>
            <span class="sr-only">${this.content.first}</span>
          </button>
        `);
    this.$prevOptions.append(this.$firstButton);
    this.$firstButton.disable();

    this.$prevButton = $(`
          <button class="btn imageBtn prev" tabindex="0" title="${this.content.previous}">
            <i class="uv-icon-prev" aria-hidden="true"></i>
            <span class="sr-only">${this.content.previous}</span>
          </button>
        `);
    this.$prevOptions.append(this.$prevButton);
    this.$prevButton.disable();

    this.$search = $('<div class="search"></div>');
    this.$centerOptions.append(this.$search);

    this.$searchText = $(
      '<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' +
        this.content.pageSearchLabel +
        '"/>'
    );
    this.$search.append(this.$searchText);

    this.$total = $('<span class="total"></span>');
    this.$search.append(this.$total);

    this.$searchButton = $(
      '<a class="go btn btn-primary" tabindex="0">' + this.content.go + "</a>"
    );
    this.$search.append(this.$searchButton);
    this.$searchButton.disable();

    this.$nextOptions = $('<div class="nextOptions"></div>');
    this.$centerOptions.append(this.$nextOptions);

    this.$nextButton = $(`
          <button class="btn imageBtn next" tabindex="0" title="${this.content.next}">
            <i class="uv-icon-next" aria-hidden="true"></i>
            <span class="sr-only">${this.content.next}</span>
          </button>
        `);
    this.$nextOptions.append(this.$nextButton);
    this.$nextButton.disable();

    this.$lastButton = $(`
          <button class="btn imageBtn last" tabindex="0" title="${this.content.last}">
            <i class="uv-icon-last" aria-hidden="true"></i>
            <span class="sr-only">${this.content.last}</span>
          </button>
        `);
    this.$nextOptions.append(this.$lastButton);
    this.$lastButton.disable();

    // ui event handlers.
    this.$firstButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.FIRST);
    });

    this.$prevButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.PREV);
    });

    this.$nextButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.NEXT);
    });

    this.$lastButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.LAST);
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
    } else {
      this.$centerOptions.show();
    }

    this.$searchText.val(this._pageIndex);

    const of: string = this.content.of;
    this.$total.html(Strings.format(of, this._pdfDoc.numPages.toString()));

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
      this.extension.showMessage(
        this.extension.data.config.modules.genericDialogue.content.invalidNumber
      );
      return;
    }

    this.extensionHost.publish(PDFExtensionEvents.SEARCH, index);
  }

  resize(): void {
    super.resize();
  }
}
