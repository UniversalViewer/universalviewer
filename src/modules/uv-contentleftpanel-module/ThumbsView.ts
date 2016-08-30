import BaseThumbsView = require("../uv-shared-module/ThumbsView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class ThumbsView extends BaseThumbsView {
    create(): void {

        this.setConfig('contentLeftPanel');

        super.create();

        // todo: this should be a setting
        $.subscribe(Commands.MODE_CHANGED, (e, mode) => {
            this.setLabel();
        });

        $.subscribe(Commands.SEARCH_PREVIEW_START, (e, canvasIndex) => {
            this.searchPreviewStart(canvasIndex);
        });

        $.subscribe(Commands.SEARCH_PREVIEW_FINISH, () => {
            this.searchPreviewFinish();
        });

        if (this.extension.helper.isPaged()) {
            this.$thumbs.addClass('paged');
        }

        var that = this;
        
        $.views.helpers({
            separator: function(){
                if (that.extension.helper.isVerticallyAligned()){
                    return true; // one thumb per line
                }
                // two thumbs per line
                if (that.extension.helper.isPaged()) {
                    return ((this.data.index - 1) % 2 == 0) ? false : true;
                }

                return false;
            }
        });
    }

    addSelectedClassToThumbs(index: number): void {
        if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled()){
            var indices = this.extension.getPagedIndices(index);

            _.each(indices, (index: number) => {
                this.getThumbByIndex(index).addClass('selected');
            });
        } else {
            this.getThumbByIndex(index).addClass('selected');
        }
    }

    isPageModeEnabled(): boolean {
        if (typeof (<ISeadragonExtension>this.extension).getMode === "function") {
            return this.config.options.pageModeEnabled && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
        }
        return this.config.options.pageModeEnabled;
    }

    searchPreviewStart(canvasIndex: number): void {
        this.scrollToThumb(canvasIndex);
        var $thumb = this.getThumbByIndex(canvasIndex);
        $thumb.addClass('searchpreview');
    }

    searchPreviewFinish(): void {
        this.scrollToThumb(this.extension.helper.canvasIndex);
        this.getAllThumbs().removeClass('searchpreview');
    }

    setLabel(): void {

        if (this.isPDF()){
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

export = ThumbsView;