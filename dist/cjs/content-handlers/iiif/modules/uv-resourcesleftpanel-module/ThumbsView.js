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
exports.ThumbsView = void 0;
var ThumbsView_1 = require("../uv-shared-module/ThumbsView");
var ThumbsView = /** @class */ (function (_super) {
    __extends(ThumbsView, _super);
    function ThumbsView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThumbsView.prototype.create = function () {
        this.setConfig("resourcesLeftPanel");
        _super.prototype.create.call(this);
    };
    return ThumbsView;
}(ThumbsView_1.ThumbsView));
exports.ThumbsView = ThumbsView;
//# sourceMappingURL=ThumbsView.js.map