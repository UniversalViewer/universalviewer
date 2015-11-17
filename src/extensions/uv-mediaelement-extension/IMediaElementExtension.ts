
import IExtension = require("../../modules/uv-shared-module/IExtension");

interface IMediaElementExtension extends IExtension{
    isVideo(): boolean;
}

export = IMediaElementExtension;