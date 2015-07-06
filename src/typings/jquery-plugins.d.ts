interface JQueryStatic {
    mlp: any;
}

interface JQuery {
    disable(): void;
    ellipsisFill(text?: string): any;
    ellipsisHtmlFixed(chars: number, callback: () => void): any;
    enable(): void;
    equaliseHeight(reset?: boolean, average?: boolean): any;
    horizontalMargins(): number;
    horizontalPadding(): number;
    ismouseover(): boolean;
    // unevent
    on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any, wait: Number): JQuery;
    onEnter(callback: () => void): any;
    onPressed(callback: () => void): any;
    removeLastWord(chars: number): any;
    swapClass(removeClass: string, addClass: string): void;
    targetBlank(): void;
    toggleExpandText(chars: number, callback?: () => void);
    toggleExpandTextByLines(lines: number, callback: () => void): any;
    verticalMargins(): number;
    verticalPadding(): number;
}