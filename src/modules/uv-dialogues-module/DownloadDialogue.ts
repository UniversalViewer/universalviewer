import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {DownloadOption} from "../uv-shared-module/DownloadOption";

export class DownloadDialogue extends Dialogue {

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

        this.openCommand = BaseEvents.SHOW_DOWNLOAD_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_DOWNLOAD_DIALOGUE;

        $.subscribe(this.openCommand, (e: any, $triggerButton: JQuery) => {
            this.open($triggerButton);
        });

        $.subscribe(this.closeCommand, () => {
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

        this.$termsOfUseButton = $('<a href="#">' + this.extension.data.config.content.termsOfUse + '</a>');
        this.$footer.append(this.$termsOfUseButton);

        this.$termsOfUseButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_TERMS_OF_USE);
        });

        // hide
        this.$element.hide();
        this.updateTermsOfUseButton();
    }

    addEntireFileDownloadOptions(): void {
        if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal)) {
            this.$downloadOptions.empty();

            // add each file src
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            let renderingFound: boolean = false;

            const renderings: Manifesto.IRendering[] = canvas.getRenderings();

            for (let i = 0; i < renderings.length; i++) {
                const rendering: Manifesto.IRendering = renderings[i];
                const renderingFormat: Manifesto.RenderingFormat = rendering.getFormat();
                let format: string = '';
                if (renderingFormat) {
                    format = renderingFormat.toString();
                }
                this.addEntireFileDownloadOption(rendering.id, <string>Manifesto.TranslationCollection.getValue(rendering.getLabel()), format);
                renderingFound = true;
            }

            if (!renderingFound) {

                let annotationFound: boolean = false;

                const annotations: Manifesto.IAnnotation[] = canvas.getContent();

                for (let i = 0; i < annotations.length; i++) {
                    const annotation: Manifesto.IAnnotation = annotations[i];
                    const body: Manifesto.IAnnotationBody[] = annotation.getBody();

                    if (body.length) {
                        const format: Manifesto.MediaType | null = body[0].getFormat();

                        if (format) {
                            this.addEntireFileDownloadOption(body[0].id, '', format.toString());
                            annotationFound = true;
                        }
                        
                    }
                }

                if (!annotationFound) {
                    this.addEntireFileDownloadOption(canvas.id, '', '');
                }

            }
        }
    }

    addEntireFileDownloadOption(uri: string, label: string, format: string): void {
        
        let fileType: string | null;

        if (format) {
            fileType = Utils.Files.simplifyMimeType(format);
        } else {
            fileType = this.getFileExtension(uri);
        }

        if (!label) {
            label = this.content.entireFileAsOriginal;
        }

        if (fileType) {
            label += " (" + fileType + ")";
        }

        this.$downloadOptions.append('<li><a href="' + uri + '" target="_blank" download tabindex="0">' + label + '</li>');
    }

    updateNoneAvailable(): void {
        if (!this.$downloadOptions.find('li:visible').length) {
            this.$noneAvailable.show();
        } else {
            // select first option.
            this.$noneAvailable.hide();
        }
    }

    updateTermsOfUseButton(): void {
        const attribution: string | null = this.extension.helper.getAttribution(); // todo: this should eventually use a suitable IIIF 'terms' field.
        
        if (Utils.Bools.getBool(this.extension.data.config.options.termsOfUseEnabled, false) && attribution) {
            this.$termsOfUseButton.show();
        } else {
            this.$termsOfUseButton.hide();
        }
    }

    getFileExtension(fileUri: string): string | null {
        let extension: string = <string>fileUri.split('.').pop();

        // if it's not a valid file extension
        if (extension.length > 5 || extension.indexOf('/') !== -1) {
            return null;
        }

        return extension;
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.entireFileAsOriginal:
                // check if ui-extensions disable it
                const uiExtensions: Manifesto.IService | null = this.extension.helper.manifest.getService(manifesto.ServiceProfile.uiExtensions());

                if (uiExtensions && !this.extension.helper.isUIEnabled('mediaDownload')) {
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