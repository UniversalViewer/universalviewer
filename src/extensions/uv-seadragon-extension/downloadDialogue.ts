import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import shell = require("../../modules/uv-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../../modules/uv-shared-module/dialogue");
import ISeadragonExtension = require("./iSeadragonExtension");
import ISeadragonProvider = require("./iSeadragonProvider");
import DownloadOption = require("./DownloadOption");
import ServiceProfile = require("../../modules/uv-shared-module/ServiceProfile");
import RenderingFormat = require("../../modules/uv-shared-module/RenderingFormat");

export class DownloadDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $noneAvailable: JQuery;
    $downloadOptions: JQuery;
    $currentViewAsJpgButton: JQuery;
    $wholeImageHighResAsJpgButton: JQuery;
    $wholeImageLowResAsJpgButton: JQuery;
    $entireDocumentAsDocButton: JQuery;
    $entireDocumentAsDocxButton: JQuery;
    $entireDocumentAsPdfButton: JQuery;
    $buttonsContainer: JQuery;
    $downloadButton: JQuery;

    static SHOW_DOWNLOAD_DIALOGUE: string = 'onShowDownloadDialogue';
    static HIDE_DOWNLOAD_DIALOGUE: string = 'onHideDownloadDialogue';
    static DOWNLOAD: string = 'onDownload';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        $.subscribe(DownloadDialogue.SHOW_DOWNLOAD_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(DownloadDialogue.HIDE_DOWNLOAD_DIALOGUE, (e) => {
            this.close();
        });

        // create ui.
        this.$title = $('<h1>' + this.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$noneAvailable = $('<div class="noneAvailable">' + this.content.noneAvailable + '</div>');
        this.$content.append(this.$noneAvailable);

        this.$downloadOptions = $('<ol class="options"></ol>');
        this.$content.append(this.$downloadOptions);

        this.$currentViewAsJpgButton = $('<li><input id="' + DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.currentViewAsJpg.toString() + '">' + this.content.currentViewAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResAsJpgButton = $('<li><input id="' + DownloadOption.wholeImageHighResAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.wholeImageHighResAsJpg.toString() + '">' + this.content.wholeImageHighResAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$wholeImageHighResAsJpgButton);
        this.$wholeImageHighResAsJpgButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li><input id="' + DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();

        this.$entireDocumentAsDocButton = $('<li><input id="' + DownloadOption.entireDocumentAsDoc.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.entireDocumentAsDoc.toString() + '">' + this.content.entireDocumentAsDoc + '</label></li>');
        this.$downloadOptions.append(this.$entireDocumentAsDocButton);
        this.$entireDocumentAsDocButton.hide();

        this.$entireDocumentAsDocxButton = $('<li><input id="' + DownloadOption.entireDocumentAsDocx.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.entireDocumentAsDocx.toString() + '">' + this.content.entireDocumentAsDocx + '</label></li>');
        this.$downloadOptions.append(this.$entireDocumentAsDocxButton);
        this.$entireDocumentAsDocxButton.hide();

        this.$entireDocumentAsPdfButton = $('<li><input id="' + DownloadOption.entireDocumentAsPDF.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.entireDocumentAsPDF.toString() + '">' + this.content.entireDocumentAsPdf + '</label></li>');
        this.$downloadOptions.append(this.$entireDocumentAsPdfButton);
        this.$entireDocumentAsPdfButton.hide();

        this.$buttonsContainer = $('<div class="buttons"></div>');
        this.$content.append(this.$buttonsContainer);

        this.$downloadButton = $('<a class="btn btn-primary" href="#">' + this.content.download + '</a>');
        this.$buttonsContainer.append(this.$downloadButton);

        var that = this;

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            var selectedOption = that.getSelectedOption();

            var id: string = selectedOption.attr('id');
            var canvas = this.provider.getCurrentCanvas();

            switch (id){
                case DownloadOption.currentViewAsJpg.toString():
                    var viewer = (<ISeadragonExtension>that.extension).getViewer();
                    window.open((<ISeadragonProvider>that.provider).getCroppedImageUri(canvas, viewer, true));
                    break;
                case DownloadOption.wholeImageHighResAsJpg.toString():
                    window.open((<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, canvas.width, canvas.height));
                    break;
                case DownloadOption.wholeImageLowResAsJpg.toString():
                    window.open((<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, that.options.confinedImageSize));
                    break;
                case DownloadOption.entireDocumentAsDoc.toString():
                    window.open(this.getDocUri());
                    break;
                case DownloadOption.entireDocumentAsDocx.toString():
                    window.open(this.getDocxUri());
                    break;
                case DownloadOption.entireDocumentAsPDF.toString():
                    window.open(this.getPdfUri());
                    break;
            }

            $.publish(DownloadDialogue.DOWNLOAD, [id]);

            this.close();
        });

        // hide
        this.$element.hide();
    }

    open() {
        super.open();

        if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
            this.$currentViewAsJpgButton.show();
        } else {
            this.$currentViewAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.entireDocumentAsDoc)) {
            this.$entireDocumentAsDocButton.show();
        } else {
            this.$entireDocumentAsDocButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.entireDocumentAsDocx)) {
            this.$entireDocumentAsDocxButton.show();
        } else {
            this.$entireDocumentAsDocxButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.entireDocumentAsPDF)) {
            this.$entireDocumentAsPdfButton.show();
        } else {
            this.$entireDocumentAsPdfButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageHighResAsJpg)) {
            this.$wholeImageHighResAsJpgButton.show();
        } else {
            this.$wholeImageHighResAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageLowResAsJpg)) {
            this.$wholeImageLowResAsJpgButton.show();
        } else {
            this.$wholeImageLowResAsJpgButton.hide();
        }

        if (!this.$downloadOptions.find('li:visible').length){
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        } else {
            // select first option.
            this.$downloadOptions.find('input:visible:first').prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        this.resize();
    }

    getSelectedOption() {
        return this.$downloadOptions.find("input:checked");
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        var settings: ISettings = this.provider.getSettings();

        switch (option){
            case DownloadOption.currentViewAsJpg:
                if (settings.pagingEnabled){
                    return false;
                }
                return true;
            case DownloadOption.entireDocumentAsDoc:
                if (this.getDocUri()){
                    return true;
                }
                return false;
            case DownloadOption.entireDocumentAsDocx:
                if (this.getDocxUri()){
                    return true;
                }
                return false;
            case DownloadOption.entireDocumentAsPDF:
                if (this.getPdfUri()){
                    return true;
                }
                return false;
            case DownloadOption.wholeImageHighResAsJpg:
                if (settings.pagingEnabled){
                    return false;
                }
                return true;
            case DownloadOption.wholeImageLowResAsJpg:
                if (settings.pagingEnabled){
                    return false;
                }
                return true;
        }
    }

    getUriByRenderingFormat(format: RenderingFormat): string {
        var rendering = this.provider.getRendering(this.provider.sequence, format);

        if (rendering){
            return rendering['@id'];
        }

        return null;
    }

    getDocUri(): string {
        return this.getUriByRenderingFormat(RenderingFormat.doc);
    }

    getDocxUri(): string {
        return this.getUriByRenderingFormat(RenderingFormat.docx);
    }

    getPdfUri(): string {
        return this.getUriByRenderingFormat(RenderingFormat.pdf);
    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}