"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFragment = void 0;
var TFragment = /** @class */ (function () {
    function TFragment(t) {
        this.t = t;
    }
    TFragment.prototype.toString = function () {
        return "" + this.t;
    };
    TFragment.fromString = function (time) {
        time = time.replace("t=", "");
        if (time.includes(",")) {
            var _a = time.split(","), start = _a[0], end = _a[1];
            return new TFragment([Number(start), Number(end)]);
        }
        return new TFragment(Number(time));
    };
    return TFragment;
}());
exports.TFragment = TFragment;
//# sourceMappingURL=TFragment.js.map