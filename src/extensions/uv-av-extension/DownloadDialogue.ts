import {DownloadDialogue as BaseDownloadDialogue} from "../../modules/uv-dialogues-module/DownloadDialogue";
import {DownloadOption} from "../../modules/uv-shared-module/DownloadOption";
import { DownloadType } from "../uv-seadragon-extension/DownloadType";
import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { IRenderingOption } from "../../modules/uv-shared-module/IRenderingOption";
import {IAVExtension} from "./IAVExtension";

export class DownloadDialogue extends BaseDownloadDialogue {

    $entireFileAsOriginal: JQuery;
    $downloadButton: JQuery;
    extension: IAVExtension;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        this.$entireFileAsOriginal = $('<li class="option single"><input id="' + DownloadOption.entireFileAsOriginal.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.entireFileAsOriginal.toString() + 'label" for="' + DownloadOption.entireFileAsOriginal.toString() + '"></label></li>');
        this.$downloadOptions.append(this.$entireFileAsOriginal);
        this.$entireFileAsOriginal.hide();

        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
        this.$buttons.prepend(this.$downloadButton);

        const that = this;

        this.$downloadButton.find('.btn-primary').on('click', () => {
            $.publish(BaseEvents.EXIT_FULLSCREEN);
        });
        
        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            const $selectedOption: JQuery = that.getSelectedOption();

            const id: string = $selectedOption.attr('id');
            const label: string = $selectedOption.attr('title');
            let type: string = DownloadType.UNKNOWN;

            if (this.renderingUrls[<any>id]) {
                window.open(this.renderingUrls[<any>id]);
            } else {
                const id: string = this.getCurrentResourceId();
                window.open(id);
            }

            $.publish(BaseEvents.DOWNLOAD, [{
                "type": type,
                "label": label
            }]);

            this.close();
        });
    }

    private _isAdaptive(): boolean {
        const format: string = this.getCurrentResourceFormat();
        return format === 'mpd' || format === 'm3u8';
    }

    open($triggerButton: JQuery) {

        super.open($triggerButton);

        const hasCanvasRendering = this.isDownloadOptionAvailable(DownloadOption.dynamicCanvasRenderings) && this.extension.isThumbsViewOpen();

        if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal) && !this._isAdaptive() && !hasCanvasRendering) {
            const $input: JQuery = this.$entireFileAsOriginal.find('input');
            const $label: JQuery = this.$entireFileAsOriginal.find('label');
            const label: string = Utils.Strings.format(this.content.entireFileAsOriginalWithFormat, this.getCurrentResourceFormat());
            $label.text(label);
            $input.prop('title', label);
            this.$entireFileAsOriginal.show();
        }

        this.resetDynamicDownloadOptions();

        if (hasCanvasRendering) {
            const canvas = this.extension.helper.getCurrentCanvas();
            const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption.dynamicCanvasRenderings);
            // Add to options.
            this.addDownloadOptionsForRenderings(renderingOptions);
        }

        if (this.isDownloadOptionAvailable(DownloadOption.rangeRendering) && !this.extension.isThumbsViewOpen()) {
            
            const range: Manifesto.IRange | null = this.extension.helper.getCurrentRange();

            if (range) {
                const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(range, this.content.entireFileAsOriginal, DownloadOption.dynamicCanvasRenderings);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }

        if (!this.$downloadOptions.find('li.option:visible').length) {
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        } else {
            // select first option.
            this.$downloadOptions.find('li.option input:visible:first').prop('checked', true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        this.resize();
    }

    addDownloadOptionsForRenderings(renderingOptions: IRenderingOption[]): void {

        renderingOptions.forEach((option: IRenderingOption) => {
            this.$downloadOptions.append(option.button);
        });

    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        return super.isDownloadOptionAvailable(option);
    }
}
