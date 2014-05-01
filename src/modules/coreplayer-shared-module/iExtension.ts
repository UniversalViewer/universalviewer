
import baseProvider = require("./baseProvider");

interface IExtension{

    provider: any;
    currentCanvasIndex: number;
    mouseX: number;
    mouseY: number;
    isFullScreen: boolean;

    width(): number;
    height(): number;
    refresh(): void;
    redirect(uri: string): void;
    viewSequence(index): void;
    isDeepLinkingEnabled(): boolean;
    isOverlayActive(): boolean;
    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
    getParam(key: baseProvider.params): any;
    triggerSocket(eventName: string, eventObject: any): void;
}

export = IExtension;