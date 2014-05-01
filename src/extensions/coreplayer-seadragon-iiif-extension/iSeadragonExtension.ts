
import IExtension = require("../../modules/coreplayer-shared-module/iExtension");

interface ISeadragonExtension extends IExtension{
	getMode(): string;
    getViewerBounds(): string;
}

export = ISeadragonExtension;