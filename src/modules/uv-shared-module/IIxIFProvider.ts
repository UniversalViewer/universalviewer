import IProvider = require("./IProvider");

interface IIxIFProvider {
    getCurrentElement(): Manifesto.IElement;
    getResources(): Manifesto.IAnnotation[];
    hasResources(): boolean;
}

export = IIxIFProvider;