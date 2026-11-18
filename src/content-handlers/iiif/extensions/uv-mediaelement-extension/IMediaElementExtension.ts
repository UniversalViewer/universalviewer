import { IExtension } from "../../modules/uv-shared-module/IExtension";
import { PosterImages } from "../../modules/uv-shared-module/PosterImages";

export interface IMediaElementExtension extends IExtension {
  getEmbedScript(embedTemplate: string, width: number, height: number): string;
  getPosterImages(): PosterImages;
  isVideo(): boolean;
}
