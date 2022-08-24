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
exports.BaseView = void 0;
var $ = window.$;
var Panel_1 = require("./Panel");
var BaseView = /** @class */ (function (_super) {
    __extends(BaseView, _super);
    function BaseView($element, fitToParentWidth, fitToParentHeight) {
        return _super.call(this, $element, fitToParentWidth, fitToParentHeight) || this;
    }
    BaseView.prototype.create = function () {
        this.extensionHost = this.$element
            .closest(".uv-iiif-extension-host")
            .data("component");
        // console.log("extensionHost", this.extensionHost);
        _super.prototype.create.call(this);
        this.extension = (this.extensionHost.extension);
        this.config = {};
        this.config.content = {};
        this.config.options = {};
        var that = this;
        // build config inheritance chain
        if (that.modules && that.modules.length) {
            that.modules = that.modules.reverse();
            that.modules.forEach(function (moduleName) {
                that.config = $.extend(true, that.config, that.extension.data.config.modules[moduleName]);
            });
        }
        this.content = this.config.content;
        this.options = this.config.options;
    };
    BaseView.prototype.init = function () { };
    BaseView.prototype.setConfig = function (moduleName) {
        if (!this.modules) {
            this.modules = [];
        }
        this.modules.push(moduleName);
    };
    BaseView.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return BaseView;
}(Panel_1.Panel));
exports.BaseView = BaseView;
//# sourceMappingURL=BaseView.js.map