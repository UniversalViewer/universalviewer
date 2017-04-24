// utils v0.0.38 https://github.com/edsilv/utils
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utils = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/> 

var Utils;
(function (Utils) {
    var Async = (function () {
        function Async() {
        }
        Async.waitFor = function (test, successCallback, failureCallback, interval, maxTries, numTries) {
            if (!interval)
                interval = 200;
            if (!maxTries)
                maxTries = 100; // try 100 times over 20 seconds
            if (!numTries)
                numTries = 0;
            numTries += 1;
            if (numTries > maxTries) {
                if (failureCallback)
                    failureCallback();
            }
            else if (test()) {
                successCallback();
            }
            else {
                setTimeout(function () {
                    Async.waitFor(test, successCallback, failureCallback, interval, maxTries, numTries);
                }, interval);
            }
        };
        return Async;
    }());
    Utils.Async = Async;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Bools = (function () {
        function Bools() {
        }
        Bools.getBool = function (val, defaultVal) {
            if (val === null || typeof (val) === 'undefined') {
                return defaultVal;
            }
            return val;
        };
        return Bools;
    }());
    Utils.Bools = Bools;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Clipboard = (function () {
        function Clipboard() {
        }
        Clipboard.copy = function (text) {
            var $tempDiv = $("<div style='position:absolute;left:-9999px'>");
            var brRegex = /<br\s*[\/]?>/gi;
            text = text.replace(brRegex, "\n");
            $("body").append($tempDiv);
            $tempDiv.append(text);
            var $tempInput = $("<textarea>");
            $tempDiv.append($tempInput);
            $tempInput.val($tempDiv.text()).select();
            document.execCommand("copy");
            $tempDiv.remove();
        };
        Clipboard.supportsCopy = function () {
            return document.queryCommandSupported && document.queryCommandSupported('copy');
        };
        return Clipboard;
    }());
    Utils.Clipboard = Clipboard;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Colors = (function () {
        function Colors() {
        }
        Colors.float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            var result = [a, r, g, b];
            return result;
        };
        Colors._componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        Colors.rgbToHexString = function (rgb) {
            Colors.coalesce(rgb);
            return "#" + Colors._componentToHex(rgb[0]) + Colors._componentToHex(rgb[1]) + Colors._componentToHex(rgb[2]);
        };
        Colors.argbToHexString = function (argb) {
            return "#" + Colors._componentToHex(argb[0]) + Colors._componentToHex(argb[1]) + Colors._componentToHex(argb[2]) + Colors._componentToHex(argb[3]);
        };
        Colors.coalesce = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (typeof (arr[i]) === 'undefined')
                    arr[i] = arr[i - 1];
            }
        };
        return Colors;
    }());
    Utils.Colors = Colors;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Dates = (function () {
        function Dates() {
        }
        Dates.getTimeStamp = function () {
            return new Date().getTime();
        };
        return Dates;
    }());
    Utils.Dates = Dates;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Device = (function () {
        function Device() {
        }
        Device.getPixelRatio = function (ctx) {
            var dpr = window.devicePixelRatio || 1;
            var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            return dpr / bsr;
        };
        Device.isTouch = function () {
            return !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
        };
        return Device;
    }());
    Utils.Device = Device;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Documents = (function () {
        function Documents() {
        }
        Documents.isInIFrame = function () {
            // see http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        };
        Documents.supportsFullscreen = function () {
            var doc = document.documentElement;
            var support = doc.requestFullscreen || doc.mozRequestFullScreen ||
                doc.webkitRequestFullScreen || doc.msRequestFullscreen;
            return support !== undefined;
        };
        Documents.isHidden = function () {
            var prop = Documents.getHiddenProp();
            if (!prop)
                return false;
            return true;
            //return document[prop];
        };
        Documents.getHiddenProp = function () {
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            // if 'hidden' is natively supported just return it
            if ('hidden' in document)
                return 'hidden';
            // otherwise loop over all the known prefixes until we find one
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'Hidden') in document) {
                    return prefixes[i] + 'Hidden';
                }
            }
            // otherwise it's not supported
            return null;
        };
        return Documents;
    }());
    Utils.Documents = Documents;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Events = (function () {
        function Events() {
        }
        Events.debounce = function (fn, debounceDuration) {
            // summary:
            //      Returns a debounced function that will make sure the given
            //      function is not triggered too much.
            // fn: Function
            //      Function to debounce.
            // debounceDuration: Number
            //      OPTIONAL. The amount of time in milliseconds for which we
            //      will debounce the function. (defaults to 100ms)
            debounceDuration = debounceDuration || 100;
            return function () {
                if (!fn.debouncing) {
                    var args = Array.prototype.slice.apply(arguments);
                    fn.lastReturnVal = fn.apply(window, args);
                    fn.debouncing = true;
                }
                clearTimeout(fn.debounceTimeout);
                fn.debounceTimeout = setTimeout(function () {
                    fn.debouncing = false;
                }, debounceDuration);
                return fn.lastReturnVal;
            };
        };
        return Events;
    }());
    Utils.Events = Events;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Files = (function () {
        function Files() {
        }
        Files.simplifyMimeType = function (mime) {
            switch (mime) {
                case 'text/plain':
                    return 'txt';
                case 'image/jpeg':
                    return 'jpg';
                case 'application/msword':
                    return 'doc';
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    return 'docx';
                default:
                    var parts = mime.split('/');
                    return parts[parts.length - 1];
            }
        };
        return Files;
    }());
    Utils.Files = Files;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Keyboard = (function () {
        function Keyboard() {
        }
        Keyboard.getCharCode = function (e) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            return charCode;
        };
        return Keyboard;
    }());
    Utils.Keyboard = Keyboard;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Maths;
    (function (Maths) {
        var Vector = (function () {
            function Vector(x, y) {
                this.X = x;
                this.Y = y;
            }
            Vector.prototype.get = function () {
                return new Vector(this.X, this.Y);
            };
            Vector.prototype.set = function (x, y) {
                this.X = x;
                this.Y = y;
            };
            //get X(): number {
            //    return this._X;
            //}
            //
            //set X(value: number) {
            //    this._X = value;
            //    //this.OnPropertyChanged("X");
            //}
            //
            //get Y(): number {
            //    return this._Y;
            //}
            //
            //set Y(value: number) {
            //    this._Y = value;
            //    //this.OnPropertyChanged("Y");
            //}
            Vector.prototype.add = function (v) {
                this.X += v.X;
                this.Y += v.Y;
            };
            Vector.add = function (v1, v2) {
                return new Vector(v1.X + v2.X, v1.Y + v2.Y);
            };
            Vector.prototype.sub = function (v) {
                this.X -= v.X;
                this.Y -= v.Y;
            };
            Vector.sub = function (v1, v2) {
                return new Vector(v1.X - v2.X, v1.Y - v2.Y);
            };
            Vector.prototype.mult = function (n) {
                this.X = this.X * n;
                this.Y = this.Y * n;
            };
            Vector.mult = function (v1, v2) {
                return new Vector(v1.X * v2.X, v1.Y * v2.Y);
            };
            Vector.multN = function (v1, n) {
                return new Vector(v1.X * n, v1.Y * n);
            };
            Vector.prototype.Div = function (n) {
                this.X = this.X / n;
                this.Y = this.Y / n;
            };
            Vector.div = function (v1, v2) {
                return new Vector(v1.X / v2.X, v1.Y / v2.Y);
            };
            Vector.divN = function (v1, n) {
                return new Vector(v1.X / n, v1.Y / n);
            };
            Vector.prototype.mag = function () {
                return Math.sqrt(this.X * this.X + this.Y * this.Y);
            };
            Vector.prototype.magSq = function () {
                return (this.X * this.X + this.Y * this.Y);
            };
            Vector.prototype.normalise = function () {
                var m = this.mag();
                if (m != 0 && m != 1) {
                    this.Div(m);
                }
            };
            Vector.prototype.limit = function (max) {
                if (this.magSq() > max * max) {
                    this.normalise();
                    this.mult(max);
                }
            };
            Vector.prototype.equals = function (v) {
                return (this.X == v.X && this.Y == v.Y);
            };
            Vector.prototype.heading = function () {
                var angle = Math.atan2(-this.Y, this.X);
                return -1 * angle;
            };
            Vector.random2D = function () {
                return Vector.fromAngle((Math.random() * Math.TAU));
            };
            Vector.fromAngle = function (angle) {
                return new Vector(Math.cos(angle), Math.sin(angle));
            };
            return Vector;
        }());
        Maths.Vector = Vector;
    })(Maths = Utils.Maths || (Utils.Maths = {}));
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Measurements;
    (function (Measurements) {
        var Size = (function () {
            function Size(width, height) {
                this.width = width;
                this.height = height;
            }
            return Size;
        }());
        Measurements.Size = Size;
        var Dimensions = (function () {
            function Dimensions() {
            }
            Dimensions.fitRect = function (width1, height1, width2, height2) {
                var ratio1 = height1 / width1;
                var ratio2 = height2 / width2;
                var width = 0;
                var height = 0;
                var scale;
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
            Dimensions.hitRect = function (x, y, w, h, mx, my) {
                if (mx > x && mx < (x + w) && my > y && my < (y + h)) {
                    return true;
                }
                return false;
            };
            return Dimensions;
        }());
        Measurements.Dimensions = Dimensions;
    })(Measurements = Utils.Measurements || (Utils.Measurements = {}));
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Numbers = (function () {
        function Numbers() {
        }
        Numbers.numericalInput = function (event) {
            // Allow: backspace, delete, tab and escape
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
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
    }());
    Utils.Numbers = Numbers;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Objects = (function () {
        function Objects() {
        }
        Objects.toPlainObject = function (value) {
            value = Object(value);
            var result = {};
            for (var key in value) {
                result[key] = value[key];
            }
            return result;
        };
        return Objects;
    }());
    Utils.Objects = Objects;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Storage = (function () {
        function Storage() {
        }
        Storage.clear = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    this._memoryStorage = {};
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.clear();
                    break;
                case Utils.StorageType.local.value:
                    localStorage.clear();
                    break;
            }
        };
        Storage.clearExpired = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var items = this.getItems(storageType);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this._isExpired(item)) {
                    this.remove(item.key);
                }
            }
        };
        Storage.get = function (key, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var data = null;
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    data = this._memoryStorage[key];
                    break;
                case Utils.StorageType.session.value:
                    data = sessionStorage.getItem(key);
                    break;
                case Utils.StorageType.local.value:
                    data = localStorage.getItem(key);
                    break;
            }
            if (!data)
                return null;
            var item = null;
            try {
                item = JSON.parse(data);
            }
            catch (error) {
                return null;
            }
            if (!item)
                return null;
            if (this._isExpired(item))
                return null;
            // useful reference
            item.key = key;
            return item;
        };
        Storage._isExpired = function (item) {
            if (new Date().getTime() < item.expiresAt) {
                return false;
            }
            return true;
        };
        Storage.getItems = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var items = [];
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    var keys = Object.keys(this._memoryStorage);
                    for (var i = 0; i < keys.length; i++) {
                        var item = this.get(keys[i], Utils.StorageType.memory);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case Utils.StorageType.session.value:
                    for (var i = 0; i < sessionStorage.length; i++) {
                        var key = sessionStorage.key(i);
                        if (key) {
                            var item = this.get(key, Utils.StorageType.session);
                            if (item) {
                                items.push(item);
                            }
                        }
                    }
                    break;
                case Utils.StorageType.local.value:
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        if (key) {
                            var item = this.get(key, Utils.StorageType.local);
                            if (item) {
                                items.push(item);
                            }
                        }
                    }
                    break;
            }
            return items;
        };
        Storage.remove = function (key, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    delete this._memoryStorage[key];
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.removeItem(key);
                    break;
                case Utils.StorageType.local.value:
                    localStorage.removeItem(key);
                    break;
            }
        };
        Storage.set = function (key, value, expirationSecs, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var expirationMS = expirationSecs * 1000;
            var record = new Utils.StorageItem();
            record.value = value;
            record.expiresAt = new Date().getTime() + expirationMS;
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    this._memoryStorage[key] = JSON.stringify(record);
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.setItem(key, JSON.stringify(record));
                    break;
                case Utils.StorageType.local.value:
                    localStorage.setItem(key, JSON.stringify(record));
                    break;
            }
            return record;
        };
        return Storage;
    }());
    Storage._memoryStorage = {};
    Utils.Storage = Storage;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var StorageItem = (function () {
        function StorageItem() {
        }
        return StorageItem;
    }());
    Utils.StorageItem = StorageItem;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var StorageType = (function () {
        function StorageType(value) {
            this.value = value;
        }
        StorageType.prototype.toString = function () {
            return this.value;
        };
        return StorageType;
    }());
    StorageType.memory = new StorageType("memory");
    StorageType.session = new StorageType("session");
    StorageType.local = new StorageType("local");
    Utils.StorageType = StorageType;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Strings = (function () {
        function Strings() {
        }
        Strings.ellipsis = function (text, chars) {
            if (text.length <= chars)
                return text;
            var trimmedText = text.substr(0, chars);
            var lastSpaceIndex = trimmedText.lastIndexOf(" ");
            if (lastSpaceIndex != -1) {
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, lastSpaceIndex));
            }
            return trimmedText + "&hellip;";
        };
        Strings.htmlDecode = function (encoded) {
            var div = document.createElement('div');
            div.innerHTML = encoded;
            return div.firstChild.nodeValue;
        };
        return Strings;
    }());
    Utils.Strings = Strings;
})(Utils || (Utils = {}));

