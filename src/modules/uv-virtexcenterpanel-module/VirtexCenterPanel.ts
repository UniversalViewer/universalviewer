import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import Commands = require("../../extensions/uv-mediaelement-extension/Commands");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import IMediaElementProvider = require("../../extensions/uv-mediaelement-extension/IMediaElementProvider");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import IMediaElementExtension = require("../../extensions/uv-mediaelement-extension/IMediaElementExtension");

class VirtexCenterPanel extends CenterPanel {

    $container: JQuery;
    title: string;

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

        this.$container = $('<div class="virtex"></div>');
        this.$content.append(this.$container);

        this.title = this.extension.provider.getTitle();

    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.$container.empty();

            const canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

            virtex.create(<Virtex.IOptions>{
                element: "#content .virtex",
                object: canvas.id
            });

            this.resize();
        });
    }

    resize() {

        super.resize();

        this.$title.ellipsisFill(this.title);

        this.$container.width(this.$content.width());
        this.$container.height(this.$content.height());
    }
}

export = VirtexCenterPanel;