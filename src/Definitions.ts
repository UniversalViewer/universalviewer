///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/>  

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
declare var PDFObject: any;
declare var yepnope: any;
declare var PDFJS: any;
declare var Sanitize: any;

// app
interface Window{
    configExtensionCallback: any;
    browserDetect: any;
    trackEvent(category: string, action: string, label: string, value?: any): void;
    trackVariable(slot: number, name: string, value: string, scope: number): void;
    trackingLabel: string;
    $: JQueryStatic;
    webViewerLoad: any; // pdfjs
    openSeadragonViewer: any; // for testing convenience
    UV: _Components.IBaseComponent;
}

interface Document {
    mozFullScreen: boolean;
    msFullscreenElement: any;
}

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;