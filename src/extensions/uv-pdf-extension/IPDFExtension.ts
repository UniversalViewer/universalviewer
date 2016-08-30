
import IExtension = require("../../modules/uv-shared-module/IExtension");

interface IPDFExtension extends IExtension{
    getEmbedScript(embedTemplate: string, width: number, height: number): string;
}

export = IPDFExtension;