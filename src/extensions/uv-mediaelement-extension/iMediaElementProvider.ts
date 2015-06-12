
import IProvider = require("../../modules/uv-shared-module/iProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(width: number, height: number, embedTemplate: string): string;
    getPosterImageUri(): string;
}

export = IMediaElementProvider;