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
exports.CenterPanel = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var $ = window.$;
var BaseView_1 = require("./BaseView");
var Position_1 = require("./Position");
var Utils_1 = require("../../../../Utils");
var utils_1 = require("@edsilv/utils");
var CenterPanel = /** @class */ (function (_super) {
    __extends(CenterPanel, _super);
    function CenterPanel($element) {
        var _this = _super.call(this, $element, false, true) || this;
        _this.subtitleExpanded = false;
        _this.isAttributionOpen = false;
        _this.attributionPosition = Position_1.Position.BOTTOM_LEFT;
        _this.isAttributionLoaded = false;
        return _this;
    }
    CenterPanel.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.$title = $('<h1 class="title"></h1>');
        this.$element.append(this.$title);
        this.$subtitle = $("<div class=\"subtitle\">\n                                <div class=\"wrapper\">\n                                    <button type=\"button\" class=\"expand-btn\" aria-label=\"Expand\">\n                                        <span aria-hidden=\"true\">+</span>\n                                    </button>\n                                    <span class=\"text\"></span>\n                                </div>\n                            </div>");
        this.$element.append(this.$subtitle);
        this.$subtitleWrapper = this.$subtitle.find(".wrapper");
        this.$subtitleExpand = this.$subtitle.find(".expand-btn");
        this.$subtitleText = this.$subtitle.find(".text");
        this.$content = $('<div id="content" class="content"></div>');
        this.$element.append(this.$content);
        this.$attribution = $("\n                                <div class=\"attribution\">\n                                  <div class=\"header\">\n                                    <div class=\"title\"></div>\n                                    <button type=\"button\" class=\"close\" aria-label=\"Close\">\n                                      <span aria-hidden=\"true\">&#215;</span>\n                                    </button>\n                                  </div>\n                                  <div class=\"main\">\n                                    <div class=\"attribution-text\"></div>\n                                    <div class=\"license\"></div>\n                                    <div class=\"logo\"></div>\n                                  </div>\n                                </div>\n        ");
        this.$attribution.find(".header .title").text(this.content.attribution);
        this.$content.append(this.$attribution);
        this.closeAttribution();
        this.$closeAttributionButton = this.$attribution.find(".header .close");
        this.$closeAttributionButton.on("click", function (e) {
            e.preventDefault();
            _this.closeAttribution();
        });
        this.$subtitleExpand.on("click", function (e) {
            e.preventDefault();
            _this.subtitleExpanded = !_this.subtitleExpanded;
            if (_this.subtitleExpanded) {
                _this.$subtitleWrapper.addClass("expanded");
                _this.$subtitleExpand.text("-");
            }
            else {
                _this.$subtitleWrapper.removeClass("expanded");
                _this.$subtitleExpand.text("+");
            }
            _this.resize();
        });
        if (utils_1.Bools.getBool(this.options.titleEnabled, true)) {
            this.$title.show();
        }
        else {
            this.$title.hide();
        }
        if (utils_1.Bools.getBool(this.options.subtitleEnabled, false)) {
            this.$subtitle.show();
        }
        else {
            this.$subtitle.hide();
        }
        this.whenResized(function () {
            _this.updateRequiredStatement();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function () {
            _this.updateRequiredStatement();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            _this.updateRequiredStatement();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.MANIFEST_INDEX_CHANGE, function () {
            _this.updateRequiredStatement();
        });
    };
    CenterPanel.prototype.openAttribution = function () {
        this.$attribution.show();
        this.isAttributionOpen = true;
    };
    CenterPanel.prototype.closeAttribution = function () {
        this.$attribution.hide();
        this.isAttributionOpen = false;
    };
    CenterPanel.prototype.updateRequiredStatement = function () {
        var _this = this;
        if (this.isAttributionLoaded) {
            return;
        }
        var mostSpecific = utils_1.Bools.getBool(this.config.options.mostSpecificRequiredStatement, false);
        var requiredStatement = mostSpecific
            ? this.extension.helper.getMostSpecificRequiredStatement()
            : this.extension.helper.getRequiredStatement();
        // isAttributionLoaded
        //var license = this.provider.getLicense();
        //var logo = this.provider.getLogo();
        var enabled = utils_1.Bools.getBool(this.options.requiredStatementEnabled, true);
        if (!requiredStatement || !requiredStatement.value || !enabled) {
            return;
        }
        this.openAttribution();
        var $attributionTitle = this.$attribution.find(".title");
        var $attributionText = this.$attribution.find(".attribution-text");
        var $license = this.$attribution.find(".license");
        var $logo = this.$attribution.find(".logo");
        if (requiredStatement.label) {
            var sanitizedTitle = (0, Utils_1.sanitize)(requiredStatement.label);
            $attributionTitle.html(sanitizedTitle);
        }
        else {
            $attributionTitle.text(this.content.attribution);
        }
        if (requiredStatement.value) {
            var sanitizedText = (0, Utils_1.sanitize)(requiredStatement.value);
            $attributionText.html(sanitizedText);
            var resize_1 = function () { return _this.resize(); };
            $attributionText
                .find("img")
                .one("load", function () {
                _this.resize();
            })
                .each(function () {
                if (this.complete) {
                    resize_1();
                }
            });
            $attributionText
                .find("img")
                .one('error', function () {
                resize_1();
            });
            $attributionText.targetBlank();
        }
        // $attribution.toggleExpandText(this.options.trimAttributionCount, () => {
        //     this.resize();
        // });
        //if (license){
        //    $license.append('<a href="' + license + '">' + license + '</a>');
        //} else {
        $license.hide();
        //}
        //
        //if (logo){
        //    $logo.append('<img src="' + logo + '"/>');
        //} else {
        $logo.hide();
        //}
        this.resize();
        // We mark it as loaded if mostSpecific=false to prevent it reloading
        if (!mostSpecific) {
            this.isAttributionLoaded = true;
        }
    };
    CenterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        var leftPanelWidth = (0, Utils_1.isVisible)(this.extension.shell.$leftPanel)
            ? Math.floor(this.extension.shell.$leftPanel.width())
            : 0;
        var rightPanelWidth = (0, Utils_1.isVisible)(this.extension.shell.$rightPanel)
            ? Math.floor(this.extension.shell.$rightPanel.width())
            : 0;
        var width = Math.floor(this.$element.parent().width() - leftPanelWidth - rightPanelWidth);
        this.$element.css({
            left: leftPanelWidth,
            width: width,
        });
        var titleHeight;
        var subtitleHeight;
        if ((this.options && this.options.titleEnabled === false) ||
            !(0, Utils_1.isVisible)(this.$title)) {
            titleHeight = 0;
        }
        else {
            titleHeight = this.$title.outerHeight(true);
        }
        if ((this.options && this.options.subtitleEnabled === false) ||
            !(0, Utils_1.isVisible)(this.$subtitle)) {
            subtitleHeight = 0;
        }
        else {
            subtitleHeight = this.$subtitle.outerHeight(true);
        }
        this.$content.height(this.$element.height() - titleHeight - subtitleHeight);
        this.$content.width(this.$element.width());
        var $text = this.$attribution.find('.attribution-text');
        $text.css("maxHeight", "calc(" + this.$content.height() + "px - 100px)");
        $text.css('overflow-y', 'auto');
        if (this.$attribution && this.isAttributionOpen) {
            switch (this.attributionPosition) {
                case Position_1.Position.BOTTOM_LEFT:
                    this.$attribution.css("bottom", 0);
                    this.$attribution.css("left", 0);
                    break;
                case Position_1.Position.BOTTOM_RIGHT:
                    this.$attribution.css("bottom", 0);
                    this.$attribution.css("right", 0);
                    break;
            }
            // hide the attribution if there's no room for it
            if (this.$content.width() <= this.$attribution.width()) {
                this.$attribution.hide();
            }
            else {
                this.$attribution.show();
            }
        }
        if (this.subtitle && this.options.subtitleEnabled) {
            this.$subtitleText.html((0, Utils_1.sanitize)(this.subtitle.replace(/<br\s*[\/]?>/gi, "; ")));
            this.$subtitleText.removeClass("elided");
            this.$subtitle.show();
            this.$subtitleWrapper.css("max-height", this.$content.height() + this.$subtitle.outerHeight());
            this.$subtitleWrapper.width(this.$content.width());
            if (!this.subtitleExpanded) {
                this.$subtitleText.width("auto");
                this.$subtitleWrapper.width("auto");
                this.$subtitleExpand.hide();
                // if the subtitle span is wider than the container, set it to display:block
                // and set its width to that of the container
                // this will make it appear elided.
                // show the expand button
                if (this.$subtitleText.width() > this.$content.width()) {
                    this.$subtitleExpand.show();
                    this.$subtitleText.addClass("elided");
                    this.$subtitleText.width(this.$content.width() -
                        (this.$subtitleExpand.outerWidth() +
                            this.$subtitleText.horizontalMargins()));
                }
            }
            else {
                // subtitle expanded
                this.$subtitleText.width(this.$content.width() - this.$subtitleText.horizontalMargins() - 2);
            }
        }
        else {
            this.$subtitle.hide();
        }
    };
    return CenterPanel;
}(BaseView_1.BaseView));
exports.CenterPanel = CenterPanel;
//# sourceMappingURL=CenterPanel.js.map