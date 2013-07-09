
interface String {
    format(template: string, ...args: string[]): string;
    startsWith(text: string): bool;
    ltrim(): string;
    rtrim(): string;
    fulltrim(): string;
    toFileName(): string;
}

interface Array{
    clone(): Array;
    last(): any;
}

declare function escape(s: string): any;
declare function unescape(s: string): any;

declare var easyXDM: any;