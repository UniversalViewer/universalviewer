/// <reference path="js/jquery.d.ts" />
/// <reference path="js/extensions.d.ts" />

//#region String

String.prototype.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};

String.prototype.startsWith = function (str) { return this.indexOf(str) == 0; };
String.prototype.endsWith = function(str) { return this.indexOf(str, this.length - str.length) !== -1; };
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
String.prototype.toFileName = function () { return this.replace(/[^a-z0-9]/gi, '_').toLowerCase(); };
String.prototype.contains = function(str) { return this.indexOf(str) !== -1; };
String.prototype.utf8_to_b64 = function(){ return window.btoa(unescape(encodeURIComponent(this))); };
String.prototype.b64_to_utf8 = function(){ return decodeURIComponent(escape(window.atob(this))); };
String.prototype.toCssClass = function() {
    return this.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
};

//#endregion

//#region Array

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement: any, fromIndex?: number) {
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

if (!Array.prototype.clone) {
    Array.prototype.clone = function () {
        return this.slice(0);
    };
}

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

if (!Array.prototype.contains) {
    Array.prototype.contains = function (val: any){
        return this.indexOf(val) !== -1;
    };
}

//#endregion

//#region browser detection

window.browserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        // detect IE 11
        if (this.browser == 'Explorer' && this.version == '7' && navigator.userAgent.match(/Trident/i)) {
            this.version = this.searchVersionIE();
        }
    },

    searchString: function (data) {
        for (var i = 0 ; i < data.length ; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1) {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },

    searchVersionIE: function() {
        var ua = navigator.userAgent.toString().toLowerCase(),
            match = /(trident)(?:.*rv:([\w.]+))?/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ['', null, -1],
            ver;
        try {
            ver = match[2].split('.')[0]; // version
        }
        catch (err) {
            ver = 'unknown'; //
        }
        return ver;
    },

    dataBrowser:
    [
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
        { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera", identity: "Opera" },
    ]

};

window.browserDetect.init();

//#endregion

export class Size{
    constructor (public width: number, public height: number){}
}

export class Utils{

    //#region String

    static ellipsis(text: string, chars: number): string {
        if (text.length <= chars) return text;
        var trimmedText = text.substr(0, chars);
        trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
        return trimmedText + "&hellip;";
    }

    static htmlDecode(encoded: string): string {
        var div = document.createElement('div');
        div.innerHTML = encoded;
        return div.firstChild.nodeValue;
    }

    static numericalInput(event: JQueryKeyEventObject): boolean {
        // Allow: backspace, delete, tab and escape
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return true;
        } else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
                return false;
            }
            return true;
        }
    }

    //#endregion

    //#region Date

    static getTimeStamp(): number {
        return new Date().getTime();
    }

    //#endregion

    //#region QueryString

    static getHashParameter(key: string, doc?: Document): string {
        if (!doc) doc = window.document;
        var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
        var match = regex.exec(doc.location.hash);
        return(match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
    }

    static setHashParameter(key: string, value: any, doc?: Document): void{
        if (!doc) doc = window.document;

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

    static getQuerystringParameter(key: string, doc?: Document): string {
        if (!doc) doc = window.document;
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var match = regex.exec(window.location.search);
        return(match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
    }

    static setQuerystringParameter(key: string, value: any, doc?: Document): void{
        if (!doc) doc = window.document;

        var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);

        // redirects.
        window.location.search = kvp;
    }

    static updateURIKeyValuePair(uriSegment: string, key: string, value: string): string{

        key = encodeURIComponent(key);
        value = encodeURIComponent(value);

        var kvp = uriSegment.split('&');

        // Array.split() returns an array with a single "" item
        // if the target string is empty. remove if present.
        if (kvp[0] == "") kvp.shift();

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
    }

    //#endregion

    //#region Math

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static roundNumber(num: number, dec: number): number {
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    }

    static normalise(num: number, min: number, max: number): number {
        return (num - min) / (max - min);
    }

    static fitRect(width1: number, height1: number, width2: number, height2: number): Size {
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
    }

    //#endregion

    //#region Boolean

    static getBool(val: any, defaultVal: boolean): boolean {
        if (val === null || typeof (val) === 'undefined'){
            return defaultVal;
        }

        return val;
    }

    //#endregion

    //#region Uri

    static getUrlParts(url: string): any {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    static convertToRelativeUrl(url: string): string {
        var parts = this.getUrlParts(url);
        var relUri = parts.pathname + parts.search;

        if (!relUri.startsWith("/")) {
            relUri = "/" + relUri;
        }

        return relUri;
    }

    //#endregion

    //#region Events

    static debounce(fn, debounceDuration) {
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
    }

    //#endregion

    //#region Elements

    static createElement(tagName: string, id?: string, className?: string): JQuery {
        var $elem = $(document.createElement(tagName));

        if (id) $elem.attr('id', id);
        if (className) $elem.attr('class', className);

        return $elem;
    }

    static createDiv(className: string): JQuery {
        return Utils.createElement('div', null, className)
    }

    //#endregion

    //#region Css

    static loadCss(uri: string): void {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', uri));
    }

    //#endregion
}