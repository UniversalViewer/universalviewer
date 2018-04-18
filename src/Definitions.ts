interface HTMLElement{
    ontouchstart: any;
}

interface JQuery {
    // jsviews
    link: any;
    render: any;
}

interface JQueryStatic {
    // pubsub
    publish(event: string, eventObj?: any[]): void;
    subscribe(event: string, handler: Function): void;
    unsubscribe(event: string): void;
    initPubSub(): void;
    disposePubSub(): void;

    //cookie(name: string);

    // jsviews
    observable: any;
    templates: any;
    views: any;
    view: any;

    // detect mobile browser
    browser: any;
}

// libs
declare var easyXDM: any;
declare var OpenSeadragon: any;
declare var MediaElementPlayer: any;
declare var yepnope: any;
declare var PDFJS: any;
declare var Sanitize: any;
declare var WEBVR: any;

// app
interface Window {
    configExtensionCallback: any;
    browserDetect: any;
    trackEvent(category: string, action: string, label: string, value?: any): void;
    trackVariable(slot: number, name: string, value: string, scope: number): void;
    trackingLabel: string;
    $: JQueryStatic;
    webViewerLoad: any; // pdfjs
    openSeadragonViewer: any; // for testing convenience (make this generic)
    UV: any;
    THREE: any;
    Event: any;
    CustomEvent: any;
    Hls: any;
}

interface Document {
    mozFullScreen: boolean;
    msFullscreenElement: any;
}

// had to copy this from lib.es2016.array.include.d.ts as no combination of compiler options would work :-(
interface Array<T> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: T, fromIndex?: number): boolean;
}

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;