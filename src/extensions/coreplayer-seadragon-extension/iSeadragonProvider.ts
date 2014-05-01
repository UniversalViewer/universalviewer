
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface ISeadragonProvider extends IProvider{
	getImageUri(canvas: any, imageBaseUri?: string, imageUriTemplate?: string): string;
	getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string;
}

export = ISeadragonProvider;