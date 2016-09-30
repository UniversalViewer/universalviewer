import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class ShareDialogue extends Dialogue {

    $code: JQuery;
    $customSize: JQuery;
    $customSizeDropDown: JQuery;
    $embedButton: JQuery;
    $embedHeader: JQuery;
    $embedView: JQuery;
    $footer: JQuery;
    $heightInput: JQuery;
    $iiifButton: JQuery;
    $shareButton: JQuery;
    $shareFrame: JQuery;
    $shareHeader: JQuery;
    $shareInput: JQuery;
    $shareLink: JQuery;
    $shareView: JQuery;
    $size: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $termsOfUseButton: JQuery;
    $widthInput: JQuery;
    $x: JQuery;
    aspectRatio: number = .75;
    code: string;
    currentHeight: number;
    currentWidth: number;
    isEmbedViewVisible: boolean = false;
    isShareViewVisible: boolean = false;
    maxHeight: number = this.maxWidth * this.aspectRatio;
    maxWidth: number = 8000;
    minHeight: number = this.minWidth * this.aspectRatio;
    minWidth: number = 200;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('shareDialogue');
        
        super.create();

        this.openCommand = BaseCommands.SHOW_SHARE_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_SHARE_DIALOGUE;

        $.subscribe(this.openCommand, (e, $triggerButton) => {
            this.open($triggerButton);

            if (this.isShareAvailable()){
                this.openShareView();
            } else {
                this.openEmbedView();
            }
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        $.subscribe(BaseCommands.SHOW_EMBED_DIALOGUE, (e, $triggerButton) => {
            this.open($triggerButton);
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

        this.$footer = $('<div class="footer"></div>');
        this.$content.append(this.$footer);

        this.$shareView = $('<div class="shareView view"></div>');
        this.$tabsContent.append(this.$shareView);

        this.$shareHeader = $('<div class="header"></div>');
        this.$shareView.append(this.$shareHeader);

        this.$shareLink = $('<a class="shareLink" onclick="return false;"></a>');
        this.$shareView.append(this.$shareLink);

        this.$shareInput = $('<input class="shareInput" type="text" readonly="true" />');
        this.$shareView.append(this.$shareInput);

        this.$shareFrame = $('<iframe class="shareFrame"></iframe>');
        this.$shareView.append(this.$shareFrame);

        this.$embedView = $('<div class="embedView view"></div>');
        this.$tabsContent.append(this.$embedView);

        this.$embedHeader = $('<div class="header"></div>');
        this.$embedView.append(this.$embedHeader);

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

        var iiifUrl: string = this.extension.getIIIFShareUrl();

        this.$iiifButton = $('<a class="imageBtn iiif" href="' + iiifUrl + '" title="' + this.content.iiif + '" target="_blank"></a>');
        this.$footer.append(this.$iiifButton);

        this.$termsOfUseButton = $('<a href="#">' + this.extension.config.content.termsOfUse + '</a>');
        this.$footer.append(this.$termsOfUseButton);

        this.$widthInput.on('keydown', (e) => {
            return Utils.Numbers.numericalInput(e);
        });

        this.$heightInput.on('keydown', (e) => {
            return Utils.Numbers.numericalInput(e);
        });

        this.$shareInput.focus(function() {
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

        this.$termsOfUseButton.onPressed(() => {
            $.publish(BaseCommands.SHOW_TERMS_OF_USE);
        });

        this.$element.hide();
        this.updateInstructions();
        this.updateShareOptions();
        this.updateShareFrame();
        this.updateTermsOfUseButton();
    }

    open($triggerButton?: JQuery): void {
        super.open($triggerButton);
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

    updateShareOptions(): void {
        
        this.$shareInput.val(this.getShareUrl());
        this.$shareLink.prop('href', this.getShareUrl());
        this.$shareLink.text(this.getShareUrl());
        
        if ($.browser.mobile){
            this.$shareInput.hide();
            this.$shareLink.show();
        } else {
            this.$shareInput.show();
            this.$shareLink.hide();
        }
    }

    updateInstructions(): void {
        if (Utils.Bools.getBool(this.options.instructionsEnabled, false)) {
            this.$shareHeader.show();
            this.$embedHeader.show();
            this.$shareHeader.text(this.content.shareInstructions);
            this.$embedHeader.text(this.content.embedInstructions);
        } else {
            this.$shareHeader.hide();
            this.$embedHeader.hide();
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

    updateTermsOfUseButton(): void {
        var attribution: string = this.extension.helper.getAttribution(); // todo: this should eventually use a suitable IIIF 'terms' field.
        
        if (Utils.Bools.getBool(this.extension.config.options.termsOfUseEnabled, false) && attribution) {
            this.$termsOfUseButton.show();
        } else {
            this.$termsOfUseButton.hide();
        }
    }

    openShareView(): void {

        this.isShareViewVisible = true;
        this.isEmbedViewVisible = false;

        this.$embedView.hide();
        this.$shareView.show();

        this.$shareButton.addClass('on default');
        this.$embedButton.removeClass('on default');

        this.resize();
    }

    openEmbedView(): void {

        this.isShareViewVisible = false;
        this.isEmbedViewVisible = true;

        this.$embedView.show();
        this.$shareView.hide();

        this.$shareButton.removeClass('on default');
        this.$embedButton.addClass('on default');

        this.resize();
    }

    close(): void {
        super.close();
    }

    getViews(): JQuery {
        return this.$tabsContent.find('.view');
    }

    equaliseViewHeights(): void {
        this.getViews().equaliseHeight(true);
    }

    resize(): void {
        this.equaliseViewHeights();
        this.setDockedPosition();
    }
}

export = ShareDialogue;