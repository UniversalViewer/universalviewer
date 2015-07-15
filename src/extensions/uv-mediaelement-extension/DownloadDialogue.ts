import BaseCommands = require("../../modules/uv-shared-module/Commands");
import Dialogue = require("../../modules/uv-shared-module/Dialogue");
import DownloadOption = require("./DownloadOption");
import IMediaElementExtension = require("./IMediaElementExtension");
import IMediaElementProvider = require("./IMediaElementProvider");
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

            _.each(this.provider.getRenderings(canvas), (rendering: any) => {
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

    simplifyMimeType(mime: string)
    {
        switch (mime) {
        case 'text/plain':
            return 'txt';
        case 'image/jpeg':
            return 'jpg';
        case 'application/msword':
            return 'doc';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'docx';
        default:
            var parts = mime.split('/');
            return parts[parts.length - 1];
        }
    }

    addEntireFileDownloadOption(rendering: any): void{
        var fileUri = rendering['@id'];
        var label = this.provider.getLocalisedValue(rendering['label']);
        if (label) {
            label += " ({0})";
        } else {
            label = this.content.entireFileAsOriginal;
        }
        var fileType;
        if (rendering.format) {
            fileType = this.simplifyMimeType(rendering.format);
        } else {
            fileType = this.getFileExtension(fileUri);
        }
        this.$downloadOptions.append('<li><a href="' + fileUri + '" target="_blank" download>' + String.format(label, fileType) + '</li>');
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