"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValue = void 0;
var StringValue = /** @class */ (function () {
    function StringValue(value) {
        this.value = "";
        if (value) {
            this.value = value.toLowerCase();
        }
    }
    StringValue.prototype.toString = function () {
        return this.value;
    };
    return StringValue;
}());
exports.StringValue = StringValue;
//# sourceMappingURL=StringValue.js.map