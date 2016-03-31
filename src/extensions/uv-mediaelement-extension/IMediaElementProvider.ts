
import IProvider = require("../../modules/uv-shared-module/IProvider");

interface IMediaElementProvider extends IProvider{
	getEmbedScript(embedTemplate: string, width: number, height: number): string;
    getElement(): Manifesto.IElement;
    getPosterImageUri(): string;
    getResources(): Manifesto.IAnnotation[];
    hasResources(): boolean;
    isVideo(): boolean;
}

export = IMediaElementProvider;