import baseExtension = require("../coreplayer-shared-module/baseExtension");
import shell = require("../coreplayer-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../coreplayer-shared-module/dialogue");

export class EmbedDialogue extends dialogue.Dialogue {

    smallWidth: number;
    smallHeight: number;
    mediumWidth: number;
    mediumHeight: number;
    largeWidth: number;
    largeHeight: number;

    currentWidth: number;
    currentHeight: number;

    code: string;

    $title: JQuery;
    $intro: JQuery;
    $code: JQuery;
    $sizes: JQuery;
    $smallSize: JQuery;
    $mediumSize: JQuery;
    $largeSize: JQuery;
    $customSize: JQuery;
    $customSizeWrap: JQuery;
    $customSizeWidthWrap: JQuery;
    $customWidth: JQuery;
    $customSizeHeightWrap: JQuery;
    $customHeight: JQuery;

    static SHOW_EMBED_DIALOGUE: string = 'onShowEmbedDialogue';
    static HIDE_EMBED_DIALOGUE: string = 'onHideEmbedDialogue';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('embedDialogue');
        
        super.create();

        var that = this;

        $.subscribe(EmbedDialogue.SHOW_EMBED_DIALOGUE, (e, params) => {
            this.open();
            this.formatCode();
        });

        $.subscribe(EmbedDialogue.HIDE_EMBED_DIALOGUE, (e) => {
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
        this.$customSize.append('<p>Custom size</p>');
        this.$customSizeWrap = $('<div class="wrap"></div>');
        this.$customSize.append(this.$customSizeWrap);
        this.$customSizeWidthWrap = $('<div class="width"></div>');
        this.$customSizeWrap.append(this.$customSizeWidthWrap);
        this.$customSizeWidthWrap.append('<label for="width">Width</label>');
        this.$customWidth = $('<input id="width" type="text" maxlength="5"></input>');
        this.$customSizeWidthWrap.append(this.$customWidth);
        this.$customSizeWidthWrap.append('<span>px</span>');
        this.$customSizeHeightWrap = $('<div class="height"></div>');
        this.$customSizeWrap.append(this.$customSizeHeightWrap);
        this.$customSizeHeightWrap.append('<label for="height">Height</label>');
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

            this.currentWidth = this.smallWidth;
            this.currentHeight = this.smallHeight;

            this.formatCode();
        });

        this.$mediumSize.click((e) => {
            e.preventDefault();

            this.currentWidth = this.mediumWidth;
            this.currentHeight = this.mediumHeight;

            this.formatCode();
        });

        this.$largeSize.click((e) => {
            e.preventDefault();

            this.currentWidth = this.largeWidth;
            this.currentHeight = this.largeHeight;

            this.formatCode();
        });

        this.$smallSize.addClass('selected');

        this.$sizes.find('.size').click(function(e) {
            e.preventDefault();

            that.$sizes.find('.size').removeClass('selected');
            $(this).addClass('selected');
        });

        this.$customWidth.keydown((event) => {
            utils.Utils.numericalInput(event);
        });

        this.$customWidth.keyup((event) => {
            this.getCustomSize();
        });

        this.$customHeight.keydown((event) => {
            utils.Utils.numericalInput(event);
        });

        this.$customHeight.keyup((event) => {
            this.getCustomSize();
        });

        this.formatCode();

        this.$element.hide();
    }

    getCustomSize(): void {

        this.currentWidth = this.$customWidth.val();
        this.currentHeight = this.$customHeight.val();

        this.formatCode();
    }

    formatCode(): void {

    }

    resize(): void {

        this.$element.css({
            'top': this.extension.height() - this.$element.outerHeight(true)
        });
    }
}