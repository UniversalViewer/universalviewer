"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orbit = void 0;
// theta, phi, radius
var Orbit = /** @class */ (function () {
    function Orbit(t, p, r) {
        this.t = t;
        this.p = p;
        this.r = r;
    }
    Orbit.prototype.toString = function () {
        return this.t + "," + this.p + "," + this.r;
    };
    Orbit.prototype.toAttributeString = function () {
        return this.t + "rad " + this.p + "rad " + this.r + "m";
    };
    Orbit.fromString = function (orbit) {
        orbit = orbit.replace("orbit=", "");
        var orbitArr = orbit.split(",");
        return new Orbit(orbitArr[0], orbitArr[1], orbitArr[2]);
    };
    return Orbit;
}());
exports.Orbit = Orbit;
//# sourceMappingURL=Orbit.js.map