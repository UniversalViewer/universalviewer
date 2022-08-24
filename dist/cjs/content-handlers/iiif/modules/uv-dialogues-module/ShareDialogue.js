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
exports.ShareDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var utils_1 = require("@edsilv/utils");
var ShareDialogue = /** @class */ (function (_super) {
    __extends(ShareDialogue, _super);
    function ShareDialogue($element) {
        var _this = _super.call(this, $element) || this;
        _this.aspectRatio = 0.75;
        _this.isEmbedViewVisible = false;
        _this.isShareViewVisible = false;
        _this.maxWidth = 8000;
        _this.maxHeight = _this.maxWidth * _this.aspectRatio;
        _this.minWidth = 200;
        _this.minHeight = _this.minWidth * _this.aspectRatio;
        _this.shareManifestsEnabled = false;
        return _this;
    }
    ShareDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("shareDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_SHARE_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_SHARE_DIALOGUE;
        this.shareManifestsEnabled = this.options.shareManifestsEnabled || false;
        var lastElement;
        this.extensionHost.subscribe(this.openCommand, function (triggerButton) {
            lastElement = triggerButton;
            _this.open(triggerButton);
            if (_this.isShareAvailable()) {
                _this.openShareView();
            }
            else {
                _this.openEmbedView();
            }
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            if (lastElement) {
                lastElement.focus();
            }
            _this.close();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_EMBED_DIALOGUE, function (triggerButton) {
            _this.open(triggerButton);
            _this.openEmbedView();
        });
        this.$tabs = $('<div class="tabs"></div>');
        this.$content.append(this.$tabs);
        this.$shareButton = $('<a class="share tab default" tabindex="0">' + this.content.share + "</a>");
        this.$tabs.append(this.$shareButton);
        this.$embedButton = $('<a class="embed tab" tabindex="0">' + this.content.embed + "</a>");
        this.$tabs.append(this.$embedButton);
        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$content.append(this.$tabsContent);
        this.$footer = $('<div class="footer"></div>');
        this.$content.append(this.$footer);
        this.$shareView = $('<div class="shareView view"></div>');
        this.$tabsContent.append(this.$shareView);
        this.$shareHeader = $('<div class="header"></div>');
        this.$shareView.append(this.$shareHeader);
        this.$shareLink = $('<a class="shareLink" onclick="return false;"></a>');
        this.$shareView.append(this.$shareLink);
        this.$shareInput = $("<input class=\"shareInput\" type=\"text\" readonly=\"readonly\" aria-label=\"" + this.content.shareUrl + "\"/>");
        this.$shareView.append(this.$shareInput);
        this.$shareFrame = $('<iframe class="shareFrame"></iframe>');
        this.$shareView.append(this.$shareFrame);
        this.$embedView = $('<div class="embedView view"></div>');
        this.$tabsContent.append(this.$embedView);
        this.$embedHeader = $('<div class="header"></div>');
        this.$embedView.append(this.$embedHeader);
        // this.$link = $('<a target="_blank"></a>');
        // this.$embedView.find('.leftCol').append(this.$link);
        // this.$image = $('<img class="share" />');
        // this.$embedView.append(this.$image);
        this.$code = $("<input class=\"code\" type=\"text\" readonly=\"readonly\" aria-label=\"" + this.content.embed + "\"/>");
        this.$embedView.append(this.$code);
        this.$customSize = $('<div class="customSize"></div>');
        this.$embedView.append(this.$customSize);
        this.$size = $('<span class="size">' + this.content.size + "</span>");
        this.$customSize.append(this.$size);
        this.$customSizeDropDown = $('<select id="size" aria-label="' + this.content.size + '"></select>');
        this.$customSize.append(this.$customSizeDropDown);
        this.$customSizeDropDown.append('<option value="small" data-width="560" data-height="420">560 x 420</option>');
        this.$customSizeDropDown.append('<option value="medium" data-width="640" data-height="480">640 x 480</option>');
        this.$customSizeDropDown.append('<option value="large" data-width="800" data-height="600">800 x 600</option>');
        this.$customSizeDropDown.append('<option value="custom">' + this.content.customSize + "</option>");
        this.$widthInput = $('<input class="width" type="text" maxlength="10" aria-label="' +
            this.content.width +
            '"/>');
        this.$customSize.append(this.$widthInput);
        this.$x = $('<span class="x">x</span>');
        this.$customSize.append(this.$x);
        this.$heightInput = $('<input class="height" type="text" maxlength="10" aria-label="' +
            this.content.height +
            '"/>');
        this.$customSize.append(this.$heightInput);
        var iiifUrl = this.extension.getIIIFShareUrl(this.shareManifestsEnabled);
        if (this.shareManifestsEnabled) {
            this.$iiifButton = $('<a class="imageBtn iiif" href="' +
                iiifUrl +
                '" title="' +
                this.content.iiif +
                '" target="_blank"></a>');
            this.$footer.append(this.$iiifButton);
        }
        this.$termsOfUseButton = $('<a href="#">' + this.extension.data.config.content.termsOfUse + "</a>");
        this.$footer.append(this.$termsOfUseButton);
        this.$widthInput.on("keydown", function (e) {
            return utils_1.Numbers.numericalInput(e);
        });
        this.$heightInput.on("keydown", function (e) {
            return utils_1.Numbers.numericalInput(e);
        });
        this.$shareInput.focus(function () {
            $(this).select();
        });
        this.$code.focus(function () {
            $(this).select();
        });
        this.onAccessibleClick(this.$shareButton, function () {
            _this.openShareView();
        });
        this.onAccessibleClick(this.$embedButton, function () {
            _this.openEmbedView();
        });
        this.$customSizeDropDown.change(function () {
            _this.update();
        });
        this.$widthInput.change(function () {
            _this.updateHeightRatio();
            _this.update();
        });
        this.$heightInput.change(function () {
            _this.updateWidthRatio();
            _this.update();
        });
        this.onAccessibleClick(this.$termsOfUseButton, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_TERMS_OF_USE);
        });
        this.$element.hide();
        this.update();
    };
    ShareDialogue.prototype.open = function (triggerButton) {
        _super.prototype.open.call(this, triggerButton);
        this.update();
    };
    ShareDialogue.prototype.getShareUrl = function () {
        return this.extension.getShareUrl();
    };
    ShareDialogue.prototype.isShareAvailable = function () {
        return !!this.getShareUrl();
    };
    ShareDialogue.prototype.update = function () {
        if (this.isShareAvailable()) {
            this.$shareButton.show();
        }
        else {
            this.$shareButton.hide();
        }
        var $selected = this.getSelectedSize();
        if ($selected.val() === "custom") {
            this.$widthInput.show();
            this.$x.show();
            this.$heightInput.show();
        }
        else {
            this.$widthInput.hide();
            this.$x.hide();
            this.$heightInput.hide();
            this.currentWidth = Number($selected.data("width"));
            this.currentHeight = Number($selected.data("height"));
            this.$widthInput.val(String(this.currentWidth));
            this.$heightInput.val(String(this.currentHeight));
        }
        this.updateInstructions();
        this.updateShareOptions();
        this.updateShareFrame();
        this.updateTermsOfUseButton();
    };
    ShareDialogue.prototype.updateShareOptions = function () {
        var shareUrl = this.getShareUrl();
        if (shareUrl) {
            this.$shareInput.val(shareUrl);
            this.$shareLink.prop("href", shareUrl);
            this.$shareLink.text(shareUrl);
        }
        if (this.extension.isMobile()) {
            this.$shareInput.hide();
            this.$shareLink.show();
        }
        else {
            this.$shareInput.show();
            this.$shareLink.hide();
        }
    };
    ShareDialogue.prototype.updateInstructions = function () {
        if (utils_1.Bools.getBool(this.options.instructionsEnabled, false)) {
            this.$shareHeader.show();
            this.$embedHeader.show();
            this.$shareHeader.text(this.content.shareInstructions);
            this.$embedHeader.text(this.content.embedInstructions);
        }
        else {
            this.$shareHeader.hide();
            this.$embedHeader.hide();
        }
    };
    // updateThumbnail(): void {
    //     var canvas: manifesto.Canvas = this.extension.helper.getCurrentCanvas();
    //     if (!canvas) return;
    //     var thumbnail = canvas.getProperty('thumbnail');
    //     if (!thumbnail || !_.isString(thumbnail)){
    //         thumbnail = canvas.getCanonicalImageUri(this.extension.data.config.options.bookmarkThumbWidth);
    //     }
    //     this.$link.attr('href', thumbnail);
    //     this.$image.attr('src', thumbnail);
    // }
    ShareDialogue.prototype.getSelectedSize = function () {
        return this.$customSizeDropDown.find(":selected");
    };
    ShareDialogue.prototype.updateWidthRatio = function () {
        this.currentHeight = Number(this.$heightInput.val());
        if (this.currentHeight < this.minHeight) {
            this.currentHeight = this.minHeight;
            this.$heightInput.val(String(this.currentHeight));
        }
        else if (this.currentHeight > this.maxHeight) {
            this.currentHeight = this.maxHeight;
            this.$heightInput.val(String(this.currentHeight));
        }
        this.currentWidth = Math.floor(this.currentHeight / this.aspectRatio);
        this.$widthInput.val(String(this.currentWidth));
    };
    ShareDialogue.prototype.updateHeightRatio = function () {
        this.currentWidth = Number(this.$widthInput.val());
        if (this.currentWidth < this.minWidth) {
            this.currentWidth = this.minWidth;
            this.$widthInput.val(String(this.currentWidth));
        }
        else if (this.currentWidth > this.maxWidth) {
            this.currentWidth = this.maxWidth;
            this.$widthInput.val(String(this.currentWidth));
        }
        this.currentHeight = Math.floor(this.currentWidth * this.aspectRatio);
        this.$heightInput.val(String(this.currentHeight));
    };
    ShareDialogue.prototype.updateShareFrame = function () {
        var shareUrl = this.extension.helper.getShareServiceUrl();
        if (!shareUrl) {
            return;
        }
        if (utils_1.Bools.getBool(this.config.options.shareFrameEnabled, true) &&
            shareUrl) {
            this.$shareFrame.prop("src", shareUrl);
            this.$shareFrame.show();
        }
        else {
            this.$shareFrame.hide();
        }
    };
    ShareDialogue.prototype.updateTermsOfUseButton = function () {
        var requiredStatement = this.extension.helper.getRequiredStatement();
        if (utils_1.Bools.getBool(this.extension.data.config.options.termsOfUseEnabled, false) &&
            requiredStatement &&
            requiredStatement.value) {
            this.$termsOfUseButton.show();
        }
        else {
            this.$termsOfUseButton.hide();
        }
    };
    ShareDialogue.prototype.openShareView = function () {
        this.isShareViewVisible = true;
        this.isEmbedViewVisible = false;
        this.$embedView.hide();
        this.$shareView.show();
        this.$shareButton.addClass("on default");
        this.$embedButton.removeClass("on default");
        this.resize();
    };
    ShareDialogue.prototype.openEmbedView = function () {
        this.isShareViewVisible = false;
        this.isEmbedViewVisible = true;
        this.$embedView.show();
        this.$shareView.hide();
        this.$shareButton.removeClass("on default");
        this.$embedButton.addClass("on default");
        this.resize();
    };
    ShareDialogue.prototype.close = function () {
        _super.prototype.close.call(this);
    };
    ShareDialogue.prototype.getViews = function () {
        return this.$tabsContent.find(".view");
    };
    ShareDialogue.prototype.equaliseViewHeights = function () {
        this.getViews().equaliseHeight(true);
    };
    ShareDialogue.prototype.resize = function () {
        this.equaliseViewHeights();
        this.setDockedPosition();
    };
    return ShareDialogue;
}(Dialogue_1.Dialogue));
exports.ShareDialogue = ShareDialogue;
//# sourceMappingURL=ShareDialogue.js.map