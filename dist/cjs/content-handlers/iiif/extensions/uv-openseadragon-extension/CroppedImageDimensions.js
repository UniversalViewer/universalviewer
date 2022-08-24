"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroppedImageDimensions = void 0;
var utils_1 = require("@edsilv/utils");
var Point_1 = require("../../modules/uv-shared-module/Point");
var CroppedImageDimensions = /** @class */ (function () {
    function CroppedImageDimensions() {
        this.region = new utils_1.Size(0, 0);
        this.regionPos = new Point_1.Point(0, 0);
        this.size = new utils_1.Size(0, 0);
    }
    return CroppedImageDimensions;
}());
exports.CroppedImageDimensions = CroppedImageDimensions;
//# sourceMappingURL=CroppedImageDimensions.js.map