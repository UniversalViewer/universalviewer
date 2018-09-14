import {DownloadDialogue as BaseDownloadDialogue} from "../../modules/uv-dialogues-module/DownloadDialogue";
import {DownloadOption} from "../../modules/uv-shared-module/DownloadOption";
import { DownloadType } from "../uv-seadragon-extension/DownloadType";
import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { IRenderingOption } from "../../modules/uv-shared-module/IRenderingOption";

export class DownloadDialogue extends BaseDownloadDialogue {

    $downloadButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
        this.$buttons.prepend(this.$downloadButton);

        const that = this;
        
        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            const $selectedOption: JQuery = that.getSelectedOption();

            const id: string = $selectedOption.attr('id');
            const label: string = $selectedOption.attr('title');
            let type: string = DownloadType.UNKNOWN;

            if (this.renderingUrls[<any>id]) {
                window.open(this.renderingUrls[<any>id]);
            }

            $.publish(BaseEvents.DOWNLOAD, [{
                "type": type,
                "label": label
            }]);

            this.close();
        });
    }

    open($triggerButton: JQuery) {

        super.open($triggerButton);

        this.addEntireFileDownloadOptions();

        this.resetDynamicDownloadOptions();

        if (this.isDownloadOptionAvailable(DownloadOption.rangeRendering)) {
            
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
            this.$downloadOptions.find('li.option input:visible:first').prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        this.resize();
    }

    addDownloadOptionsForRenderings(renderingOptions: IRenderingOption[]): void {

        renderingOptions.forEach((option: IRenderingOption) => {
            this.$downloadOptions.append(option.button);
            
            // switch (option.type) {
            //     case DownloadOption.dynamicImageRenderings:
            //         this.$imageOptions.append(option.button);
            //         break;
            //     case DownloadOption.dynamicCanvasRenderings:
            //         this.$canvasOptions.append(option.button);
            //         break;
            //     case DownloadOption.dynamicSequenceRenderings:
            //         this.$sequenceOptions.append(option.button);
            //         break;
            // }
        });

    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        return super.isDownloadOptionAvailable(option);
    }
}