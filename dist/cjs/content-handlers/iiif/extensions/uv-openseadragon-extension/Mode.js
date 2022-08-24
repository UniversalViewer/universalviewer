"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mode = void 0;
var Mode = /** @class */ (function () {
    function Mode(value) {
        this.value = value;
    }
    Mode.prototype.toString = function () {
        return this.value;
    };
    Mode.image = new Mode("image");
    Mode.page = new Mode("page");
    return Mode;
}());
exports.Mode = Mode;
//# sourceMappingURL=Mode.js.map