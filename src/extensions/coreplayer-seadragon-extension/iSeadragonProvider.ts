
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface ISeadragonProvider extends IProvider{
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImageUri(canvas: any, imageBaseUri?: string, imageUriTemplate?: string): string;
}

export = ISeadragonProvider;