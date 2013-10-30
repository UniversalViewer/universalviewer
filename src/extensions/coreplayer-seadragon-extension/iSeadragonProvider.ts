
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface ISeadragonProvider extends IProvider{
	getDziUri(asset: any, dziBaseUri?: string, dziUriTemplate?: string): string;
	getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string;
	getEmbedScript(assetIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string;
}

export = ISeadragonProvider;