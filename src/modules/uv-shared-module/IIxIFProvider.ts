import IProvider = require("./IProvider");

interface IIxIFProvider {
    getCurrentElement(): Manifesto.IElement;
    getElementType(element?: Manifesto.IElement): Manifesto.ElementType;
    getResources(): Manifesto.IAnnotation[];
    hasParentCollection(): boolean;
    hasResources(): boolean;
}

export = IIxIFProvider;