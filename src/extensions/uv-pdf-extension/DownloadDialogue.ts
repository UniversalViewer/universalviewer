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

        if (!this.$downloadOptions.find('li:visible').length){
            this.$noneAvailable.show();
        } else {
            // select first option.
            this.$noneAvailable.hide();
        }

        this.resize();
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        return super.isDownloadOptionAvailable(option);
    }
}

export = DownloadDialogue;