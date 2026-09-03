declare function escape(s: string): any;
declare function unescape(s: string): any;

interface CanvasRenderingContext2D {
  webkitBackingStorePixelRatio: any;
  mozBackingStorePixelRatio: any;
  msBackingStorePixelRatio: any;
  oBackingStorePixelRatio: any;
  backingStorePixelRatio: any;
}

/* interface HTMLElement {
    mozRequestFullScreen: any;
    msRequestFullscreen: any;
} */

export class Async {
  static waitFor(
    test: () => boolean,
    successCallback: () => void,
    failureCallback?: () => void,
    interval?: number,
    maxTries?: number,
    numTries?: number
  ): void {
    if (!interval) interval = 200;
    if (!maxTries) maxTries = 100; // try 100 times over 20 seconds
    if (!numTries) numTries = 0;

    numTries += 1;

    if (numTries > maxTries) {
      if (failureCallback) failureCallback();
    } else if (test()) {
      successCallback();
    } else {
      setTimeout(function () {
        Async.waitFor(
          test,
          successCallback,
          failureCallback,
          interval,
          maxTries,
          numTries
        );
      }, interval);
    }
  }
}

export class Bools {
  static getBool(val: any, defaultVal: boolean): boolean {
    if (val === null || typeof val === "undefined") {
      return defaultVal;
    }

    return val;
  }
}

export class Clipboard {
  public static supportsCopy(): boolean {
    return (
      document.queryCommandSupported && document.queryCommandSupported("copy")
    );
  }

  public static copy(text: string) {
    text = Clipboard.convertBrToNewLine(text);

    var textArea = document.createElement("textarea");
    textArea.value = text;

    Clipboard.hideButKeepEnabled(textArea);
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand("copy");

    document.body.removeChild(textArea);
  }

  private static hideButKeepEnabled(textArea: HTMLTextAreaElement) {
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = "0";
    // Clean up any borders.
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "transparent";
  }

  private static convertBrToNewLine(text: string) {
    const brRegex: RegExp = /<br\s*[\/]?>/gi;
    text = text.replace(brRegex, "\n");
    return text;
  }
}

export class Colors {
  public static float32ColorToARGB(float32Color: number): number[] {
    const a: number = (float32Color & 0xff000000) >>> 24;
    const r: number = (float32Color & 0xff0000) >>> 16;
    const g: number = (float32Color & 0xff00) >>> 8;
    const b: number = float32Color & 0xff;
    const result: number[] = [a, r, g, b];

    return result;
  }

  private static _componentToHex(c: number): string {
    const hex: string = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  public static rgbToHexString(rgb: number[]): string {
    Colors.coalesce(rgb);
    return (
      "#" +
      Colors._componentToHex(rgb[0]) +
      Colors._componentToHex(rgb[1]) +
      Colors._componentToHex(rgb[2])
    );
  }

  public static argbToHexString(argb: number[]): string {
    return (
      "#" +
      Colors._componentToHex(argb[0]) +
      Colors._componentToHex(argb[1]) +
      Colors._componentToHex(argb[2]) +
      Colors._componentToHex(argb[3])
    );
  }

  public static coalesce(arr: any[]): void {
    for (let i = 1; i < arr.length; i++) {
      if (typeof arr[i] === "undefined") arr[i] = arr[i - 1];
    }
  }
}

export class Dates {
  static getTimeStamp(): number {
    return new Date().getTime();
  }
}

export class Device {
  static getPixelRatio(ctx: CanvasRenderingContext2D): number {
    var dpr = window.devicePixelRatio || 1;
    var bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

    return dpr / bsr;
  }

  static isTouch(): boolean {
    return (
      !!("ontouchstart" in window) ||
      (<any>window).navigator.msMaxTouchPoints > 0
    );
  }
}

export class Documents {
  static isInIFrame(): boolean {
    // see http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  static supportsFullscreen(): boolean {
    const doc: any = document.documentElement;
    const support: Function =
      doc.requestFullscreen ||
      doc.mozRequestFullScreen ||
      doc.webkitRequestFullScreen ||
      doc.msRequestFullscreen;

    return support !== undefined;
  }

  static isHidden(): boolean {
    const prop: string | null = Documents.getHiddenProp();
    if (!prop) return false;
    return true;
    //return document[prop];
  }

  static getHiddenProp(): string | null {
    const prefixes: string[] = ["webkit", "moz", "ms", "o"];

    // if 'hidden' is natively supported just return it
    if ("hidden" in document) return "hidden";

    // otherwise loop over all the known prefixes until we find one
    for (let i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + "Hidden" in document) {
        return prefixes[i] + "Hidden";
      }
    }

    // otherwise it's not supported
    return null;
  }
}

