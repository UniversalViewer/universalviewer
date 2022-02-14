import { IExtension } from "../../modules/uv-shared-module/IExtension";

export interface IYouTubeExtension extends IExtension {
  getEmbedScript(embedTemplate: string, width: number, height: number): string;
}
