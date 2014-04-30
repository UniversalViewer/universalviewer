
import IExtension = require("../../modules/coreplayer-shared-module/iExtension");

interface ISeadragonIIIFExtension extends IExtension{
	getMode(): string;
    getViewerBounds(): string;
}

export = ISeadragonIIIFExtension;