"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XYWHFragment = void 0;
var XYWHFragment = /** @class */ (function () {
    function XYWHFragment(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    XYWHFragment.prototype.toString = function () {
        return this.x + "," + this.y + "," + this.w + "," + this.h;
    };
    XYWHFragment.fromString = function (bounds) {
        bounds = bounds.replace("xywh=", "");
        var boundsArr = bounds.split(",");
        return new XYWHFragment(Number(boundsArr[0]), Number(boundsArr[1]), Number(boundsArr[2]), Number(boundsArr[3]));
    };
    return XYWHFragment;
}());
exports.XYWHFragment = XYWHFragment;
//# sourceMappingURL=XYWHFragment.js.map