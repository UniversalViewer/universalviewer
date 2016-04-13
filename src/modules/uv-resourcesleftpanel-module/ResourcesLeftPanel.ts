import BaseCommands = require("../uv-shared-module/BaseCommands");
import IProvider = require("../uv-shared-module/IProvider");
import LeftPanel = require("../uv-shared-module/LeftPanel");
import IIxIFProvider = require("../uv-shared-module/IIxIFProvider");

class ResourcesLeftPanel extends LeftPanel {

    $resources: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('resourcesLeftPanel');

        super.create();

        this.$expandButton.attr('tabindex', '7');
        this.$collapseButton.attr('tabindex', '7');
        this.$expandFullButton.attr('tabindex', '8');

        this.setTitle(this.content.title);

        this.$resources = $('<ul></ul>');
        this.$main.append(this.$resources);

        this.dataBind();
    }

    dataBind(): void {
        var annotations: Manifesto.IAnnotation[] = (<IIxIFProvider>this.provider).getResources();

        for (var i = 0; i < annotations.length; i++){
            var annotation: Manifesto.IAnnotation = annotations[i];
            var resource: Manifesto.Resource = annotation.getResource();
            var $listItem: JQuery = $('<li><a href="' + resource.id + '" target="_blank">' + resource.getLabel() + ' (' + Utils.Files.SimplifyMimeType(resource.getFormat().toString()) + ')' + '</li>');
            this.$resources.append($listItem);
        }
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();

        this.$resources.height(this.$main.height());
    }
}

export = ResourcesLeftPanel;