if (!Array.prototype.clone) {
    Array.prototype.clone = function () {
        return this.slice(0);
    };
}
if (!Array.prototype.contains) {
    Array.prototype.contains = function (val) {
        return this.indexOf(val) !== -1;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var i = (fromIndex || 0);
        var j = this.length;
        for (i; i < j; i++) {
            if (this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
}
Array.prototype.indexOfTest = function (test, fromIndex) {
    var i = (fromIndex || 0);
    var j = this.length;
    for (i; i < j; i++) {
        if (test(this[i]))
            return i;
    }
    return -1;
};
Array.prototype.insert = function (item, index) {
    this.splice(index, 0, item);
};
if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}
Array.prototype.move = function (fromIndex, toIndex) {
    this.splice(toIndex, 0, this.splice(fromIndex, 1)[0]);
};
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
};
Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
Math.constrain = function (value, low, high) {
    return Math.clamp(value, low, high);
};
Math.degreesToRadians = function (degrees) {
    return Math.TAU * (degrees / 360);
};
Math.distanceBetween = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.sq(x2 - x1) + Math.sq(y2 - y1));
};
Math.lerp = function (start, stop, amount) {
    return start + (stop - start) * amount;
};
Math.mag = function (a, b, c) {
    return Math.sqrt(a * a + b * b + c * c);
};
Math.map = function (value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};
Math.normalise = function (num, min, max) {
    return (num - min) / (max - min);
};
Math.radiansToDegrees = function (radians) {
    return (radians * 360) / Math.TAU;
};
/**
 * Get a random number between two numbers.
 * If 'high' isn't passed, get a number from 0 to 'low'.
 * @param {Number} low The low number.
 * @param {Number} [high] The high number.
 */
Math.randomBetween = function (low, high) {
    if (!high) {
        high = low;
        low = 0;
    }
    if (low >= high)
        return low;
    return low + (high - low) * Math.random();
};
Math.roundToDecimalPlace = function (num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};
Math.sq = function (n) {
    return n * n;
};
Math.TAU = Math.PI * 2;
Number.prototype.isInt = function () {
    return this % 1 === 0;
};
String.prototype.b64_to_utf8 = function () {
    return decodeURIComponent(escape(window.atob(this)));
};
String.prototype.contains = function (str) {
    return this.indexOf(str) !== -1;
};
String.prototype.endsWith = function (str) {
    return this.indexOf(str, this.length - str.length) !== -1;
};
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, '');
};
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, '');
};
String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};
String.prototype.toCssClass = function () {
    return this.replace(/[^a-z0-9]/g, function (s) {
        var c = s.charCodeAt(0);
        if (c == 32)
            return '-';
        if (c >= 65 && c <= 90)
            return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
};
String.prototype.toFileName = function () {
    return this.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
String.prototype.utf8_to_b64 = function () {
    return window.btoa(unescape(encodeURIComponent(this)));
};
