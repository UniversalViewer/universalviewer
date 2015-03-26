
import IExtension = require("../../modules/uv-shared-module/iExtension");

interface ISeadragonExtension extends IExtension{
    getMode(): string;
    getViewerBounds(): string;
    getViewerRotation(): number;
    getCropUri(relative: boolean): string;
    getViewer(): any;
}

export = ISeadragonExtension;