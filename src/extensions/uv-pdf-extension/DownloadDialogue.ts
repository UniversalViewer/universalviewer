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

    open() {
        super.open();

        if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal)) {
            this.$downloadOptions.empty();

            // add each file src
            var canvas = this.provider.getCurrentCanvas();

            _.each(canvas.getRenderings(), (rendering: any) => {
                this.addEntireFileDownloadOption(rendering);
            });
        }

        if (!this.$downloadOptions.find('li:visible').length){
            this.$noneAvailable.show();
        } else {
            // select first option.
            this.$noneAvailable.hide();
        }

        this.resize();
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.entireFileAsOriginal:
                return true;
        }
    }
}

export = DownloadDialogue;