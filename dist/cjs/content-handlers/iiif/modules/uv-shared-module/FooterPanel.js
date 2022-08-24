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
exports.FooterPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseView_1 = require("./BaseView");
var utils_1 = require("@edsilv/utils");
var Events_1 = require("../../../../Events");
var FooterPanel = /** @class */ (function (_super) {
    __extends(FooterPanel, _super);
    function FooterPanel($element) {
        return _super.call(this, $element) || this;
    }
    FooterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("footerPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(Events_1.Events.TOGGLE_FULLSCREEN, function () {
            _this.updateFullScreenButton();
            // hack for firefox when exiting full screen
            if (!_this.extensionHost.isFullScreen) {
                setTimeout(function () {
                    _this.resize();
                }, 1001); // wait one ms longer than the resize timeout in uv-helpers.js
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.METRIC_CHANGE, function () {
            _this.updateMinimisedButtons();
            _this.updateMoreInfoButton();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, function () {
            _this.updateDownloadButton();
        });
        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);
        this.$feedbackButton = $("\n          <button class=\"feedback btn imageBtn\" title=\"" + this.content.feedback + "\">\n            <i class=\"uv-icon uv-icon-feedback\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.feedback + "</span>\n          </button>\n        ");
        this.$options.prepend(this.$feedbackButton);
        this.$openButton = $("\n          <button class=\"open btn imageBtn\" title=\"" + this.content.open + "\">\n            <i class=\"uv-icon-open\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.open + "</span>\n          </button>\n        ");
        this.$options.prepend(this.$openButton);
        this.$bookmarkButton = $("\n          <button class=\"bookmark btn imageBtn\" title=\"" + this.content.bookmark + "\">\n            <i class=\"uv-icon uv-icon-bookmark\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.bookmark + "</span>\n          </button>\n        ");
        this.$options.prepend(this.$bookmarkButton);
        this.$shareButton = $("\n          <button class=\"share btn imageBtn\" title=\"" + this.content.share + "\">\n            <i class=\"uv-icon uv-icon-share\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.share + "</span>\n          </button>\n        ");
        this.$options.append(this.$shareButton);
        this.$embedButton = $("\n          <button class=\"embed btn imageBtn\" title=\"" + this.content.embed + "\">\n            <i class=\"uv-icon uv-icon-embed\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.embed + "</span>\n          </button>\n        ");
        this.$options.append(this.$embedButton);
        this.$downloadButton = $("\n          <button class=\"download btn imageBtn\" title=\"" + this.content.download + "\" id=\"download-btn\">\n            <i class=\"uv-icon uv-icon-download\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.download + "</span>\n          </button>\n        ");
        this.$options.prepend(this.$downloadButton);
        this.$moreInfoButton = $("\n          <button class=\"moreInfo btn imageBtn\" title=\"" + this.content.moreInfo + "\">\n            <i class=\"uv-icon uv-icon-more-info\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.moreInfo + "</span>\n          </button>\n        ");
        this.$options.prepend(this.$moreInfoButton);
        this.$fullScreenBtn = $("\n          <button class=\"fullScreen btn imageBtn\" title=\"" + this.content.fullScreen + "\">\n            <i class=\"uv-icon uv-icon-fullscreen\" aria-hidden=\"true\"></i>\n            <span class=\"sr-only\">" + this.content.fullScreen + "</span>\n          </button>\n        ");
        this.$options.append(this.$fullScreenBtn);
        this.$openButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN);
        });
        this.$feedbackButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.FEEDBACK);
        });
        this.$bookmarkButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.BOOKMARK);
        });
        this.$shareButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_SHARE_DIALOGUE, _this.$shareButton);
        });
        this.$embedButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_EMBED_DIALOGUE, _this.$embedButton);
        });
        this.$downloadButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, _this.$downloadButton);
        });
        this.$moreInfoButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_MOREINFO_DIALOGUE, _this.$moreInfoButton);
        });
        this.onAccessibleClick(this.$fullScreenBtn, function (e) {
            e.preventDefault();
            _this.extensionHost.publish(Events_1.Events.TOGGLE_FULLSCREEN);
        }, true);
        if (!utils_1.Bools.getBool(this.options.embedEnabled, true)) {
            this.$embedButton.hide();
        }
        this.updateMoreInfoButton();
        this.updateOpenButton();
        this.updateFeedbackButton();
        this.updateBookmarkButton();
        this.updateEmbedButton();
        this.updateDownloadButton();
        this.updateFullScreenButton();
        this.updateShareButton();
        this.updateMinimisedButtons();
    };
    FooterPanel.prototype.updateMinimisedButtons = function () {
        // if configured to always minimise buttons
        if (utils_1.Bools.getBool(this.options.minimiseButtons, false)) {
            this.$options.addClass("minimiseButtons");
            return;
        }
        // otherwise, check metric
        if (!this.extension.isDesktopMetric()) {
            this.$options.addClass("minimiseButtons");
        }
        else {
            this.$options.removeClass("minimiseButtons");
        }
    };
    FooterPanel.prototype.updateMoreInfoButton = function () {
        // const configEnabled: boolean = Bools.getBool(
        //   this.options.moreInfoEnabled,
        //   false
        // );
        // if (configEnabled && !this.extension.isDesktopMetric()) {
        //   this.$moreInfoButton.show();
        // } else {
        //   this.$moreInfoButton.hide();
        // }
    };
    FooterPanel.prototype.updateOpenButton = function () {
        var configEnabled = utils_1.Bools.getBool(this.options.openEnabled, false);
        if (configEnabled && utils_1.Documents.isInIFrame()) {
            this.$openButton.show();
        }
        else {
            this.$openButton.hide();
        }
    };
    FooterPanel.prototype.updateFullScreenButton = function () {
        if (!utils_1.Bools.getBool(this.options.fullscreenEnabled, true) ||
            !utils_1.Documents.supportsFullscreen()) {
            this.$fullScreenBtn.hide();
            return;
        }
        if (this.extension.isFullScreen()) {
            this.$fullScreenBtn.switchClass("fullScreen", "exitFullscreen");
            this.$fullScreenBtn
                .find("i")
                .switchClass("uv-icon-fullscreen", "uv-icon-exit-fullscreen");
            this.$fullScreenBtn.attr("title", this.content.exitFullScreen);
            $(this.$fullScreenBtn[0].firstChild.nextSibling.nextSibling).replaceWith(this.content.exitFullScreen);
        }
        else {
            this.$fullScreenBtn.switchClass("exitFullscreen", "fullScreen");
            this.$fullScreenBtn
                .find("i")
                .switchClass("uv-icon-exit-fullscreen", "uv-icon-fullscreen");
            this.$fullScreenBtn.attr("title", this.content.fullScreen);
            $(this.$fullScreenBtn[0].firstChild.nextSibling.nextSibling).replaceWith(this.content.fullScreen);
        }
    };
    FooterPanel.prototype.updateEmbedButton = function () {
        if (this.extension.helper.isUIEnabled("embed") &&
            utils_1.Bools.getBool(this.options.embedEnabled, false)) {
            // current jquery version sets display to 'inline' in mobile version, while this should remain hidden (see media query)
            if (!this.extension.isMobile()) {
                this.$embedButton.show();
            }
        }
        else {
            this.$embedButton.hide();
        }
    };
    FooterPanel.prototype.updateShareButton = function () {
        if (this.extension.helper.isUIEnabled("share") &&
            utils_1.Bools.getBool(this.options.shareEnabled, true)) {
            this.$shareButton.show();
        }
        else {
            this.$shareButton.hide();
        }
    };
    FooterPanel.prototype.updateDownloadButton = function () {
        var configEnabled = utils_1.Bools.getBool(this.options.downloadEnabled, true);
        if (configEnabled) {
            this.$downloadButton.show();
        }
        else {
            this.$downloadButton.hide();
        }
    };
    FooterPanel.prototype.updateFeedbackButton = function () {
        var configEnabled = utils_1.Bools.getBool(this.options.feedbackEnabled, false);
        if (configEnabled) {
            this.$feedbackButton.show();
        }
        else {
            this.$feedbackButton.hide();
        }
    };
    FooterPanel.prototype.updateBookmarkButton = function () {
        var configEnabled = utils_1.Bools.getBool(this.options.bookmarkEnabled, false);
        if (configEnabled) {
            this.$bookmarkButton.show();
        }
        else {
            this.$bookmarkButton.hide();
        }
    };
    FooterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return FooterPanel;
}(BaseView_1.BaseView));
exports.FooterPanel = FooterPanel;
//# sourceMappingURL=FooterPanel.js.map