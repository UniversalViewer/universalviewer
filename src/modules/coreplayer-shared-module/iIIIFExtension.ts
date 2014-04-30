
import baseProvider = require("./baseIIIFProvider");

interface IIIIFExtension{

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
    isMultiCanvas(): boolean;
    isOverlayActive(): boolean;
    //getSectionByAssetIndex(index: number): any;
    //getSectionIndex(path: string): number;
    //getAssetSection(asset): any;
    getCanvasByIndex(index): any;
    //getLastAssetOrderLabel(): string;
    //getAssetIndexByOrderLabel(label: string): number;
    getCurrentCanvas(): any;
    showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
    getParam(key: baseProvider.params): any;
    triggerSocket(eventName: string, eventObject: any): void;
    //isSeeAlsoEnabled(): boolean;
}

export = IIIIFExtension;