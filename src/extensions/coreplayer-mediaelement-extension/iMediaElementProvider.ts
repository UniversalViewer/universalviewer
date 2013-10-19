
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(width: number, height: number, embedUri: string, embedTemplate: string): string;
}

export = IMediaElementProvider;