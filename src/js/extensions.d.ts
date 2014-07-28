
// not included in lib.d.ts
declare function escape(s: string): any;
declare function unescape(s: string): any;

interface HTMLElement{
    ontouchstart: any;
}

// string utils
interface String {
    format(template: string, ...args: any[]): string;
    startsWith(text: string): boolean;
    endsWith(text: string): boolean;
    ltrim(): string;
    rtrim(): string;
    fulltrim(): string;
    toFileName(): string;
    contains(str: string): boolean;
    utf8_to_b64(str: string): string;
    b64_to_utf8(str: string): string;
}

// array utils
interface Array<T>{
    clone(): Array<T>;
    last(): any;
    contains(val: any): boolean;
}

interface JQuery {
    // plugins
    ellipsisFill(text: string): any;
    swapClass(removeClass: string, addClass: string): void;
    actualHeight(height: number);
    actualWidth(width: number);
    toggleExpandText(chars: number);

    // jsviews
    link: any;
    render: any;

    // unevent
    on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any, wait: Number): JQuery;
}

interface JQueryStatic {
    // pubsub
    publish(event: string, eventObj?: any[]);
    subscribe(event: string, handler: Function);
    cookie(name: string);

    // jsviews
    observable: any;
    templates: any;
    views: any;
    view: any;
}

// libs
declare var easyXDM: any;
declare var OpenSeadragon: any;
declare var MediaElementPlayer: any;
declare var PDFObject: any;
declare var yepnope: any;
declare var PDFJS: any;

// app
interface Window{
    extension: any;
    pkgCallback: any;
    manifestCallback: any;
    BrowserDetect: any;
    trackEvent(category: string, action: string, label: string, value?: any);
    trackVariable(slot: number, name: string, value: string, scope: number);
    $: any;
    _: any;
    DEBUG: boolean;
    // pdfjs
    webViewerLoad: any;
}

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;