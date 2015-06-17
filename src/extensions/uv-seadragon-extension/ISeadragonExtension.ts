import IExtension = require("../../modules/uv-shared-module/iExtension");
import Mode = require("./Mode");

interface ISeadragonExtension extends IExtension{
    getCropUri(relative: boolean): string;
    getMode(): Mode;
    getViewer(): any;
    getViewerBounds(): string;
    getViewerRotation(): number;
}

export = ISeadragonExtension;