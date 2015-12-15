import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import Commands = require("../../extensions/uv-mediaelement-extension/Commands");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import IMediaElementProvider = require("../../extensions/uv-mediaelement-extension/IMediaElementProvider");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import IMediaElementExtension = require("../../extensions/uv-mediaelement-extension/IMediaElementExtension");

class VirtexCenterPanel extends CenterPanel {

    $navigation: JQuery;
    $viewport: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;
    title: string;
    viewport: Virtex.Viewport;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('virtexCenterPanel');

        super.create();

        var that = this;

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, (e, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.$navigation = $('<div class="navigation"></div>');
        this.$content.prepend(this.$navigation);

        this.$zoomInButton = $('<a class="imageBtn zoomIn" title="' + this.content.zoomIn + '"></a>');
        this.$navigation.append(this.$zoomInButton);

        this.$zoomOutButton = $('<a class="imageBtn zoomOut" title="' + this.content.zoomOut + '"></a>');
        this.$navigation.append(this.$zoomOutButton);

        this.$viewport = $('<div class="virtex"></div>');
        this.$content.prepend(this.$viewport);

        this.title = this.extension.provider.getTitle();

        this.showAttribution();

        this.$zoomInButton.on('click', (e) => {
            e.preventDefault();

            this.viewport.zoomIn();
        });

        this.$zoomOutButton.on('click', (e) => {
            e.preventDefault();

            this.viewport.zoomOut();
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.$viewport.empty();

            const canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

            this.viewport = virtex.create(<Virtex.IOptions>{
                element: "#content .virtex",
                object: canvas.id,
                showStats: this.options.showStats
            });

            this.resize();
        });
    }

    resize() {

        super.resize();

        this.$title.ellipsisFill(this.title);

        this.$viewport.width(this.$content.width());
        this.$viewport.height(this.$content.height());
    }
}

export = VirtexCenterPanel;