
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface IPDFProvider extends IProvider{
    getEmbedScript(width: number, height: number, embedTemplate: string): string;
    getPDFUri(): string;
}

export = IPDFProvider;