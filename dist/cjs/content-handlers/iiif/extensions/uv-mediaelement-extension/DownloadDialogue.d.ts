import { DownloadDialogue as BaseDownloadDialogue } from "../../modules/uv-dialogues-module/DownloadDialogue";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
export declare class DownloadDialogue extends BaseDownloadDialogue {
    constructor($element: JQuery);
    create(): void;
    open(triggerButton: HTMLElement): void;
    isDownloadOptionAvailable(option: DownloadOption): boolean;
}
