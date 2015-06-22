import IExtension = require("../../modules/uv-shared-module/IExtension");
import Mode = require("./Mode");

interface ISeadragonExtension extends IExtension{
    getCropUri(relative: boolean): string;
    getMode(): Mode;
    getViewer(): any;
    getViewerBounds(): string;
    getViewerRotation(): number;
}

export = ISeadragonExtension;