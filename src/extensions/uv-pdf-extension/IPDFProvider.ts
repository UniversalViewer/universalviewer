
import IIxIFProvider = require("../../modules/uv-shared-module/IIxIFProvider");

interface IPDFProvider extends IIxIFProvider{
    getEmbedScript(embedTemplate: string, width: number, height: number): string;
}

export = IPDFProvider;