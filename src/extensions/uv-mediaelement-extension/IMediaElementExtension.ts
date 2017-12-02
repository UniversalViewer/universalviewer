import {IExtension} from "../../modules/uv-shared-module/IExtension";

export interface IMediaElementExtension extends IExtension{
    getEmbedScript(embedTemplate: string, width: number, height: number): string;
    getPosterImageUri(): string;
    isVideo(): boolean;
}