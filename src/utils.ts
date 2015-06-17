export class Size{
    constructor (public width: number, public height: number){}
}

export class Bools {
    static getBool(val: any, defaultVal: boolean): boolean {
        if (val === null || typeof (val) === 'undefined'){
            return defaultVal;
        }

        return val;
    }
}

export class Strings {
    static ellipsis(text: string, chars: number): string {
        if (text.length <= chars) return text;
        var trimmedText = text.substr(0, chars);
        var lastSpaceIndex = trimmedText.lastIndexOf(" ");
        if (lastSpaceIndex != -1){
            trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, lastSpaceIndex));
        }
        return trimmedText + "&hellip;";
    }

    static htmlDecode(encoded: string): string {
        var div = document.createElement('div');
        div.innerHTML = encoded;
        return div.firstChild.nodeValue;
    }
}

export class Numbers {
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
}

export class Dates {
    static getTimeStamp(): number {
        return new Date().getTime();
    }
}

export class Objects {
    static convertToPlainObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
}

export class Urls {

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

    static getQuerystringParameter(key: string, w?: Window): string {
        if (!w) w = window;
        return this.getQuerystringParameterFromString(key, w.location.search);
    }

    static getQuerystringParameterFromString(key: string, querystring: string): string {
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var match = regex.exec(querystring);
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

    static getUrlParts(url: string): any {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    static convertToRelativeUrl(url: string): string {
        var parts = this.getUrlParts(url);
        var relUri = parts.pathname + parts.searchWithin;

        if (!relUri.startsWith("/")) {
            relUri = "/" + relUri;
        }

        return relUri;
    }

    //#endregion

    //#region Events

    //static debounce(fn, debounceDuration) {
    //    // summary:
    //    //      Returns a debounced function that will make sure the given
    //    //      function is not triggered too much.
    //    // fn: Function
    //    //      Function to debounce.
    //    // debounceDuration: Number
    //    //      OPTIONAL. The amount of time in milliseconds for which we
    //    //      will debounce the function. (defaults to 100ms)
    //
    //    debounceDuration = debounceDuration || 100;
    //
    //    return function () {
    //        if (!fn.debouncing) {
    //            var args = Array.prototype.slice.apply(arguments);
    //            fn.lastReturnVal = fn.apply(window, args);
    //            fn.debouncing = true;
    //        }
    //        clearTimeout(fn.debounceTimeout);
    //        fn.debounceTimeout = setTimeout(function () {
    //            fn.debouncing = false;
    //        }, debounceDuration);
    //
    //        return fn.lastReturnVal;
    //    };
    //}

    //#endregion

    //#region Elements

    //static createElement(tagName: string, id?: string, className?: string): JQuery {
    //    var $elem = $(document.createElement(tagName));
    //
    //    if (id) $elem.attr('id', id);
    //    if (className) $elem.attr('class', className);
    //
    //    return $elem;
    //}
    //
    //static createDiv(className: string): JQuery {
    //    return Utils.createElement('div', null, className)
    //}

    //#endregion

    //#region Css

    //static loadCss(uri: string): void {
    //    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', uri));
    //}

}

export class Measurement {
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
}