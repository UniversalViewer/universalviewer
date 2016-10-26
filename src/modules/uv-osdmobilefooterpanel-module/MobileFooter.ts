import BaseFooterPanel = require("../uv-shared-module/FooterPanel");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");

class FooterPanel extends BaseFooterPanel {

    $rotateButton: JQuery;
    $spacer: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('mobileFooterPanel');

        super.create();

        this.$spacer = $('<div class="spacer"></div>');
        this.$options.prepend(this.$spacer);

        this.$rotateButton = $('<a class="rotate" title="' + this.content.rotateRight + '" tabindex="0">' + this.content.rotateRight + '</a>');
        this.$options.prepend(this.$rotateButton);

        this.$zoomOutButton = $('<a class="zoomOut" title="' + this.content.zoomOut + '" tabindex="0">' + this.content.zoomOut + '</a>');
        this.$options.prepend(this.$zoomOutButton);

        this.$zoomInButton = $('<a class="zoomIn" title="' + this.content.zoomIn + '" tabindex="0">' + this.content.zoomIn + '</a>');
        this.$options.prepend(this.$zoomInButton);

        this.$zoomInButton.onPressed(() => {
            $.publish(Commands.ZOOM_IN);
        });

        this.$zoomOutButton.onPressed(() => {
            $.publish(Commands.ZOOM_OUT);
        });

        this.$rotateButton.onPressed(() => {
            $.publish(Commands.ROTATE);
        });
    }

    resize(): void {
        super.resize();

        this.$options.css('left', Math.floor((this.$element.width() / 2) - (this.$options.width() / 2)));
    }
}

export = FooterPanel;