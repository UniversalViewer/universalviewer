
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(width: number, height: number, embedTemplate: string): string;
    getPosterImageUri(): string;
}

export = IMediaElementProvider;