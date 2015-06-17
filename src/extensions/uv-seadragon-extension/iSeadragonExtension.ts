
import IExtension = require("../../modules/uv-shared-module/iExtension");

interface ISeadragonExtension extends IExtension{
    getCropUri(relative: boolean): string;
    getMode(): string;
    getViewer(): any;
    getViewerBounds(): string;
    getViewerRotation(): number;
}

export = ISeadragonExtension;