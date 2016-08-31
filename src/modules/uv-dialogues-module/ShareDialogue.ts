import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class ShareDialogue extends Dialogue {

    $code: JQuery;
    $customSize: JQuery;
    $customSizeDropDown: JQuery;
    $embedButton: JQuery;
    $embedView: JQuery;
    $heightInput: JQuery;
    // $image: JQuery;
    // $link: JQuery;
    $shareButton: JQuery;
    $shareView: JQuery;
    $size: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $url: JQuery;
    $widthInput: JQuery;
    $shareFrame: JQuery;
    $x: JQuery;
    aspectRatio: number = .75;
    code: string;
    currentHeight: number;
    currentWidth: number;
    isEmbedViewVisible: boolean = false;
    isShareViewVisible: boolean = false;
    minWidth: number = 200;
    minHeight: number = this.minWidth * this.aspectRatio;
    maxWidth: number = 8000;
    maxHeight: number = this.maxWidth * this.aspectRatio;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('shareDialogue');
        
        super.create();

        this.openCommand = BaseCommands.SHOW_SHARE_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_SHARE_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();

            if (this.isShareAvailable()){
                this.openShareView();
            } else {
                this.openEmbedView();
            }
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        $.subscribe(BaseCommands.SHOW_EMBED_DIALOGUE, (e, params) => {
            this.open();
            this.openEmbedView();
        });

        this.$tabs = $('<div class="tabs"></div>');
        this.$content.append(this.$tabs);

        this.$shareButton = $('<a class="share tab default" tabindex="0">' + this.content.share + '</a>');
        this.$shareButton.prop('title', this.content.share);
        this.$tabs.append(this.$shareButton);

        this.$embedButton = $('<a class="embed tab" tabindex="0">' + this.content.embed + '</a>');
        this.$embedButton.prop('title', this.content.embed);
        this.$tabs.append(this.$embedButton);

        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$content.append(this.$tabsContent);

        this.$shareView = $('<div class="shareView"></div>');
        this.$tabsContent.append(this.$shareView);

        this.$url = $('<input class="url" type="text" readonly="true" />');
        this.$shareView.append(this.$url);

        this.$shareFrame = $('<iframe class="shareFrame"></iframe>');
        this.$shareView.append(this.$shareFrame);

        this.$embedView = $('<div class="embedView"></div>');
        this.$tabsContent.append(this.$embedView);

        // this.$link = $('<a target="_blank"></a>');
        // this.$embedView.find('.leftCol').append(this.$link);

        // this.$image = $('<img class="share" />');
        // this.$embedView.append(this.$image);

        this.$code = $('<input class="code" type="text" readonly="true" />');
        this.$embedView.append(this.$code);

        this.$customSize = $('<div class="customSize"></div>');
        this.$embedView.append(this.$customSize);

        this.$size = $('<span class="size">' + this.content.size  + '</span>');
        this.$customSize.append(this.$size);

        this.$customSizeDropDown = $('<select id="size"></select>');
        this.$customSize.append(this.$customSizeDropDown);
        this.$customSizeDropDown.append('<option value="small" data-width="560" data-height="420">560 x 420</option>');
        this.$customSizeDropDown.append('<option value="medium" data-width="640" data-height="480">640 x 480</option>');
        this.$customSizeDropDown.append('<option value="large" data-width="800" data-height="600">800 x 600</option>');
        this.$customSizeDropDown.append('<option value="custom">' + this.content.customSize + '</option>');

        this.$widthInput = $('<input class="width" type="text" maxlength="10" />');
        this.$customSize.append(this.$widthInput);

        this.$x = $('<span class="x">x</span>');
        this.$customSize.append(this.$x);

        this.$heightInput = $('<input class="height" type="text" maxlength="10" />');
        this.$customSize.append(this.$heightInput);

        this.$widthInput.on('keydown', (e) => {
            return Utils.Numbers.numericalInput(e);
        });

        this.$heightInput.on('keydown', (e) => {
            return Utils.Numbers.numericalInput(e);
        });

        this.$url.focus(function() {
            $(this).select();
        });

        this.$code.focus(function() {
            $(this).select();
        });

        this.$shareButton.onPressed(() => {
            this.openShareView();
        });

        this.$embedButton.onPressed(() => {
            this.openEmbedView();
        });

        this.$customSizeDropDown.change(() => {
            this.update();
        });

        this.$widthInput.change(() => {
            this.updateHeightRatio();
            this.update();
        });

        this.$heightInput.change(() => {
            this.updateWidthRatio();
            this.update();
        });

        this.$element.hide();
        this.updateShareFrame();
    }

    open(): void {
        super.open();
        this.update();
    }

    getShareUrl(): string {
        return this.extension.getShareUrl();
    }

    isShareAvailable(): boolean {
        return !!this.getShareUrl();
    }

    update(): void {

        if (this.isShareAvailable()){
            this.$shareButton.show();
            this.$url.val(this.getShareUrl());
        } else {
            this.$shareButton.hide();
        }

        var $selected: JQuery = this.getSelectedSize();

        if ($selected.val() === 'custom') {
            this.$widthInput.show();
            this.$x.show();
            this.$heightInput.show();
        } else {
            this.$widthInput.hide();
            this.$x.hide();
            this.$heightInput.hide();
            this.currentWidth = Number($selected.data('width'));
            this.currentHeight = Number($selected.data('height'));
            this.$widthInput.val(String(this.currentWidth));
            this.$heightInput.val(String(this.currentHeight));
        }
    }

    // updateThumbnail(): void {
    //     var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

    //     if (!canvas) return;

    //     var thumbnail = canvas.getProperty('thumbnail');

    //     if (!thumbnail || !_.isString(thumbnail)){
    //         thumbnail = canvas.getCanonicalImageUri(this.extension.config.options.bookmarkThumbWidth);
    //     }

    //     this.$link.attr('href', thumbnail);
    //     this.$image.attr('src', thumbnail);
    // }

    getSelectedSize(): JQuery {
        return this.$customSizeDropDown.find(':selected');
    }

    updateWidthRatio(): void {        
        this.currentHeight = Number(this.$heightInput.val());
        if (this.currentHeight < this.minHeight){
            this.currentHeight = this.minHeight;
            this.$heightInput.val(String(this.currentHeight));
        } else if (this.currentHeight > this.maxHeight){
            this.currentHeight = this.maxHeight;
            this.$heightInput.val(String(this.currentHeight));
        } 
        this.currentWidth = Math.floor(this.currentHeight / this.aspectRatio);
        this.$widthInput.val(String(this.currentWidth));
    }

    updateHeightRatio(): void {
        this.currentWidth = Number(this.$widthInput.val());
        if (this.currentWidth < this.minWidth){
            this.currentWidth = this.minWidth;
            this.$widthInput.val(String(this.currentWidth));
        } else if (this.currentWidth > this.maxWidth){
            this.currentWidth = this.maxWidth;
            this.$widthInput.val(String(this.currentWidth));
        }
        this.currentHeight = Math.floor(this.currentWidth * this.aspectRatio);
        this.$heightInput.val(String(this.currentHeight));
    }

    updateShareFrame(): void {
        var shareUrl: string = this.extension.helper.getShareServiceUrl();

        if (Utils.Bools.getBool(this.config.options.shareFrameEnabled, true) && shareUrl) {
            this.$shareFrame.prop('src', shareUrl);
            this.$shareFrame.show();
        } else {
            this.$shareFrame.hide();
        }
    }

    openShareView(): void {
        this.isShareViewVisible = true;
        this.isEmbedViewVisible = false;

        this.$embedView.hide();
        this.$shareView.show();

        this.$shareButton.addClass('on');
        this.$embedButton.removeClass('on');
        
        this.resize();
    }

    openEmbedView(): void {
        this.isShareViewVisible = false;
        this.isEmbedViewVisible = true;

        this.$embedView.show();
        this.$shareView.hide();

        this.$shareButton.removeClass('on');
        this.$embedButton.addClass('on');

        this.resize();
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

export = ShareDialogue;