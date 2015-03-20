import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import shell = require("../../modules/uv-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../../modules/uv-shared-module/dialogue");
import ISeadragonExtension = require("./iSeadragonExtension");
import ISeadragonProvider = require("./iSeadragonProvider");

export class DownloadDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $downloadOptions: JQuery;
    $currentViewAsJpgButton: JQuery;
    $wholeImageHighResAsJpgButton: JQuery;
    $wholeImageLowResAsJpgButton: JQuery;
    //$entireDocumentAsPdfButton: JQuery;
    $buttonsContainer: JQuery;
    //$previewButton: JQuery;
    $downloadButton: JQuery;

    static SHOW_DOWNLOAD_DIALOGUE: string = 'onShowDownloadDialogue';
    static HIDE_DOWNLOAD_DIALOGUE: string = 'onHideDownloadDialogue';
    static DOWNLOAD: string = 'onDownload';
    //static PREVIEW: string = 'onPreview';

    isOpened: boolean = false; // todo: use isActive?

    constructor($element: JQuery) {
        super($element);

    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        $.subscribe(DownloadDialogue.SHOW_DOWNLOAD_DIALOGUE, (e, params) => {
            this.open();
            this.opened();
        });

        $.subscribe(DownloadDialogue.HIDE_DOWNLOAD_DIALOGUE, (e) => {
            this.close();
        });

        // create ui.
        this.$title = $('<h1>' + this.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$downloadOptions = $('<ol class="options"></ol>');
        this.$content.append(this.$downloadOptions);

        this.$currentViewAsJpgButton = $('<li><input id="currentViewAsJpg" type="radio" name="downloadOptions"></input><label for="currentViewAsJpg">' + this.content.currentViewAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResAsJpgButton = $('<li><input id="wholeImageHighResAsJpg" type="radio" name="downloadOptions"></input><label for="wholeImageHighResAsJpg">' + this.content.wholeImageHighResAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$wholeImageHighResAsJpgButton);
        this.$wholeImageHighResAsJpgButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li><input id="wholeImageLowResAsJpg" type="radio" name="downloadOptions"></input><label for="wholeImageLowResAsJpg">' + this.content.wholeImageLowResAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();

        //this.$entireDocumentAsPdfButton = $('<li><input id="entireDocumentAsPdf" type="radio" name="downloadOptions"></input><label for="entireDocumentAsPdf">' + this.content.entireDocumentAsPdf + '</label></li>');
        //this.$downloadOptions.append(this.$entireDocumentAsPdfButton);
        //this.$entireDocumentAsPdfButton.hide();

        this.$buttonsContainer = $('<div class="buttons"></div>');
        this.$content.append(this.$buttonsContainer);

        //this.$previewButton = $('<a class="btn btn-primary" href="#">' + this.content.preview + '</a>');
        //this.$buttonsContainer.append(this.$previewButton);

        this.$downloadButton = $('<a class="btn btn-primary" href="#">' + this.content.download + '</a>');
        this.$buttonsContainer.append(this.$downloadButton);

        var that = this;

        // ui event handlers.
        //this.$previewButton.on('click', (e) => {
        //    e.preventDefault();
        //
        //    var selectedOption = this.getSelectedOption();
        //
        //    var id = selectedOption.attr('id');
        //    var canvas = this.provider.getCurrentCanvas();
        //
        //    switch (id){
        //        case 'currentViewAsJpg':
        //            window.open((<ISeadragonExtension>that.extension).getCropUri(false));
        //            $.publish(DownloadDialogue.PREVIEW, ['currentViewAsJpg']);
        //            break;
        //        case 'wholeImageHighResAsJpg':
        //            window.open((<ISeadragonProvider>that.provider).getImage(canvas, true, false));
        //            $.publish(DownloadDialogue.PREVIEW, ['wholeImageHighResAsJpg']);
        //            break;
        //        case 'wholeImageLowResAsJpg':
        //            window.open((<ISeadragonProvider>that.provider).getImage(canvas, false, false));
        //            $.publish(DownloadDialogue.PREVIEW, ['wholeImageLowResAsJpg']);
        //            break;
        //        //case 'entireDocumentAsPdf':
        //        //    window.open((<ISeadragonProvider>that.provider).getPDF(false));
        //        //    $.publish(DownloadDialogue.PREVIEW, ['entireDocumentAsPdf']);
        //        //    break;
        //    }
        //
        //    this.close();
        //});

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            var selectedOption = that.getSelectedOption();

            var id = selectedOption.attr('id');
            var canvas = this.provider.getCurrentCanvas();

            switch (id){
                case 'currentViewAsJpg':
                    var viewer = (<ISeadragonExtension>that.extension).getViewer();
                    window.open((<ISeadragonProvider>that.provider).getCroppedImageUri(canvas, viewer, true));
                    $.publish(DownloadDialogue.DOWNLOAD, ['currentViewAsJpg']);
                    break;
                case 'wholeImageHighResAsJpg':
                    window.open((<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, canvas.width, canvas.height));
                    $.publish(DownloadDialogue.DOWNLOAD, ['wholeImageHighResAsJpg']);
                    break;
                case 'wholeImageLowResAsJpg':
                    window.open((<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, that.options.confinedImageSize));
                    $.publish(DownloadDialogue.DOWNLOAD, ['wholeImageLowResAsJpg']);
                    break;
                //case 'entireDocumentAsPdf':
                //    window.open((<ISeadragonProvider>that.provider).getPDF(true));
                //    $.publish(DownloadDialogue.DOWNLOAD, ['entireDocumentAsPdf']);
                //    break;
            }

            this.close();
        });

        // hide
        this.$element.hide();
    }

    opened() {
        if (this.isOpened) return;

        this.isOpened = true;

        // enable download based on license code.
        if (this.isDownloadOptionAvailable("currentViewAsJpg")) {
            this.$currentViewAsJpgButton.show();
        }

        if (this.isDownloadOptionAvailable("wholeImageHighResAsJpg")) {
            this.$wholeImageHighResAsJpgButton.show();
        }

        if (this.isDownloadOptionAvailable("wholeImageLowResAsJpg")) {
            this.$wholeImageLowResAsJpgButton.show();
        }

        //if (this.isDownloadOptionAvailable("entireDocumentAsPdf")) {
        //    this.$entireDocumentAsPdfButton.show();
        //}

        //if (this.isDownloadOptionAvailable("entireFileAsOriginal")) {
        //    var canvas = this.provider.getCurrentCanvas();
        //
        //    var fileExtension = this.getFileExtension(canvas.fileUri);
        //
        //    if (fileExtension !== 'jp2'){
        //
        //        // if no sources are available, use original (mp3 or mp4)
        //        if (!canvas.sources){
        //            this.addEntireFileDownloadOption(canvas.fileUri);
        //        } else {
        //            for (var i = 0; i < canvas.sources.length; i++){
        //                this.addEntireFileDownloadOption(canvas.sources[i].src);
        //            }
        //        }
        //
        //        this.$downloadButton.hide();
        //        this.$previewButton.hide();
        //    }
        //}

        // select first option.
        this.$downloadOptions.find('input:first').prop("checked", true);

        this.resize();
    }

    //addEntireFileDownloadOption(fileUri: string): void{
    //    this.$downloadOptions.append('<li><a href="' + fileUri + '" target="_blank" download>' + String.prototype.format(this.content.entireFileAsOriginal, this.getFileExtension(fileUri)) + '</li>');
    //}

    getFileExtension(fileUri: string): string{
        return fileUri.split('.').pop();
    }

    getSelectedOption() {
        return this.$downloadOptions.find("input:checked");
    }

    isDownloadOptionAvailable(option): boolean {
        // todo: some future IIIF support required.
        return true;
    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}