import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import DownloadOption = require("../uv-shared-module/DownloadOption");

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

        this.openCommand = BaseCommands.SHOW_DOWNLOAD_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_DOWNLOAD_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
        });

        $.subscribe(this.closeCommand, (e) => {
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

    simplifyMimeType(mime: string) {
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

    addEntireFileDownloadOption(rendering: Manifesto.IRendering): void{
        var fileUri = rendering.id;
        var label = rendering.getLabel();
        if (label) {
            label += " ({0})";
        } else {
            label = this.content.entireFileAsOriginal;
        }
        var fileType;
        if (rendering.getFormat()) {
            fileType = this.simplifyMimeType(rendering.getFormat().toString());
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

    close(): void {
        super.close();
    }

    resize(): void {

        this.$element.css({
            'top': Math.floor(this.extension.height() - this.$element.outerHeight(true))
        });
    }
}

export = DownloadDialogue;