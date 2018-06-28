import {ThumbsView as BaseThumbsView} from "../uv-shared-module/ThumbsView";
import {Events} from "../../extensions/uv-seadragon-extension/Events";
import {ISeadragonExtension} from "../../extensions/uv-seadragon-extension/ISeadragonExtension";
import {Mode} from "../../extensions/uv-seadragon-extension/Mode";

export class ThumbsView extends BaseThumbsView {
    create(): void {

        this.setConfig('contentLeftPanel');

        super.create();

        // todo: this should be a setting
        $.subscribe(Events.MODE_CHANGED, () => {
            this.setLabel();
        });

        $.subscribe(Events.SEARCH_PREVIEW_START, (e: any, canvasIndex: number) => {
            this.searchPreviewStart(canvasIndex);
        });

        $.subscribe(Events.SEARCH_PREVIEW_FINISH, () => {
            this.searchPreviewFinish();
        });

        if (this.extension.helper.isPaged()) {
            this.$thumbs.addClass('paged');
        }

        var that = this;
        
        $.views.helpers({
            separator: function() {

                // two thumbs per line
                if (that.extension.helper.isPaged()) {
                    return ((this.data.index - 1) % 2 == 0) ? false : true;
                }

                return true; // default to one thumbnail per row
            }
        });
    }

    addSelectedClassToThumbs(index: number): void {

        const indices: number[] = this.extension.getPagedIndices(index);
        
        for (let i = 0; i < indices.length; i++) {
            this.getThumbByIndex(indices[i]).addClass('selected');
        }

    }

    isPageModeEnabled(): boolean {
        // todo: move getMode to BaseExtension. call it getIndexingMode which can be Label or Index
        if (typeof (<ISeadragonExtension>this.extension).getMode === "function") {
            return this.config.options.pageModeEnabled && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
        }
        return this.config.options.pageModeEnabled;
    }

    searchPreviewStart(canvasIndex: number): void {
        this.scrollToThumb(canvasIndex);
        const $thumb: JQuery = this.getThumbByIndex(canvasIndex);
        $thumb.addClass('searchpreview');
    }

    searchPreviewFinish(): void {
        this.scrollToThumb(this.extension.helper.canvasIndex);
        this.getAllThumbs().removeClass('searchpreview');
    }

    setLabel(): void {

        if (this.isPDF()) {
            $(this.$thumbs).find('span.index').hide();
            $(this.$thumbs).find('span.label').hide();
        } else {
            if (this.isPageModeEnabled()) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').show();
            } else {
                $(this.$thumbs).find('span.index').show();
                $(this.$thumbs).find('span.label').hide();
            }
        }
    }
}