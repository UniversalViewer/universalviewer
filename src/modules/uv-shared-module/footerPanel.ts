/// <reference path="../../js/jquery.d.ts" />

import utils = require("../../utils");
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import baseView = require("./baseView");

export class FooterPanel extends baseView.BaseView {

    $options: JQuery;
    $embedButton: JQuery;
    $downloadButton: JQuery;
    $fullScreenBtn: JQuery;

    static EMBED: string = 'footer.onEmbed';
    static DOWNLOAD: string = 'footer.onDownload';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig('footerPanel');

        super.create();

        // events.
        $.subscribe(baseExtension.BaseExtension.TOGGLE_FULLSCREEN, () => {
            this.toggleFullScreen();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$embedButton = $('<a href="#" class="embed" title="' + this.content.embed + '">' + this.content.embed + '</a>');
        this.$options.append(this.$embedButton);
        this.$embedButton.attr('tabindex', '6');

        this.$downloadButton = $('<a class="download" title="' + this.content.download + '">' + this.content.download + '</a>');
        this.$options.prepend(this.$downloadButton);

        this.$fullScreenBtn = $('<a href="#" class="fullScreen" title="' + this.content.fullScreen + '">' + this.content.fullScreen + '</a>');
        this.$options.append(this.$fullScreenBtn);
        this.$fullScreenBtn.attr('tabindex', '5');

        this.$embedButton.onPressed(() => {
            $.publish(FooterPanel.EMBED);
        });

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            $.publish(FooterPanel.DOWNLOAD);
        });


        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        if (!utils.Utils.getBool(this.options.embedEnabled, true)){
            this.$embedButton.hide();
        }

        if (!utils.Utils.getBool(this.options.downloadEnabled, true)){
            this.$downloadButton.hide();
        }

        if (!utils.Utils.getBool(this.options.fullscreenEnabled, true)){
            this.$fullScreenBtn.hide();
        }

        if (this.provider.isLightbox){
            this.$fullScreenBtn.addClass('lightbox');
        }

        if (utils.Utils.getBool(this.options.minimiseButtons, false)){
            this.$options.addClass('minimiseButtons');
        }
    }

    toggleFullScreen(): void {
        if (this.extension.isFullScreen) {
            this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
            this.$fullScreenBtn.text(this.content.exitFullScreen);
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
            this.$fullScreenBtn.text(this.content.fullScreen);
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    resize(): void {
        super.resize();
    }
}