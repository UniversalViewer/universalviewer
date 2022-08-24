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
var FooterPanel_1 = require("../uv-shared-module/FooterPanel");
var Events_1 = require("../../extensions/uv-openseadragon-extension/Events");
var FooterPanel = /** @class */ (function (_super) {
    __extends(FooterPanel, _super);
    function FooterPanel($element) {
        return _super.call(this, $element) || this;
    }
    FooterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("mobileFooterPanel");
        _super.prototype.create.call(this);
        // this.$spacer = $('<div class="spacer"></div>');
        // this.$options.prepend(this.$spacer);
        this.$rotateButton = $("\n            <button class=\"btn imageBtn rotate\" title=\"" + this.content.rotateRight + "\">\n                <i class=\"uv-icon-rotate\" aria-hidden=\"true\"></i>" + this.content.rotateRight + "\n            </button>\n        ");
        this.$options.prepend(this.$rotateButton);
        this.$zoomOutButton = $("\n            <button class=\"btn imageBtn zoomOut\" title=\"" + this.content.zoomOut + "\">\n                <i class=\"uv-icon-zoom-out\" aria-hidden=\"true\"></i>" + this.content.zoomOut + "\n            </button>\n        ");
        this.$options.prepend(this.$zoomOutButton);
        this.$zoomInButton = $("\n            <button class=\"btn imageBtn zoomIn\" title=\"" + this.content.zoomIn + "\">\n                <i class=\"uv-icon-zoom-in\" aria-hidden=\"true\"></i>" + this.content.zoomIn + "\n            </button>\n        ");
        this.$options.prepend(this.$zoomInButton);
        this.$zoomInButton.onPressed(function () {
            _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.ZOOM_IN);
        });
        this.$zoomOutButton.onPressed(function () {
            _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.ZOOM_OUT);
        });
        this.$rotateButton.onPressed(function () {
            _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.ROTATE);
        });
    };
    FooterPanel.prototype.resize = function () {
        var _this = this;
        _super.prototype.resize.call(this);
        setTimeout(function () {
            _this.$options.css("left", Math.floor(_this.$element.width() / 2 - _this.$options.width() / 2));
        }, 1);
    };
    return FooterPanel;
}(FooterPanel_1.FooterPanel));
exports.FooterPanel = FooterPanel;
//# sourceMappingURL=MobileFooter.js.map