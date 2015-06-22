var Utils;
(function (Utils) {
    var Bools = (function () {
        function Bools() {
        }
        Bools.GetBool = function (val, defaultVal) {
            if (val === null || typeof (val) === 'undefined') {
                return defaultVal;
            }
            return val;
        };
        return Bools;
    })();
    Utils.Bools = Bools;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Color = (function () {
        function Color() {
        }
        Color.Float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            var result = [a, r, g, b];
            return result;
        };
        Color._ComponentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        Color.RGBToHexString = function (rgb) {
            Color.Coalesce(rgb);
            return "#" + Color._ComponentToHex(rgb[0]) + Color._ComponentToHex(rgb[1]) + Color._ComponentToHex(rgb[2]);
        };
        Color.ARGBToHexString = function (argb) {
            return "#" + Color._ComponentToHex(argb[0]) + Color._ComponentToHex(argb[1]) + Color._ComponentToHex(argb[2]) + Color._ComponentToHex(argb[3]);
        };
        Color.Coalesce = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (typeof (arr[i]) === 'undefined')
                    arr[i] = arr[i - 1];
            }
        };
        return Color;
    })();
    Utils.Color = Color;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Dates = (function () {
        function Dates() {
        }
        Dates.GetTimeStamp = function () {
            return new Date().getTime();
        };
        return Dates;
    })();
    Utils.Dates = Dates;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Measurement;
    (function (Measurement) {
        var Size = (function () {
            function Size(width, height) {
                this.width = width;
                this.height = height;
            }
            return Size;
        })();
        Measurement.Size = Size;
        var Dimensions = (function () {
            function Dimensions() {
            }
            Dimensions.FitRect = function (width1, height1, width2, height2) {
                var ratio1 = height1 / width1;
                var ratio2 = height2 / width2;
                var width, height, scale;
                if (ratio1 < ratio2) {
                    scale = width2 / width1;
                    width = width1 * scale;
                    height = height1 * scale;
                }
                if (ratio2 < ratio1) {
                    scale = height2 / height1;
                    width = width1 * scale;
                    height = height1 * scale;
                }
                return new Size(Math.floor(width), Math.floor(height));
            };
            return Dimensions;
        })();
        Measurement.Dimensions = Dimensions;
    })(Measurement = Utils.Measurement || (Utils.Measurement = {}));
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Numbers = (function () {
        function Numbers() {
        }
        Numbers.NumericalInput = function (event) {
            // Allow: backspace, delete, tab and escape
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return true;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                    return false;
                }
                return true;
            }
        };
        return Numbers;
    })();
    Utils.Numbers = Numbers;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Objects = (function () {
        function Objects() {
        }
        Objects.ConvertToPlainObject = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        return Objects;
    })();
    Utils.Objects = Objects;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Strings = (function () {
        function Strings() {
        }
        Strings.Ellipsis = function (text, chars) {
            if (text.length <= chars)
                return text;
            var trimmedText = text.substr(0, chars);
            var lastSpaceIndex = trimmedText.lastIndexOf(" ");
            if (lastSpaceIndex != -1) {
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, lastSpaceIndex));
            }
            return trimmedText + "&hellip;";
        };
        Strings.HtmlDecode = function (encoded) {
            var div = document.createElement('div');
            div.innerHTML = encoded;
            return div.firstChild.nodeValue;
        };
        return Strings;
    })();
    Utils.Strings = Strings;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Urls = (function () {
        function Urls() {
        }
        Urls.GetHashParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
            var match = regex.exec(doc.location.hash);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.SetHashParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.UpdateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            var newHash = "#?" + kvp;
            var url = doc.URL;
            // remove hash value (if present).
            var index = url.indexOf('#');
            if (index != -1) {
                url = url.substr(0, url.indexOf('#'));
            }
            doc.location.replace(url + newHash);
        };
        Urls.GetQuerystringParameter = function (key, w) {
            if (!w)
                w = window;
            return this.GetQuerystringParameterFromString(key, w.location.search);
        };
        Urls.GetQuerystringParameterFromString = function (key, querystring) {
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var match = regex.exec(querystring);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.SetQuerystringParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.UpdateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            // redirects.
            window.location.search = kvp;
        };
        Urls.UpdateURIKeyValuePair = function (uriSegment, key, value) {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);
            var kvp = uriSegment.split('&');
            // Array.split() returns an array with a single "" item
            // if the target string is empty. remove if present.
            if (kvp[0] == "")
                kvp.shift();
            var i = kvp.length;
            var x;
            while (i--) {
                x = kvp[i].split('=');
                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            // not found, so append.
            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }
            return kvp.join('&');
        };
        Urls.GetUrlParts = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a;
        };
        Urls.ConvertToRelativeUrl = function (url) {
            var parts = this.GetUrlParts(url);
            var relUri = parts.pathname + parts.searchWithin;
            if (!relUri.startsWith("/")) {
                relUri = "/" + relUri;
            }
            return relUri;
        };
        return Urls;
    })();
    Utils.Urls = Urls;
})(Utils || (Utils = {}));
