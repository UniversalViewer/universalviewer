
import IProvider = require("../../modules/uv-shared-module/IProvider");

interface IVirtexProvider extends IProvider{
	getEmbedScript(embedTemplate: string, width: number, height: number): string;
}

export = IVirtexProvider;