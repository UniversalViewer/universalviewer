
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

interface IPDFProvider extends IProvider{
    getPDFUri(): string;
}

export = IPDFProvider;