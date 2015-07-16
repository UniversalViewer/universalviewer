import BaseCommands = require("../uv-shared-module/Commands");
import Dialogue = require("../uv-shared-module/Dialogue");
import DownloadOption = require("./DownloadOption");

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
        // this needs to be overridden in extension-specific subclasses.
        return false;
    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}

export = DownloadDialogue;