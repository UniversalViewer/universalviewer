/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />

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
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
String.prototype.toFileName = function () { return this.replace(/[^a-z0-9]/gi, '_').toLowerCase(); };

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

Array.prototype.clone = function () {
    return this.slice(0);
};

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

//#endregion

export class Utils{

    //#region String

    static ellipsis(text: string, chars: number): string {
        if (text.length <= chars) return text;
        var trimmedText = text.substr(0, chars);
        trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
        return trimmedText + "&hellip;";
    }

    static numericalInput(event: MSEventObj): boolean {
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

    //#region QueryString

    static getParameterByName(name: string): string {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    static addQuerystringParams(...params: string[]) {
        var qs = document.location.search;

        for (var i = 0; i < params.length; i++) {
            qs = this.addQuerystringParam(qs, params[i]);
        }

        // redirect.
        window.location.search = qs;
    }

    static addQuerystringParam(qs: string, param: any): string {
        var key = escape(param.key);
        var value = escape(param.value);

        var t = eval

            var kvp = qs.split('&');

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

    static getScaleFraction(minSize: number, currentSize: number, scaleFactor: number, maxScale: number): number {

        // get the max size.
        var maxSize = minSize * Math.pow(scaleFactor, maxScale);

        // get the current fraction of the max size.
        var n = currentSize / maxSize;

        // assuming the scaleFactor is 3.
        // log base 3 of n (3 to the what power is equal to n?)
        var l = (Math.log(n) / Math.log(scaleFactor));

        // if l = -4 it means 3 ^-4 = n

        // assuming maxScale is 4 we want the following powers to fractions map:

        // -4 = 0
        // -3 = 1/4
        // -2 = 2/4
        // -1 = 3/4
        //  0 = 1

        // the formula for getting the fraction.
        // (4 - abs(l)) / 4

        var f = (maxScale - Math.abs(l)) / maxScale;

        return f;
    }

    static getScaleFromFraction(fraction: number, minSize: number, scaleFactor: number, maxScale: number): number {
        var p = maxScale * fraction;
        return minSize * Math.pow(scaleFactor, p);
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static roundNumber(num: number, dec: number): number {
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    }

    static normalise(num: number, min: number, max: number): number {
        return (num - min) / (max - min);
    }

    static fitRect(width1: number, height1: number, width2: number, height2: number): Object {
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

        return { width: Math.floor(width), height: Math.floor(height) };
    }

    //#endregion

    //#region Uri

    static getUrlParts(url: string): any {
        var a = document.createElement('a');
        a.href = url;

        return {
            href: a.href,
            host: a.host,
            hostname: a.hostname,
            port: a.port,
            pathname: a.pathname,
            protocol: a.protocol,
            hash: a.hash,
            search: a.search
        };
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
}