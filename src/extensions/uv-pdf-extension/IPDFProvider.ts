
import IProvider = require("../../modules/uv-shared-module/IProvider");

interface IPDFProvider extends IProvider{
    getEmbedScript(width: number, height: number, embedTemplate: string): string;
}

export = IPDFProvider;