import BaseDownloadDialogue = require("../../modules/uv-dialogues-module/DownloadDialogue");
import DownloadOption = require("../../modules/uv-shared-module/DownloadOption");

class DownloadDialogue extends BaseDownloadDialogue {

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

export = DownloadDialogue;