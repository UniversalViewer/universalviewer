import IProvider = require("./IProvider");

interface IIxIFProvider extends IProvider{
    getElement(): Manifesto.IElement;
    getResources(): Manifesto.IAnnotation[];
    hasResources(): boolean;
}

export = IIxIFProvider;