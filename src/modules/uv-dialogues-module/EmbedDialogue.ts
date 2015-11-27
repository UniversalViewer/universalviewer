import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import Shell = require("../uv-shared-module/Shell");

class EmbedDialogue extends Dialogue {

    $code: JQuery;
    $customHeight: JQuery;
    $customSize: JQuery;
    $customSizeHeightWrap: JQuery;
    $customSizeWidthWrap: JQuery;
    $customSizeWrap: JQuery;
    $customWidth: JQuery;
    $intro: JQuery;
    $largeSize: JQuery;
    $mediumSize: JQuery;
    $sizes: JQuery;
    $smallSize: JQuery;
    $title: JQuery;
    code: string;
    currentHeight: number;
    currentWidth: number;
    largeHeight: number;
    largeWidth: number;
    mediumHeight: number;
    mediumWidth: number;
    smallHeight: number;
    smallWidth: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('embedDialogue');
        
        super.create();

        this.openCommand = BaseCommands.SHOW_EMBED_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_EMBED_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
            this.formatCode();
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.smallWidth = 560;
        this.smallHeight = 420;

        this.mediumWidth = 640;
        this.mediumHeight = 480;

        this.largeWidth = 800;
        this.largeHeight = 600;

        this.currentWidth = this.smallWidth;
        this.currentHeight = this.smallHeight;

        // create ui.
        this.$title = $('<h1>' + this.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$intro = $('<p>' + this.content.instructions + '</p>');
        this.$content.append(this.$intro);

        this.$code = $('<textarea class="code"></textarea>');
        this.$content.append(this.$code);

        this.$sizes = $('<div class="sizes"></div>');
        this.$content.append(this.$sizes);

        this.$smallSize = $('<div class="size small"></div>');
        this.$sizes.append(this.$smallSize);
        this.$smallSize.append('<p>' + this.smallWidth + ' x ' + this.smallHeight + '</p>');
        this.$smallSize.append('<div class="box"></div>');

        this.$mediumSize = $('<div class="size medium"></div>');
        this.$sizes.append(this.$mediumSize);
        this.$mediumSize.append('<p>' + this.mediumWidth + ' x ' + this.mediumHeight + '</p>');
        this.$mediumSize.append('<div class="box"></div>');

        this.$largeSize = $('<div class="size large"></div>');
        this.$sizes.append(this.$largeSize);
        this.$largeSize.append('<p>' + this.largeWidth + ' x ' + this.largeHeight + '</p>');
        this.$largeSize.append('<div class="box"></div>');

        this.$customSize = $('<div class="size custom"></div>');
        this.$sizes.append(this.$customSize);
        this.$customSize.append('<p>' + this.content.customSize + '</p>');
        this.$customSizeWrap = $('<div class="wrap"></div>');
        this.$customSize.append(this.$customSizeWrap);
        this.$customSizeWidthWrap = $('<div class="width"></div>');
        this.$customSizeWrap.append(this.$customSizeWidthWrap);
        this.$customSizeWidthWrap.append('<label for="width">' + this.content.width + '</label>');
        this.$customWidth = $('<input id="width" type="text" maxlength="5"></input>');
        this.$customSizeWidthWrap.append(this.$customWidth);
        this.$customSizeWidthWrap.append('<span>px</span>');
        this.$customSizeHeightWrap = $('<div class="height"></div>');
        this.$customSizeWrap.append(this.$customSizeHeightWrap);
        this.$customSizeHeightWrap.append('<label for="height">' + this.content.height + '</label>');
        this.$customHeight = $('<input id="height" type="text" maxlength="5"></input>');
        this.$customSizeHeightWrap.append(this.$customHeight);
        this.$customSizeHeightWrap.append('<span>px</span>');

        // initialise ui.

        // ui event handlers.
        this.$code.focus(function() {
            $(this).select()
        });

        this.$code.mouseup((e) => {
            e.preventDefault();
        });

        this.$smallSize.click((e) => {
            e.preventDefault();

            this.selectSmall();
        });

        this.$mediumSize.click((e) => {
            e.preventDefault();

            this.selectMedium();
        });

        this.$largeSize.click((e) => {
            e.preventDefault();

            this.selectLarge();
        });

        this.$customSize.click((e) => {
            e.preventDefault();

            this.selectCustom();
        });

        this.$customWidth.keydown((event) => {
            Utils.Numbers.NumericalInput(event);
        });

        this.$customWidth.keyup((event) => {
            this.getCustomSize();
        });

        this.$customHeight.keydown((event) => {
            Utils.Numbers.NumericalInput(event);
        });

        this.$customHeight.keyup((event) => {
            this.getCustomSize();
        });

        var appWidth = this.extension.width();
        var appHeight = this.extension.height();

        if (appWidth === this.smallWidth && appHeight === this.smallHeight){
            this.selectSmall();
        } else if (appWidth === this.mediumWidth && appHeight === this.mediumHeight){
            this.selectMedium();
        } else if (appWidth === this.largeWidth && appHeight === this.largeHeight){
            this.selectLarge();
        } else {
            this.selectCustom();
        }

        this.$element.hide();
    }

    selectSmall(): void {
        this.currentWidth = this.smallWidth;
        this.currentHeight = this.smallHeight;
        this.$sizes.find('.size').removeClass('selected');
        this.$smallSize.addClass('selected');
        this.formatCode();
    }

    selectMedium(): void {
        this.currentWidth = this.mediumWidth;
        this.currentHeight = this.mediumHeight;
        this.$sizes.find('.size').removeClass('selected');
        this.$mediumSize.addClass('selected');
        this.formatCode();
    }

    selectLarge(): void {
        this.currentWidth = this.largeWidth;
        this.currentHeight = this.largeHeight;
        this.$sizes.find('.size').removeClass('selected');
        this.$largeSize.addClass('selected');
        this.formatCode();
    }

    selectCustom(): void {
        if (!this.$customWidth.val()) {
            this.$customWidth.val(this.extension.embedWidth.toString());
        }

        if (!this.$customHeight.val()){
            this.$customHeight.val(this.extension.embedHeight.toString());
        }

        this.$sizes.find('.size').removeClass('selected');
        this.$customSize.addClass('selected');
        this.getCustomSize();
    }

    getCustomSize(): void {

        this.currentWidth = this.$customWidth.val();
        this.currentHeight = this.$customHeight.val();

        this.formatCode();
    }

    formatCode(): void {

    }

    close(): void {
        super.close();
    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}

export = EmbedDialogue;