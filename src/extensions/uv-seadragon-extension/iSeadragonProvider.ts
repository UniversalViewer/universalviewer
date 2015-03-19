
import IProvider = require("../../modules/uv-shared-module/iProvider");

interface ISeadragonProvider extends IProvider{
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImageUri(canvas: any): string;
    getTileSources(): any[];
    getCrop(asset: any, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getImage(asset: any, highRes: boolean, download: boolean): string;
}

export = ISeadragonProvider;