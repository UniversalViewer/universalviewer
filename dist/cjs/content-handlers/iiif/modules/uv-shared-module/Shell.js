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
exports.Shell = void 0;
var $ = window.$;
var Utils_1 = require("../../../../Utils");
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseView_1 = require("./BaseView");
var GenericDialogue_1 = require("./GenericDialogue");
var Shell = /** @class */ (function (_super) {
    __extends(Shell, _super);
    function Shell($element) {
        return _super.call(this, $element, true, true) || this;
    }
    Shell.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_OVERLAY, function () {
            _this.$overlays.show();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.HIDE_OVERLAY, function () {
            _this.$overlays.hide();
        });
        // Jump link
        this.$element.append('<a class="sr-only" href="#download-btn">' +
            this.extension.data.config.content.skipToDownload +
            "</a>");
        this.$headerPanel = $('<div class="headerPanel"></div>');
        this.$element.append(this.$headerPanel);
        this.$mainPanel = $('<div class="mainPanel"></div>');
        this.$element.append(this.$mainPanel);
        this.$centerPanel = $('<div class="centerPanel"></div>');
        this.$centerPanel.append('<h2 class="sr-only">' +
            this.extension.data.config.content.mediaViewer +
            "</h2>");
        this.$mainPanel.append(this.$centerPanel);
        this.$leftPanel = $('<div class="leftPanel"></div>');
        this.$mainPanel.append(this.$leftPanel);
        this.$rightPanel = $('<div class="rightPanel"></div>');
        this.$mainPanel.append(this.$rightPanel);
        this.$footerPanel = $('<div class="footerPanel"></div>');
        this.$element.append(this.$footerPanel);
        this.$mobileFooterPanel = $('<div class="mobileFooterPanel"></div>');
        this.$element.append(this.$mobileFooterPanel);
        this.$overlays = $('<div class="overlays"></div>');
        this.$element.append(this.$overlays);
        this.$overlays.hide();
        this.$genericDialogue = $('<div class="overlay genericDialogue" aria-hidden="true"></div>');
        this.$overlays.append(this.$genericDialogue);
        this.$overlays.on("click", function (e) {
            if ($(e.target).hasClass("overlays")) {
                e.preventDefault();
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
            }
        });
        // create shared views.
        new GenericDialogue_1.GenericDialogue(this.$genericDialogue);
    };
    Shell.prototype.resize = function () {
        var _this = this;
        _super.prototype.resize.call(this);
        setTimeout(function () {
            _this.$overlays.width(_this.extension.width());
            _this.$overlays.height(_this.extension.height());
        }, 1);
        var mainHeight = this.$element.height() -
            parseInt(this.$mainPanel.css("paddingTop")) -
            ((0, Utils_1.isVisible)(this.$headerPanel) ? this.$headerPanel.height() : 0) -
            ((0, Utils_1.isVisible)(this.$footerPanel) ? this.$footerPanel.height() : 0) -
            ((0, Utils_1.isVisible)(this.$mobileFooterPanel)
                ? this.$mobileFooterPanel.height()
                : 0);
        this.$mainPanel.height(mainHeight);
    };
    return Shell;
}(BaseView_1.BaseView));
exports.Shell = Shell;
//# sourceMappingURL=Shell.js.map