
import IIxIFProvider = require("../../modules/uv-shared-module/IIxIFProvider");

interface IMediaElementProvider extends IIxIFProvider{
	getEmbedScript(embedTemplate: string, width: number, height: number): string;
    getPosterImageUri(): string;
    isVideo(): boolean;
}

export = IMediaElementProvider;