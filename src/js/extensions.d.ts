
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
    ltrim(): string;
    rtrim(): string;
    fulltrim(): string;
    toFileName(): string;
    contains(str: string): boolean;
}

// array utils
interface Array{
    clone(): Array;
    last(): any;
    contains(val: any): boolean;
}

interface JQuery {
    // plugins
    ellipsisFill(text: string): any;
    swapClass(removeClass: string, addClass: string): void;
    actualHeight(height: number);
    actualWidth(width: number);
    toggleExpandText(chars: string);

    // jsviews
    link: any;
    render: any;
}

interface JQueryStatic {
    // pubsub
    publish(event: string, eventObj?: any[]);
    subscribe(event: string, handler: Function);

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
declare var yepnope: any;

// app
interface Window{
    extension: any;
    pkgCallback: any;
    BrowserDetect: any;
    trackEvent(category: string, action: string, label: string, value?: any);
    trackVariable(slot: number, name: string, value: string, scope: number);
    $: any;
    DEV: boolean;
}

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;