var Utils;
(function (Utils) {
    var Urls = (function () {
        function Urls() {
        }
        Urls.getHashParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
            var match = regex.exec(doc.location.hash);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.setHashParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            var newHash = "#?" + kvp;
            var url = doc.URL;
            // remove hash value (if present).
            var index = url.indexOf('#');
            if (index != -1) {
                url = url.substr(0, url.indexOf('#'));
            }
            doc.location.replace(url + newHash);
        };
        Urls.getQuerystringParameter = function (key, w) {
            if (!w)
                w = window;
            return this.getQuerystringParameterFromString(key, w.location.search);
        };
        Urls.getQuerystringParameterFromString = function (key, querystring) {
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var match = regex.exec(querystring);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.setQuerystringParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            // redirects.
            window.location.search = kvp;
        };
        Urls.updateURIKeyValuePair = function (uriSegment, key, value) {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);
            var kvp = uriSegment.split('&');
            // Array.split() returns an array with a single "" item
            // if the target string is empty. remove if present.
            if (kvp[0] == "")
                kvp.shift();
            var i = kvp.length;
            var x;
            // replace if already present.
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
        Urls.getUrlParts = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a;
        };
        Urls.convertToRelativeUrl = function (url) {
            var parts = this.getUrlParts(url);
            var relUri = parts.pathname + parts.searchWithin;
            if (!relUri.startsWith("/")) {
                relUri = "/" + relUri;
            }
            return relUri;
        };
        return Urls;
    }());
    Utils.Urls = Urls;
})(Utils || (Utils = {}));

global.Utils = module.exports = Utils;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});