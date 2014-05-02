
import baseProvider = require("./baseProvider");

interface IExtension{

    isFullScreen: boolean;
    mouseX: number;
    mouseY: number;
    provider: any;

    getParam(key: baseProvider.params): any;
    height(): number;
    isOverlayActive(): boolean;
    redirect(uri: string): void;
    refresh(): void;
    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
    triggerSocket(eventName: string, eventObject: any): void;
    viewManifest(manifest: any): void;
    //viewSequence(index): void;
    width(): number;
}

export = IExtension;