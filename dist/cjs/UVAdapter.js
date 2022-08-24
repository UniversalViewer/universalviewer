"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UVAdapter = void 0;
var UVAdapter = /** @class */ (function () {
    function UVAdapter(readonly) {
        this.readonly = false;
        this.readonly = readonly;
    }
    UVAdapter.prototype.get = function (_key, _defaultValue) {
        return undefined;
    };
    UVAdapter.prototype.set = function (_key, _value) { };
    UVAdapter.prototype.dispose = function () { };
    return UVAdapter;
}());
exports.UVAdapter = UVAdapter;
//# sourceMappingURL=UVAdapter.js.map