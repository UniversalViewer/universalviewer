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
var FooterPanel_1 = require("../uv-shared-module/FooterPanel");
var FooterPanel = /** @class */ (function (_super) {
    __extends(FooterPanel, _super);
    function FooterPanel($element) {
        return _super.call(this, $element) || this;
    }
    FooterPanel.prototype.create = function () {
        this.setConfig("mobileFooterPanel");
        _super.prototype.create.call(this);
    };
    FooterPanel.prototype.resize = function () {
        var _this = this;
        _super.prototype.resize.call(this);
        setTimeout(function () {
            _this.$options.css("left", Math.floor(_this.$element.width() / 2 - _this.$options.width() / 2));
        }, 100);
    };
    return FooterPanel;
}(FooterPanel_1.FooterPanel));
exports.FooterPanel = FooterPanel;
//# sourceMappingURL=MobileFooter.js.map