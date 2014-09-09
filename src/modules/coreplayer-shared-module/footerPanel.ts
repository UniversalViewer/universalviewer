/// <reference path="../../js/jquery.d.ts" />

import utils = require("../../utils");
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import baseView = require("./baseView");

export class FooterPanel extends baseView.BaseView {

    $options: JQuery;
    $embedButton: JQuery;
    $fullScreenBtn: JQuery;

    static EMBED: string = 'footer.onEmbed';

    constructor($element: JQuery) {
        //super($element, true, false);
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

        this.$embedButton = $('<a href="#" class="imageBtn embed" title="' + this.content.embed + '"></a>');
        this.$options.append(this.$embedButton);

        this.$fullScreenBtn = $('<a href="#" class="imageBtn fullScreen" title="' + this.content.fullScreen + '"></a>');
        this.$options.append(this.$fullScreenBtn);

        this.$embedButton.on('click', (e) => {
            e.preventDefault();

            $.publish(FooterPanel.EMBED);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        if (!utils.Utils.getBool(this.options.embedEnabled, true)){
            this.$embedButton.hide();
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
            this.$fullScreenBtn.swapClass('fullScreen', 'normal');
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('normal', 'fullScreen');
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    resize(): void {
        super.resize();
    }
}