
import IExtension = require("../../modules/uv-shared-module/IExtension");

interface IVirtexExtension extends IExtension{
    getEmbedScript(embedTemplate: string, width: number, height: number): string;
}

export = IVirtexExtension;