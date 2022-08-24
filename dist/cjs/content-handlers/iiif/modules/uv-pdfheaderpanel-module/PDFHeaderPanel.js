"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFHeaderPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Events_1 = require("../../extensions/uv-pdf-extension/Events");
var HeaderPanel_1 = require("../uv-shared-module/HeaderPanel");
var utils_1 = require("@edsilv/utils");
var PDFHeaderPanel = /** @class */ (function (_super) {
    __extends(PDFHeaderPanel, _super);
    function PDFHeaderPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this.firstButtonEnabled = false;
        _this.lastButtonEnabled = false;
        _this.nextButtonEnabled = false;
        _this.prevButtonEnabled = false;
        _this._pageIndex = 0;
        _this._pdfDoc = null;
        return _this;
    }
    PDFHeaderPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("pdfHeaderPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(Events_1.PDFExtensionEvents.PAGE_INDEX_CHANGE, function (pageIndex) {
            _this._pageIndex = pageIndex;
            _this.render();
        });
        this.extensionHost.subscribe(Events_1.PDFExtensionEvents.PDF_LOADED, function (pdfDoc) {
            _this._pdfDoc = pdfDoc;
        });
        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);
        this.$firstButton = $("\n          <button class=\"btn imageBtn first\" tabindex=\"0\" title=\"" + this.content.first + "\">\n            <i class=\"uv-icon-first\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.first + "</span>\n          </button>\n        ");
        this.$prevOptions.append(this.$firstButton);
        this.$firstButton.disable();
        this.$prevButton = $("\n          <button class=\"btn imageBtn prev\" tabindex=\"0\" title=\"" + this.content.previous + "\">\n            <i class=\"uv-icon-prev\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.previous + "</span>\n          </button>\n        ");
        this.$prevOptions.append(this.$prevButton);
        this.$prevButton.disable();
        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);
        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' +
            this.content.pageSearchLabel +
            '"/>');
        this.$search.append(this.$searchText);
        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);
        this.$searchButton = $('<a class="go btn btn-primary" tabindex="0">' + this.content.go + "</a>");
        this.$search.append(this.$searchButton);
        this.$searchButton.disable();
        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);
        this.$nextButton = $("\n          <button class=\"btn imageBtn next\" tabindex=\"0\" title=\"" + this.content.next + "\">\n            <i class=\"uv-icon-next\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.next + "</span>\n          </button>\n        ");
        this.$nextOptions.append(this.$nextButton);
        this.$nextButton.disable();
        this.$lastButton = $("\n          <button class=\"btn imageBtn last\" tabindex=\"0\" title=\"" + this.content.last + "\">\n            <i class=\"uv-icon-last\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.last + "</span>\n          </button>\n        ");
        this.$nextOptions.append(this.$lastButton);
        this.$lastButton.disable();
        // ui event handlers.
        this.$firstButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.FIRST);
        });
        this.$prevButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PREV);
        });
        this.$nextButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.NEXT);
        });
        this.$lastButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LAST);
        });
        this.$searchText.onEnter(function () {
            _this.$searchText.blur();
            _this.search(_this.$searchText.val());
        });
        this.$searchText.click(function () {
            $(this).select();
        });
        this.$searchButton.onPressed(function () {
            _this.search(_this.$searchText.val());
        });
    };
    PDFHeaderPanel.prototype.render = function () {
        // check if the book has more than one page, otherwise hide prev/next options.
        if (this._pdfDoc.numPages === 1) {
            this.$centerOptions.hide();
        }
        else {
            this.$centerOptions.show();
        }
        this.$searchText.val(this._pageIndex);
        var of = this.content.of;
        this.$total.html(utils_1.Strings.format(of, this._pdfDoc.numPages.toString()));
        this.$searchButton.enable();
        if (this._pageIndex === 1) {
            this.$firstButton.disable();
            this.$prevButton.disable();
        }
        else {
            this.$firstButton.enable();
            this.$prevButton.enable();
        }
        if (this._pageIndex === this._pdfDoc.numPages) {
            this.$lastButton.disable();
            this.$nextButton.disable();
        }
        else {
            this.$lastButton.enable();
            this.$nextButton.enable();
        }
    };
    PDFHeaderPanel.prototype.search = function (value) {
        if (!value) {
            this.extension.showMessage(this.content.emptyValue);
            return;
        }
        var index = parseInt(this.$searchText.val(), 10);
        if (isNaN(index)) {
            this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content.invalidNumber);
            return;
        }
        this.extensionHost.publish(Events_1.PDFExtensionEvents.SEARCH, index);
    };
    PDFHeaderPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return PDFHeaderPanel;
}(HeaderPanel_1.HeaderPanel));
exports.PDFHeaderPanel = PDFHeaderPanel;
//# sourceMappingURL=PDFHeaderPanel.js.map