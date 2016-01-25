
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
    publish(event: string, eventObj?: any[]);
    subscribe(event: string, handler: Function);
    unsubscribe(event: string);
    initPubSub();
    disposePubSub();

    //cookie(name: string);

    // jsviews
    observable: any;
    templates: any;
    views: any;
    view: any;
}

// libs
declare var easyXDM: any;
declare var OpenSeadragon: any;
declare var manifesto: IManifesto;
declare var MediaElementPlayer: any;
declare var PDFObject: any;
declare var yepnope: any;
declare var PDFJS: any;
declare var Sanitize: any;
declare var virtex: IVirtex;

// app
interface Window{
    configExtensionCallback: any;
    manifestCallback: any;
    manifesto: IManifesto;
    browserDetect: any;
    trackEvent(category: string, action: string, label: string, value?: any);
    trackVariable(slot: number, name: string, value: string, scope: number);
    $: any;
    _: any;
    DEBUG: boolean;
    webViewerLoad: any; // pdfjs
    IEXMLHttpRequest: any;
    openSeadragonViewer: any; // for testing convenience
}

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
}

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;