
import IExtension = require("../../modules/uv-shared-module/iExtension");

interface ISeadragonExtension extends IExtension{
    getMode(): string;
    getViewerBounds(): string;
    getViewerRotation(): number;
}

export = ISeadragonExtension;