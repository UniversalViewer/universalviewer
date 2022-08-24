import { DownloadDialogue as BaseDownloadDialogue } from "../../modules/uv-dialogues-module/DownloadDialogue";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { IRenderingOption } from "../../modules/uv-shared-module/IRenderingOption";
export declare class DownloadDialogue extends BaseDownloadDialogue {
    $canvasOptions: JQuery;
    $canvasOptionsContainer: JQuery;
    $downloadButton: JQuery;
    $entireFileAsOriginal: JQuery;
    $imageOptions: JQuery;
    $imageOptionsContainer: JQuery;
    $manifestOptions: JQuery;
    $manifestOptionsContainer: JQuery;
    constructor($element: JQuery);
    create(): void;
    private _isAdaptive;
    open(triggerButton: HTMLElement): void;
    addDownloadOptionsForRenderings(renderingOptions: IRenderingOption[]): void;
    isDownloadOptionAvailable(_option: DownloadOption): boolean;
}
