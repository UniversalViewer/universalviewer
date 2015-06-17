
import IProvider = require("../../modules/uv-shared-module/IProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(width: number, height: number, embedTemplate: string): string;
    getPosterImageUri(): string;
}

export = IMediaElementProvider;