var Utils;
(function (Utils) {
    var Async = /** @class */ (function () {
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
    var Bools = /** @class */ (function () {
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
    var Clipboard = /** @class */ (function () {
        function Clipboard() {
        }
        Clipboard.supportsCopy = function () {
            return document.queryCommandSupported && document.queryCommandSupported('copy');
        };
        Clipboard.copy = function (text) {
            text = Clipboard.convertBrToNewLine(text);
            var textArea = document.createElement("textarea");
            textArea.value = text;
            Clipboard.hideButKeepEnabled(textArea);
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        };
        Clipboard.hideButKeepEnabled = function (textArea) {
            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = '0';
            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';
        };
        Clipboard.convertBrToNewLine = function (text) {
            var brRegex = /<br\s*[\/]?>/gi;
            text = text.replace(brRegex, "\n");
            return text;
        };
        return Clipboard;
    }());
    Utils.Clipboard = Clipboard;
    var Colors = /** @class */ (function () {
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
    var Dates = /** @class */ (function () {
        function Dates() {
        }
        Dates.getTimeStamp = function () {
            return new Date().getTime();
        };
        return Dates;
    }());
    Utils.Dates = Dates;
    var Device = /** @class */ (function () {
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
    var Documents = /** @class */ (function () {
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
    var Events = /** @class */ (function () {
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
    var Files = /** @class */ (function () {
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
    var Keyboard = /** @class */ (function () {
        function Keyboard() {
        }
        Keyboard.getCharCode = function (e) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            return charCode;
        };
        return Keyboard;
    }());
    Utils.Keyboard = Keyboard;
    var Maths = /** @class */ (function () {
        function Maths() {
        }
        Maths.normalise = function (num, min, max) {
            return (num - min) / (max - min);
        };
        Maths.median = function (values) {
            values.sort(function (a, b) {
                return a - b;
            });
            var half = Math.floor(values.length / 2);
            if (values.length % 2) {
                return values[half];
            }
            else {
                return (values[half - 1] + values[half]) / 2.0;
            }
        };
        Maths.clamp = function (value, min, max) {
            return Math.min(Math.max(value, min), max);
        };
        return Maths;
    }());
    Utils.Maths = Maths;
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    Utils.Size = Size;
    var Dimensions = /** @class */ (function () {
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
            else {
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
    Utils.Dimensions = Dimensions;
    var Numbers = /** @class */ (function () {
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
    var Objects = /** @class */ (function () {
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
    var Storage = /** @class */ (function () {
        function Storage() {
        }
        Storage.clear = function (storageType) {
            if (storageType === void 0) { storageType = StorageType.memory; }
            switch (storageType.value) {
                case StorageType.memory.value:
                    this._memoryStorage = {};
                    break;
                case StorageType.session.value:
                    sessionStorage.clear();
                    break;
                case StorageType.local.value:
                    localStorage.clear();
                    break;
            }
        };
        Storage.clearExpired = function (storageType) {
            if (storageType === void 0) { storageType = StorageType.memory; }
            var items = this.getItems(storageType);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this._isExpired(item)) {
                    this.remove(item.key);
                }
            }
        };
        Storage.get = function (key, storageType) {
            if (storageType === void 0) { storageType = StorageType.memory; }
            var data = null;
            switch (storageType.value) {
                case StorageType.memory.value:
                    data = this._memoryStorage[key];
                    break;
                case StorageType.session.value:
                    data = sessionStorage.getItem(key);
                    break;
                case StorageType.local.value:
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
            if (storageType === void 0) { storageType = StorageType.memory; }
            var items = [];
            switch (storageType.value) {
                case StorageType.memory.value:
                    var keys = Object.keys(this._memoryStorage);
                    for (var i = 0; i < keys.length; i++) {
                        var item = this.get(keys[i], StorageType.memory);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case StorageType.session.value:
                    for (var i = 0; i < sessionStorage.length; i++) {
                        var key = sessionStorage.key(i);
                        if (key) {
                            var item = this.get(key, StorageType.session);
                            if (item) {
                                items.push(item);
                            }
                        }
                    }
                    break;
                case StorageType.local.value:
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        if (key) {
                            var item = this.get(key, StorageType.local);
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
            if (storageType === void 0) { storageType = StorageType.memory; }
            switch (storageType.value) {
                case StorageType.memory.value:
                    delete this._memoryStorage[key];
                    break;
                case StorageType.session.value:
                    sessionStorage.removeItem(key);
                    break;
                case StorageType.local.value:
                    localStorage.removeItem(key);
                    break;
            }
        };
        Storage.set = function (key, value, expirationSecs, storageType) {
            if (storageType === void 0) { storageType = StorageType.memory; }
            var expirationMS = expirationSecs * 1000;
            var record = new StorageItem();
            record.value = value;
            record.expiresAt = new Date().getTime() + expirationMS;
            switch (storageType.value) {
                case StorageType.memory.value:
                    this._memoryStorage[key] = JSON.stringify(record);
                    break;
                case StorageType.session.value:
                    sessionStorage.setItem(key, JSON.stringify(record));
                    break;
                case StorageType.local.value:
                    localStorage.setItem(key, JSON.stringify(record));
                    break;
            }
            return record;
        };
        Storage._memoryStorage = {};
        return Storage;
    }());
    Utils.Storage = Storage;
    var StorageItem = /** @class */ (function () {
        function StorageItem() {
        }
        return StorageItem;
    }());
    Utils.StorageItem = StorageItem;
    var StorageType = /** @class */ (function () {
        function StorageType(value) {
            this.value = value;
        }
        StorageType.prototype.toString = function () {
            return this.value;
        };
        StorageType.memory = new StorageType("memory");
        StorageType.session = new StorageType("session");
        StorageType.local = new StorageType("local");
        return StorageType;
    }());
    Utils.StorageType = StorageType;
    var Strings = /** @class */ (function () {
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
        Strings.format = function (str) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < values.length; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                str = str.replace(reg, values[i]);
            }
            return str;
        };
        Strings.isAlphanumeric = function (str) {
            return /^[a-zA-Z0-9]*$/.test(str);
        };
        Strings.toCssClass = function (str) {
            return str.replace(/[^a-z0-9]/g, function (s) {
                var c = s.charCodeAt(0);
                if (c == 32)
                    return '-';
                if (c >= 65 && c <= 90)
                    return '_' + s.toLowerCase();
                return '__' + ('000' + c.toString(16)).slice(-4);
            });
        };
        Strings.toFileName = function (str) {
            return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        };
        Strings.utf8_to_b64 = function (str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        };
        return Strings;
    }());
    Utils.Strings = Strings;
    var Urls = /** @class */ (function () {
        function Urls() {
        }
        Urls.getHashParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            if (doc && doc.location) {
                return this.getHashParameterFromString(key, doc.location.hash);
            }
            return null;
        };
        Urls.getHashParameterFromString = function (key, url) {
            var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
            var match = regex.exec(url);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.setHashParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            if (doc && doc.location) {
                var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
                var newHash = "#?" + kvp;
                var url = doc.URL;
                // remove hash value (if present).
                var index = url.indexOf('#');
                if (index != -1) {
                    url = url.substr(0, url.indexOf('#'));
                }
                doc.location.replace(url + newHash);
            }
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
            if (doc && doc.location) {
                var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
                // redirects.
                window.location.search = kvp;
            }
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
window.Utils = Utils;
