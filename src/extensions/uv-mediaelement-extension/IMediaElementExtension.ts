import IExtension = require("../../modules/uv-shared-module/IExtension");

interface IMediaElementExtension extends IExtension{
    getEmbedScript(embedTemplate: string, width: number, height: number): string;
    getPosterImageUri(): string;
    isVideo(): boolean;
}

export = IMediaElementExtension;