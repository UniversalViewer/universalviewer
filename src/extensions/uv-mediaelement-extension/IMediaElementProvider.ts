
import IProvider = require("../../modules/uv-shared-module/IProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(embedTemplate: string, width: number, height: number): string;
    getPosterImageUri(): string;
}

export = IMediaElementProvider;