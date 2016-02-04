import BaseProvider = require("./BaseProvider");
import Params = require("../../Params");

interface IExtension{
    create(): void;
    createModules(): void;
    dependenciesLoaded(): void;
    embedHeight: number;
    embedWidth: number;
    getDependencies(callback: (deps: any) => void): any;
    getExternalResources(resources?: Manifesto.IExternalResource[]): Promise<Manifesto.IExternalResource[]>;
    getParam(key: Params): any;
    height(): number;
    isFullScreen(): boolean;
    isOverlayActive(): boolean;
    loadDependencies(deps: any): void;
    mouseX: number;
    mouseY: number;
    name: string;
    provider: any;
    redirect(uri: string): void;
    refresh(): void;
    resize(): void;
    shifted: boolean;
    showMessage(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
    tabbing: boolean;
    triggerSocket(eventName: string, eventObject?: any): void;
    viewCanvas(canvasIndex): void;
    viewCollection(collection: Manifesto.ICollection): void;
    viewManifest(manifest: Manifesto.IManifest): void;
    width(): number;
}

export = IExtension;