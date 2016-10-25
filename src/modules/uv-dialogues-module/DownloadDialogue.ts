import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import DownloadOption = require("../uv-shared-module/DownloadOption");

class DownloadDialogue extends Dialogue {

    $downloadOptions: JQuery;
    $noneAvailable: JQuery;
    $title: JQuery;
    $footer: JQuery;
    $termsOfUseButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_DOWNLOAD_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_DOWNLOAD_DIALOGUE;

        $.subscribe(this.openCommand, (e, $triggerButton) => {
            this.open($triggerButton);
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

        this.$footer = $('<div class="footer"></div>');
        this.$content.append(this.$footer);

        this.$termsOfUseButton = $('<a href="#">' + this.extension.config.content.termsOfUse + '</a>');
        this.$footer.append(this.$termsOfUseButton);

        this.$termsOfUseButton.onPressed(() => {
            $.publish(BaseCommands.SHOW_TERMS_OF_USE);
        });

        // hide
        this.$element.hide();
        this.updateTermsOfUseButton();
    }

    addEntireFileDownloadOptions(): void {
        if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal)) {
            this.$downloadOptions.empty();

            // add each file src
            var canvas = this.extension.helper.getCurrentCanvas();

            var renderingFound: boolean = false;

            _.each(canvas.getRenderings(), (rendering: Manifesto.IRendering) => {
                var renderingFormat: Manifesto.RenderingFormat = rendering.getFormat();
                var format: string = '';
                if (renderingFormat){
                    format = renderingFormat.toString();
                }
                this.addEntireFileDownloadOption(rendering.id, Manifesto.TranslationCollection.getValue(rendering.getLabel()), format);
                renderingFound = true;
            });

            if (!renderingFound) {
                this.addEntireFileDownloadOption(canvas.id, null, null);
            }
        }
    }

    addEntireFileDownloadOption(uri: string, label: string, format: string): void{
        if (label) {
            label += " ({0})";
        } else {
            label = this.content.entireFileAsOriginal;
        }
        var fileType;
        if (format) {
            fileType = Utils.Files.simplifyMimeType(format);
        } else {
            fileType = this.getFileExtension(uri);
        }
        this.$downloadOptions.append('<li><a href="' + uri + '" target="_blank" download tabindex="0">' + String.format(label, fileType) + '</li>');
    }

    updateNoneAvailable(): void {
        if (!this.$downloadOptions.find('li:visible').length){
            this.$noneAvailable.show();
        } else {
            // select first option.
            this.$noneAvailable.hide();
        }
    }

    updateTermsOfUseButton(): void {
        var attribution: string = this.extension.helper.getAttribution(); // todo: this should eventually use a suitable IIIF 'terms' field.
        
        if (Utils.Bools.getBool(this.extension.config.options.termsOfUseEnabled, false) && attribution) {
            this.$termsOfUseButton.show();
        } else {
            this.$termsOfUseButton.hide();
        }
    }

    getFileExtension(fileUri: string): string{
        return fileUri.split('.').pop();
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.entireFileAsOriginal:
                // check if ui-extensions disable it
                var uiExtensions: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.uiExtensions());

                if (!this.extension.helper.isUIEnabled('mediaDownload')) {
                    return false;
                }
        }

        return true;
    }

    close(): void {
        super.close();
    }

    resize(): void {
        this.setDockedPosition();
    }
}

export = DownloadDialogue;