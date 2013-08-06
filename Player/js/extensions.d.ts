
interface String {
    format(template: string, ...args: any[]): string;
    startsWith(text: string): boolean;
    ltrim(): string;
    rtrim(): string;
    fulltrim(): string;
    toFileName(): string;
}

interface Array{
    clone(): Array;
    last(): any;
}

interface JQuery {
    ellipsisFill(text: string): any;
    swapClass(removeClass: string, addClass: string): void;
    actualHeight(height: number);
    actualWidth(width: number);
    link: any;
    render: any;
}

interface JQueryStatic {
    publish(event: string, eventObj?: any[]);
    subscribe(event: string, handler: Function);
    observable: any;
    templates: any;
    views: any;
    view: any;
}

declare function escape(s: string): any;
declare function unescape(s: string): any;

declare var easyXDM: any;

declare var OpenSeadragon: any;

interface Window{
    app: any;
}