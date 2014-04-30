
import IIIIFProvider = require("../../modules/coreplayer-shared-module/iIIIFProvider");

interface ISeadragonIIIFProvider extends IIIIFProvider{
	getIIIFUri(canvas: any, iiifBaseUri?: string, iiifUriTemplate?: string): string;
	getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string;
}

export = ISeadragonIIIFProvider;