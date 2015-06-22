import BaseCommands = require("../../modules/uv-shared-module/Commands");
import Dialogue = require("../../modules/uv-shared-module/Dialogue");
import DownloadOption = require("./DownloadOption");
import IPDFExtension = require("./IPDFExtension");
import IPDFProvider = require("./IPDFProvider");
import RenderingFormat = require("../../modules/uv-shared-module/RenderingFormat");
import ServiceProfile = require("../../modules/uv-shared-module/ServiceProfile");
import Shell = require("../../modules/uv-shared-module/Shell");

class DownloadDialogue extends Dialogue {

    $downloadOptions: JQuery;
    $noneAvailable: JQuery;
    $title: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        $.subscribe(BaseCommands.SHOW_DOWNLOAD_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(BaseCommands.HIDE_DOWNLOAD_DIALOGUE, (e) => {
            this.close();
        });

        // create ui.
        this.$title = $('<h1>' + this.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$noneAvailable = $('<div class="noneAvailable">' + this.content.noneAvailable + '</div>');
        this.$content.append(this.$noneAvailable);

        this.$downloadOptions = $('<ol class="options"></ol>');
        this.$content.append(this.$downloadOptions);

        // hide
        this.$element.hide();
    }

    open() {
        super.open();

        if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal)) {
            this.$downloadOptions.empty();

            // add each file src
            var canvas = this.provider.getCurrentCanvas();

            _.each(canvas.media, (annotation: any) => {
                var resource = annotation.resource;
                this.addEntireFileDownloadOption(resource['@id']);
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

    addEntireFileDownloadOption(fileUri: string): void{
        this.$downloadOptions.append('<li><a href="' + fileUri + '" target="_blank" download>' + String.format(this.content.entireFileAsOriginal, this.getFileExtension(fileUri)) + '</li>');
    }

    getFileExtension(fileUri: string): string{
        return fileUri.split('.').pop();
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.entireFileAsOriginal:
                return true;
        }
    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}

export = DownloadDialogue;