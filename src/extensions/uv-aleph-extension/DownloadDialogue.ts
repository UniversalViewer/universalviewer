import {DownloadDialogue as BaseDownloadDialogue} from "../../modules/uv-dialogues-module/DownloadDialogue";
import {DownloadOption} from "../../modules/uv-shared-module/DownloadOption";

export class DownloadDialogue extends BaseDownloadDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();
    }

    open($triggerButton: JQuery) {
        super.open($triggerButton);

        this.addEntireFileDownloadOptions();
        this.updateNoneAvailable();

        this.resize();
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        return super.isDownloadOptionAvailable(option);
    }
}