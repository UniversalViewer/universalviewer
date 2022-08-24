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
exports.PagingHeaderPanel = void 0;
var $ = window.$;
var AutoComplete_1 = require("../uv-shared-module/AutoComplete");
var IIIFEvents_1 = require("../../IIIFEvents");
var Events_1 = require("../../extensions/uv-openseadragon-extension/Events");
var HeaderPanel_1 = require("../uv-shared-module/HeaderPanel");
var Mode_1 = require("../../extensions/uv-openseadragon-extension/Mode");
var Utils_1 = require("../../../../Utils");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var utils_1 = require("@edsilv/utils");
var manifesto_js_1 = require("manifesto.js");
var PagingHeaderPanel = /** @class */ (function (_super) {
    __extends(PagingHeaderPanel, _super);
    function PagingHeaderPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this.firstButtonEnabled = false;
        _this.lastButtonEnabled = false;
        _this.nextButtonEnabled = false;
        _this.prevButtonEnabled = false;
        return _this;
    }
    PagingHeaderPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("pagingHeaderPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.canvasIndexChanged(canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, function () {
            _this.modeChanged();
            _this.updatePagingToggle();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED, function () {
            _this.setSearchFieldValue(_this.extension.helper.canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START, function () {
            _this.openGallery();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START, function () {
            _this.closeGallery();
        });
        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);
        this.$firstButton = $("\n          <button class=\"btn imageBtn first\" tabindex=\"0\" title=\"" + this.content.first + "\">\n            <i class=\"uv-icon-first\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.first + "</span>\n          </button>\n        ");
        this.$prevOptions.append(this.$firstButton);
        this.$prevButton = $("\n          <button class=\"btn imageBtn prev\" tabindex=\"0\" title=\"" + this.content.previous + "\">\n            <i class=\"uv-icon-prev\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.previous + "</span>\n          </button>\n        ");
        this.$prevOptions.append(this.$prevButton);
        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);
        this.$imageModeLabel = $('<label for="image">' + this.content.image + "</label>");
        this.$modeOptions.append(this.$imageModeLabel);
        this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="0"/>');
        this.$modeOptions.append(this.$imageModeOption);
        this.$pageModeLabel = $('<label for="page"></label>');
        this.$modeOptions.append(this.$pageModeLabel);
        this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="0"/>');
        this.$modeOptions.append(this.$pageModeOption);
        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);
        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' +
            this.content.pageSearchLabel +
            '"/>');
        this.$search.append(this.$searchText);
        if (utils_1.Bools.getBool(this.options.autoCompleteBoxEnabled, true)) {
            this.$searchText.hide();
            this.$autoCompleteBox = $('<input class="autocompleteText" type="text" maxlength="100" aria-label="' +
                this.content.pageSearchLabel +
                '"/>');
            this.$search.append(this.$autoCompleteBox);
            new AutoComplete_1.AutoComplete(this.$autoCompleteBox, function (term, cb) {
                var results = [];
                var canvases = _this.extension.helper.getCanvases();
                // if in page mode, get canvases by label.
                if (_this.isPageModeEnabled()) {
                    for (var i = 0; i < canvases.length; i++) {
                        var canvas = canvases[i];
                        var label = manifesto_js_1.LanguageMap.getValue(canvas.getLabel());
                        if (label && label.startsWith(term)) {
                            results.push(label);
                        }
                    }
                }
                else {
                    // get canvas by index
                    for (var i = 0; i < canvases.length; i++) {
                        var canvas = canvases[i];
                        if (canvas.index.toString().startsWith(term)) {
                            results.push(canvas.index.toString());
                        }
                    }
                }
                cb(results);
            }, function (results) {
                return results;
            }, function (terms) {
                _this.search(terms);
            }, 300, 0, utils_1.Bools.getBool(this.options.autocompleteAllowWords, false));
        }
        else if (utils_1.Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
            this.$selectionBoxOptions = $('<div class="image-selectionbox-options"></div>');
            this.$centerOptions.append(this.$selectionBoxOptions);
            this.$imageSelectionBox = $('<select class="image-selectionbox" name="image-select" tabindex="0" ></select>');
            this.$selectionBoxOptions.append(this.$imageSelectionBox);
            for (var imageIndex = 0; imageIndex < this.extension.helper.getTotalCanvases(); imageIndex++) {
                var canvas = this.extension.helper.getCanvasByIndex(imageIndex);
                var label = (0, Utils_1.sanitize)((manifesto_js_1.LanguageMap.getValue(canvas.getLabel(), this.extension.helper.options.locale)));
                this.$imageSelectionBox.append("<option value=" + imageIndex + ">" + label + "</option>");
            }
            this.$imageSelectionBox.change(function () {
                var imageIndex = parseInt(_this.$imageSelectionBox.val());
                _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.IMAGE_SEARCH, imageIndex);
            });
        }
        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);
        this.$searchButton = $("<a class=\"go btn btn-primary\" tabindex=\"0\">" + this.content.go + "</a>");
        this.$search.append(this.$searchButton);
        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);
        this.$nextButton = $("\n          <button class=\"btn imageBtn next\" tabindex=\"0\" title=\"" + this.content.next + "\">\n            <i class=\"uv-icon-next\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.next + "</span>\n          </button>\n        ");
        this.$nextOptions.append(this.$nextButton);
        this.$lastButton = $("\n          <button class=\"btn imageBtn last\" tabindex=\"0\" title=\"" + this.content.last + "\">\n            <i class=\"uv-icon-last\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.last + "</span>\n          </button>\n        ");
        this.$nextOptions.append(this.$lastButton);
        if (this.isPageModeEnabled()) {
            this.$pageModeOption.attr("checked", "checked");
            this.$pageModeOption.removeAttr("disabled");
            this.$pageModeLabel.removeClass("disabled");
        }
        else {
            this.$imageModeOption.attr("checked", "checked");
            // disable page mode option.
            this.$pageModeOption.attr("disabled", "disabled");
            this.$pageModeLabel.addClass("disabled");
        }
        if (this.extension.helper.getManifestType() === manifesto_js_1.ManifestType.MANUSCRIPT) {
            this.$pageModeLabel.text(this.content.folio);
        }
        else {
            this.$pageModeLabel.text(this.content.page);
        }
        this.$galleryButton = $("\n          <button class=\"btn imageBtn gallery\" title=\"" + this.content.gallery + "\">\n            <i class=\"uv-icon-gallery\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.gallery + "</span>\n          </button>\n        ");
        this.$rightOptions.prepend(this.$galleryButton);
        this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
        this.$rightOptions.prepend(this.$pagingToggleButtons);
        this.$oneUpButton = $("\n          <button class=\"btn imageBtn one-up\" title=\"" + this.content.oneUp + "\">\n            <i class=\"uv-icon-one-up\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.oneUp + "</span>\n          </button>");
        this.$pagingToggleButtons.append(this.$oneUpButton);
        this.$twoUpButton = $("\n          <button class=\"btn imageBtn two-up\" title=\"" + this.content.twoUp + "\">\n            <i class=\"uv-icon-two-up\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.twoUp + "</span>\n          </button>\n        ");
        this.$pagingToggleButtons.append(this.$twoUpButton);
        this.updatePagingToggle();
        this.updateGalleryButton();
        this.$oneUpButton.onPressed(function () {
            var enabled = false;
            _this.updateSettings({ pagingEnabled: enabled });
            _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.PAGING_TOGGLED, enabled);
        });
        this.$twoUpButton.onPressed(function () {
            var enabled = true;
            _this.updateSettings({ pagingEnabled: enabled });
            _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.PAGING_TOGGLED, enabled);
        });
        this.$galleryButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL);
        });
        this.setNavigationTitles();
        this.setTotal();
        var viewingDirection = this.extension.helper.getViewingDirection() ||
            dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT;
        // check if the book has more than one page, otherwise hide prev/next options.
        if (this.extension.helper.getTotalCanvases() === 1) {
            this.$centerOptions.hide();
        }
        // ui event handlers.
        this.$firstButton.onPressed(function () {
            switch (viewingDirection.toString()) {
                case dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT:
                case dist_commonjs_1.ViewingDirection.TOP_TO_BOTTOM:
                case dist_commonjs_1.ViewingDirection.BOTTOM_TO_TOP:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.FIRST);
                    break;
                case dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LAST);
                    break;
            }
        });
        this.$prevButton.onPressed(function () {
            switch (viewingDirection.toString()) {
                case dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT:
                case dist_commonjs_1.ViewingDirection.BOTTOM_TO_TOP:
                case dist_commonjs_1.ViewingDirection.TOP_TO_BOTTOM:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PREV);
                    break;
                case dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.NEXT);
                    break;
            }
        });
        this.$nextButton.onPressed(function () {
            switch (viewingDirection.toString()) {
                case dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT:
                case dist_commonjs_1.ViewingDirection.BOTTOM_TO_TOP:
                case dist_commonjs_1.ViewingDirection.TOP_TO_BOTTOM:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.NEXT);
                    break;
                case dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PREV);
                    break;
            }
        });
        this.$lastButton.onPressed(function () {
            switch (viewingDirection.toString()) {
                case dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT:
                case dist_commonjs_1.ViewingDirection.TOP_TO_BOTTOM:
                case dist_commonjs_1.ViewingDirection.BOTTOM_TO_TOP:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LAST);
                    break;
                case dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT:
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.FIRST);
                    break;
            }
        });
        // If page mode is disabled, we don't need to show radio buttons since
        // there is only one option:
        if (!this.config.options.pageModeEnabled) {
            this.$imageModeOption.hide();
            this.$pageModeLabel.hide();
            this.$pageModeOption.hide();
        }
        else {
            // Only activate click actions for mode buttons when controls are
            // visible, since otherwise, clicking on the "Image" label can
            // trigger unexpected/undesired side effects.
            this.$imageModeOption.on("click", function () {
                _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.MODE_CHANGE, Mode_1.Mode.image.toString());
            });
            this.$pageModeOption.on("click", function () {
                _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.MODE_CHANGE, Mode_1.Mode.page.toString());
            });
        }
        this.$searchText.onEnter(function () {
            _this.$searchText.blur();
            _this.search(_this.$searchText.val());
        });
        this.$searchText.click(function () {
            $(this).select();
        });
        this.$searchButton.onPressed(function () {
            if (_this.options.autoCompleteBoxEnabled) {
                _this.search(_this.$autoCompleteBox.val());
            }
            else {
                _this.search(_this.$searchText.val());
            }
        });
        if (this.options.modeOptionsEnabled === false) {
            this.$modeOptions.hide();
            this.$centerOptions.addClass("modeOptionsDisabled");
        }
        // Search is shown as default
        if (this.options.imageSelectionBoxEnabled === true &&
            this.options.autoCompleteBoxEnabled !== true) {
            this.$search.hide();
        }
        if (this.options.helpEnabled === false) {
            this.$helpButton.hide();
        }
        // todo: discuss on community call
        // Get visible element in centerOptions with greatest tabIndex
        // var $elementWithGreatestTabIndex: JQuery = this.$centerOptions.getVisibleElementWithGreatestTabIndex();
        // // cycle focus back to start.
        // if ($elementWithGreatestTabIndex) {
        //     $elementWithGreatestTabIndex.blur(() => {
        //         if (this.extension.tabbing && !this.extension.shifted) {
        //             this.$nextButton.focus();
        //         }
        //     });
        // }
        // this.$nextButton.blur(() => {
        //     if (this.extension.tabbing && this.extension.shifted) {
        //         setTimeout(() => {
        //             $elementWithGreatestTabIndex.focus();
        //         }, 100);
        //     }
        // });
        if (!utils_1.Bools.getBool(this.options.pagingToggleEnabled, true)) {
            this.$pagingToggleButtons.hide();
        }
    };
    PagingHeaderPanel.prototype.openGallery = function () {
        this.$oneUpButton.removeClass("on");
        this.$twoUpButton.removeClass("on");
        this.$galleryButton.addClass("on");
    };
    PagingHeaderPanel.prototype.closeGallery = function () {
        this.updatePagingToggle();
        this.$galleryButton.removeClass("on");
    };
    PagingHeaderPanel.prototype.isPageModeEnabled = function () {
        return (this.config.options.pageModeEnabled &&
            this.extension.getMode().toString() ===
                Mode_1.Mode.page.toString());
    };
    PagingHeaderPanel.prototype.setNavigationTitles = function () {
        if (this.isPageModeEnabled()) {
            if (this.extension.helper.isRightToLeft()) {
                this.$firstButton.prop("title", this.content.lastPage);
                this.$firstButton.find("span").text(this.content.lastPage);
                this.$prevButton.prop("title", this.content.nextPage);
                this.$prevButton.find("span").text(this.content.nextPage);
                this.$nextButton.prop("title", this.content.previousPage);
                this.$nextButton.find("span").text(this.content.previousPage);
                this.$lastButton.prop("title", this.content.firstPage);
                this.$lastButton.find("span").text(this.content.firstPage);
            }
            else {
                this.$firstButton.prop("title", this.content.firstPage);
                this.$firstButton.find("span").text(this.content.firstPage);
                this.$prevButton.prop("title", this.content.previousPage);
                this.$prevButton.find("span").text(this.content.previousPage);
                this.$nextButton.prop("title", this.content.nextPage);
                this.$nextButton.find("span").text(this.content.nextPage);
                this.$lastButton.prop("title", this.content.lastPage);
                this.$lastButton.find("span").text(this.content.lastPage);
            }
        }
        else {
            if (this.extension.helper.isRightToLeft()) {
                this.$firstButton.prop("title", this.content.lastImage);
                this.$firstButton.find("span").text(this.content.lastPage);
                this.$prevButton.prop("title", this.content.nextImage);
                this.$prevButton.find("span").text(this.content.nextImage);
                this.$nextButton.prop("title", this.content.previousImage);
                this.$nextButton.find("span").text(this.content.previousImage);
                this.$lastButton.prop("title", this.content.firstImage);
                this.$lastButton.find("span").text(this.content.firstImage);
            }
            else {
                this.$firstButton.prop("title", this.content.firstImage);
                this.$firstButton.find("span").text(this.content.firstImage);
                this.$prevButton.prop("title", this.content.previousImage);
                this.$prevButton.find("span").text(this.content.previousImage);
                this.$nextButton.prop("title", this.content.nextImage);
                this.$nextButton.find("span").text(this.content.nextImage);
                this.$lastButton.prop("title", this.content.lastImage);
                this.$lastButton.find("span").text(this.content.lastImage);
            }
        }
    };
    PagingHeaderPanel.prototype.updatePagingToggle = function () {
        if (!this.pagingToggleIsVisible()) {
            this.$pagingToggleButtons.hide();
            return;
        }
        if (this.extension.isPagingSettingEnabled()) {
            this.$oneUpButton.removeClass("on");
            this.$twoUpButton.addClass("on");
        }
        else {
            this.$twoUpButton.removeClass("on");
            this.$oneUpButton.addClass("on");
        }
    };
    PagingHeaderPanel.prototype.pagingToggleIsVisible = function () {
        return (utils_1.Bools.getBool(this.options.pagingToggleEnabled, true) &&
            this.extension.helper.isPagingAvailable());
    };
    PagingHeaderPanel.prototype.updateGalleryButton = function () {
        if (!this.galleryIsVisible()) {
            this.$galleryButton.hide();
        }
    };
    PagingHeaderPanel.prototype.galleryIsVisible = function () {
        return (utils_1.Bools.getBool(this.options.galleryButtonEnabled, true) &&
            this.extension.isLeftPanelEnabled());
    };
    PagingHeaderPanel.prototype.setTotal = function () {
        var of = this.content.of;
        if (this.isPageModeEnabled()) {
            this.$total.html(utils_1.Strings.format(of, this.extension.helper.getLastCanvasLabel(true)));
        }
        else {
            this.$total.html(utils_1.Strings.format(of, this.extension.helper.getTotalCanvases().toString()));
        }
    };
    PagingHeaderPanel.prototype.setSearchFieldValue = function (index) {
        var canvas = this.extension.helper.getCanvasByIndex(index);
        var value = null;
        if (this.isPageModeEnabled()) {
            var orderLabel = (manifesto_js_1.LanguageMap.getValue(canvas.getLabel()));
            if (orderLabel === "-") {
                value = "";
            }
            else {
                value = orderLabel;
            }
        }
        else {
            index += 1;
            value = index.toString();
        }
        if (this.options.autoCompleteBoxEnabled) {
            this.$autoCompleteBox.val(value);
        }
        else {
            this.$searchText.val(value);
        }
    };
    PagingHeaderPanel.prototype.search = function (value) {
        if (!value) {
            this.extension.showMessage(this.content.emptyValue);
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }
        if (this.isPageModeEnabled()) {
            this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.PAGE_SEARCH, value);
        }
        else {
            var index = void 0;
            if (this.options.autoCompleteBoxEnabled) {
                index = parseInt(this.$autoCompleteBox.val(), 10);
            }
            else {
                index = parseInt(this.$searchText.val(), 10);
            }
            index -= 1;
            if (isNaN(index)) {
                this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content
                    .invalidNumber);
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            var asset = this.extension.helper.getCanvasByIndex(index);
            if (!asset) {
                this.extension.showMessage(this.extension.data.config.modules.genericDialogue.content
                    .pageNotFound);
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.IMAGE_SEARCH, index);
        }
    };
    PagingHeaderPanel.prototype.canvasIndexChanged = function (index) {
        this.setSearchFieldValue(index);
        if (this.options.imageSelectionBoxEnabled === true &&
            this.options.autoCompleteBoxEnabled !== true) {
            this.$imageSelectionBox.val(index);
        }
        var viewingDirection = this.extension.helper.getViewingDirection() ||
            dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT;
        if (viewingDirection === dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT) {
            if (this.extension.helper.isFirstCanvas()) {
                this.disableLastButton();
                this.disableNextButton();
            }
            else {
                this.enableLastButton();
                this.enableNextButton();
            }
            if (this.extension.helper.isLastCanvas()) {
                this.disableFirstButton();
                this.disablePrevButton();
            }
            else {
                this.enableFirstButton();
                this.enablePrevButton();
            }
        }
        else {
            if (this.extension.helper.isFirstCanvas()) {
                this.disableFirstButton();
                this.disablePrevButton();
            }
            else {
                this.enableFirstButton();
                this.enablePrevButton();
            }
            if (this.extension.helper.isLastCanvas()) {
                this.disableLastButton();
                this.disableNextButton();
            }
            else {
                this.enableLastButton();
                this.enableNextButton();
            }
        }
    };
    PagingHeaderPanel.prototype.disableFirstButton = function () {
        this.firstButtonEnabled = false;
        this.$firstButton.disable();
    };
    PagingHeaderPanel.prototype.enableFirstButton = function () {
        this.firstButtonEnabled = true;
        this.$firstButton.enable();
    };
    PagingHeaderPanel.prototype.disableLastButton = function () {
        this.lastButtonEnabled = false;
        this.$lastButton.disable();
    };
    PagingHeaderPanel.prototype.enableLastButton = function () {
        this.lastButtonEnabled = true;
        this.$lastButton.enable();
    };
    PagingHeaderPanel.prototype.disablePrevButton = function () {
        this.prevButtonEnabled = false;
        this.$prevButton.disable();
    };
    PagingHeaderPanel.prototype.enablePrevButton = function () {
        this.prevButtonEnabled = true;
        this.$prevButton.enable();
    };
    PagingHeaderPanel.prototype.disableNextButton = function () {
        this.nextButtonEnabled = false;
        this.$nextButton.disable();
    };
    PagingHeaderPanel.prototype.enableNextButton = function () {
        this.nextButtonEnabled = true;
        this.$nextButton.enable();
    };
    PagingHeaderPanel.prototype.modeChanged = function () {
        this.setSearchFieldValue(this.extension.helper.canvasIndex);
        this.setNavigationTitles();
        this.setTotal();
    };
    PagingHeaderPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        // hide toggle buttons below minimum width
        if (this.extension.width() <
            this.extension.data.config.options.minWidthBreakPoint) {
            if (this.pagingToggleIsVisible())
                this.$pagingToggleButtons.hide();
            if (this.galleryIsVisible())
                this.$galleryButton.hide();
        }
        else {
            if (this.pagingToggleIsVisible())
                this.$pagingToggleButtons.show();
            if (this.galleryIsVisible())
                this.$galleryButton.show();
        }
    };
    return PagingHeaderPanel;
}(HeaderPanel_1.HeaderPanel));
exports.PagingHeaderPanel = PagingHeaderPanel;
//# sourceMappingURL=PagingHeaderPanel.js.map