export class Events {
  static debounce(fn: any, debounceDuration: number): any {
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
        const args: any = Array.prototype.slice.apply(arguments);
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
}

export class Files {
  static simplifyMimeType(mime: string): string {
    switch (mime) {
      case "text/plain":
        return "txt";
      case "image/jpeg":
        return "jpg";
      case "application/msword":
        return "doc";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "docx";
      default:
        const parts: string[] = mime.split("/");
        return parts[parts.length - 1];
    }
  }
}

export class Keyboard {
  public static getCharCode(e: KeyboardEvent): number {
    const charCode: number = typeof e.which == "number" ? e.which : e.keyCode;
    return charCode;
  }
}

export class Maths {
  static normalise(num: number, min: number, max: number): number {
    return (num - min) / (max - min);
  }

  static median(values: number[]): number {
    values.sort(function (a, b) {
      return a - b;
    });

    const half: number = Math.floor(values.length / 2);

    if (values.length % 2) {
      return values[half];
    } else {
      return (values[half - 1] + values[half]) / 2.0;
    }
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

export class Size {
  constructor(
    public width: number,
    public height: number
  ) {}
}

export class Dimensions {
  static fitRect(
    width1: number,
    height1: number,
    width2: number,
    height2: number
  ): Size {
    const ratio1: number = height1 / width1;
    const ratio2: number = height2 / width2;

    let width: number = 0;
    let height: number = 0;
    let scale: number;

    if (ratio1 < ratio2) {
      scale = width2 / width1;
      width = width1 * scale;
      height = height1 * scale;
    } else {
      scale = height2 / height1;
      width = width1 * scale;
      height = height1 * scale;
    }

    return new Size(Math.floor(width), Math.floor(height));
  }

  static hitRect(
    x: number,
    y: number,
    w: number,
    h: number,
    mx: number,
    my: number
  ) {
    if (mx > x && mx < x + w && my > y && my < y + h) {
      return true;
    }
    return false;
  }
}

export class Numbers {
  static numericalInput(event: any): boolean {
    // Allow: backspace, delete, tab and escape
    if (
      event.keyCode == 46 ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 27 ||
      // Allow: Ctrl+A
      (event.keyCode == 65 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return true;
    } else {
      // Ensure that it is a number and stop the keypress
      if (
        event.shiftKey ||
        ((event.keyCode < 48 || event.keyCode > 57) &&
          (event.keyCode < 96 || event.keyCode > 105))
      ) {
        event.preventDefault();
        return false;
      }
      return true;
    }
  }
}

export class Objects {
  static toPlainObject(value: any): any {
    value = Object(value);
    const result: any = {};
    for (const key in value) {
      result[key] = value[key];
    }
    return result;
  }
}

export class Storage {
  private static _memoryStorage: any = {};

  public static clear(storageType: StorageType = StorageType.MEMORY): void {
    switch (storageType) {
      case StorageType.MEMORY:
        this._memoryStorage = {};
        break;
      case StorageType.SESSION:
        sessionStorage.clear();
        break;
      case StorageType.LOCAL:
        localStorage.clear();
        break;
    }
  }

  public static clearExpired(
    storageType: StorageType = StorageType.MEMORY
  ): void {
    const items: StorageItem[] = this.getItems(storageType);

    for (let i = 0; i < items.length; i++) {
      var item = items[i];

      if (this._isExpired(item)) {
        this.remove(item.key);
      }
    }
  }

  public static get(
    key: string,
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem | null {
    let data: string | null = null;

    switch (storageType) {
      case StorageType.MEMORY:
        data = this._memoryStorage[key];
        break;
      case StorageType.SESSION:
        data = sessionStorage.getItem(key);
        break;
      case StorageType.LOCAL:
        data = localStorage.getItem(key);
        break;
    }

    if (!data) return null;

    let item: StorageItem | null = null;

    try {
      item = JSON.parse(data);
    } catch (error) {
      return null;
    }

    if (!item) return null;

    if (this._isExpired(item)) return null;

    // useful reference
    item.key = key;

    return item;
  }

  private static _isExpired(item: StorageItem): boolean {
    if (new Date().getTime() < item.expiresAt) {
      return false;
    }

    return true;
  }

  public static getItems(
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem[] {
    const items: StorageItem[] = [];

    switch (storageType) {
      case StorageType.MEMORY:
        const keys: string[] = Object.keys(this._memoryStorage);

        for (let i = 0; i < keys.length; i++) {
          const item: StorageItem | null = this.get(
            keys[i],
            StorageType.MEMORY
          );

          if (item) {
            items.push(item);
          }
        }

        break;
      case StorageType.SESSION:
        for (let i = 0; i < sessionStorage.length; i++) {
          const key: string | null = sessionStorage.key(i);

          if (key) {
            const item: StorageItem | null = this.get(key, StorageType.SESSION);

            if (item) {
              items.push(item);
            }
          }
        }
        break;
      case StorageType.LOCAL:
        for (let i = 0; i < localStorage.length; i++) {
          const key: string | null = localStorage.key(i);

          if (key) {
            const item: StorageItem | null = this.get(key, StorageType.LOCAL);

            if (item) {
              items.push(item);
            }
          }
        }
        break;
    }

    return items;
  }

  public static remove(
    key: string,
    storageType: StorageType = StorageType.MEMORY
  ) {
    switch (storageType) {
      case StorageType.MEMORY:
        delete this._memoryStorage[key];
        break;
      case StorageType.SESSION:
        sessionStorage.removeItem(key);
        break;
      case StorageType.LOCAL:
        localStorage.removeItem(key);
        break;
    }
  }

  public static set(
    key: string,
    value: any,
    expirationSecs: number,
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem {
    const expirationMS: number = expirationSecs * 1000;

    const record: StorageItem = new StorageItem();
    record.value = value;
    record.expiresAt = new Date().getTime() + expirationMS;

    switch (storageType) {
      case StorageType.MEMORY:
        this._memoryStorage[key] = JSON.stringify(record);
        break;
      case StorageType.SESSION:
        sessionStorage.setItem(key, JSON.stringify(record));
        break;
      case StorageType.LOCAL:
        localStorage.setItem(key, JSON.stringify(record));
        break;
    }

    return record;
  }
}

export class StorageItem {
  public key: string;
  public value: any;
  public expiresAt: number;
}

export enum StorageType {
  MEMORY = "memory",
  SESSION = "session",
  LOCAL = "local",
}

export class Strings {
  static ellipsis(text: string, chars: number): string {
    if (text.length <= chars) return text;
    let trimmedText: string = text.substr(0, chars);
    const lastSpaceIndex: number = trimmedText.lastIndexOf(" ");
    if (lastSpaceIndex != -1) {
      trimmedText = trimmedText.substr(
        0,
        Math.min(trimmedText.length, lastSpaceIndex)
      );
    }
    return trimmedText + "&hellip;";
  }

  static htmlDecode(encoded: string): string {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = encoded;
    return <string>(<Node>div.firstChild).nodeValue;
  }

  static format(str: string, ...values: string[]): string {
    for (let i = 0; i < values.length; i++) {
      const reg = new RegExp("\\{" + i + "\\}", "gm");
      str = str.replace(reg, values[i]);
    }

    return str;
  }

  static isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]*$/.test(str);
  }

  static toCssClass(str: string): string {
    return str.replace(/[^a-z0-9]/g, function (s: string) {
      var c = s.charCodeAt(0);
      if (c == 32) return "-";
      if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
      return "__" + ("000" + c.toString(16)).slice(-4);
    });
  }

  static toFileName(str: string): string {
    return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  }

  static utf8_to_b64(str: string): string {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
}

export class Urls {
  static getHashParameter(key: string, doc?: Document): string | null {
    if (!doc) doc = window.document;

    if (doc && doc.location) {
      return this.getHashParameterFromString(key, doc.location.hash);
    }

    return null;
  }

  static getHashParameterFromString(key: string, url: string): string | null {
    const regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
    const match = regex.exec(url);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
  }

  static setHashParameter(key: string, value: any, doc?: Document): void {
    if (!doc) doc = window.document;

    if (doc && doc.location) {
      const kvp = this.updateURIKeyValuePair(
        doc.location.hash.replace("#?", ""),
        key,
        value
      );
      const newHash = "#?" + kvp;
      let url = doc.URL;

      // remove hash value (if present).
      const index = url.indexOf("#");

      if (index != -1) {
        url = url.substr(0, url.indexOf("#"));
      }

      doc.location.replace(url + newHash);
    }
  }

  static getQuerystringParameter(key: string, w?: Window): string | null {
    if (!w) w = window;
    return this.getQuerystringParameterFromString(key, w.location.search);
  }

  static getQuerystringParameterFromString(
    key: string,
    querystring: string
  ): string | null {
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    const regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    const match = regex.exec(querystring);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
  }

  static setQuerystringParameter(
    key: string,
    value: any,
    doc?: Document
  ): void {
    if (!doc) doc = window.document;

    if (doc && doc.location) {
      const kvp = this.updateURIKeyValuePair(
        doc.location.hash.replace("#?", ""),
        key,
        value
      );
      // redirects.
      window.location.search = kvp;
    }
  }

  static updateURIKeyValuePair(
    uriSegment: string,
    key: string,
    value: string
  ): string {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    const kvp = uriSegment.split("&");

    // Array.split() returns an array with a single "" item
    // if the target string is empty. remove if present.
    if (kvp[0] == "") kvp.shift();

    let i = kvp.length;
    let x;

    // replace if already present.
    while (i--) {
      x = kvp[i].split("=");

      if (x[0] == key) {
        x[1] = value;
        kvp[i] = x.join("=");
        break;
      }
    }

    // not found, so append.
    if (i < 0) {
      kvp[kvp.length] = [key, value].join("=");
    }

    return kvp.join("&");
  }

  static getUrlParts(url: string): any {
    const a = document.createElement("a");
    a.href = url;
    return a;
  }

  static convertToRelativeUrl(url: string): string {
    const parts = this.getUrlParts(url);
    let relUri = parts.pathname + parts.searchWithin;

    if (!relUri.startsWith("/")) {
      relUri = "/" + relUri;
    }

    return relUri;
  }
}
