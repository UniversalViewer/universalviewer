import BaseProvider = require("./BaseProvider");
import Params = require("./Params");

interface IExtension{

    embedHeight: number;
    embedWidth: number;
    mouseX: number;
    mouseY: number;
    name: string;
    provider: any;
    shifted: boolean;

    create(): void;
    createModules(): void;
    dependenciesLoaded(): void;
    getDependencies(callback: (deps: any) => void): any;
    getParam(key: Params): any;
    height(): number;
    isOverlayActive(): boolean;
    loadDependencies(deps: any): void;
    redirect(uri: string): void;
    refresh(): void;
    resize(): void;
    showMessage(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
    triggerSocket(eventName: string, eventObject: any): void;
    viewManifest(manifest: any): void;
    viewMedia(): void;
    width(): number;
}

export = IExtension;