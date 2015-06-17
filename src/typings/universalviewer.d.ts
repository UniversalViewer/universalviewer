interface HTMLElement{
    ontouchstart: any;
}

interface JQuery {
    // plugins
    ellipsisFill(text?: string): any;
    swapClass(removeClass: string, addClass: string): void;
    targetBlank(): void;  
    verticalMargins(): number;
    horizontalMargins(): number;
    verticalPadding(): number;
    horizontalPadding(): number;
    toggleExpandText(chars: number, callback?: () => void);
    ismouseover(): boolean;
    equaliseHeight(reset?: boolean): any;
    removeLastWord(chars: number): any;
    ellipsisHtmlFixed(chars: number, callback: () => void): any;
    toggleExpandTextByLines(lines: number, callback: () => void): any;
    onPressed(callback: () => void): any;
    onEnter(callback: () => void): any;
    enable(): void;
    disable(): void;

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
    unsubscribe(event: string);
    initPubSub();
    disposePubSub();

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
declare var Sanitize: any;

// app
interface Window{
    manifestCallback: any;
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

// google
declare function trackEvent(category: string, action: string, label: string, value?: any): void;