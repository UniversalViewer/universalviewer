import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class FileLinkCenterPanel extends CenterPanel {

    $downloadLink: JQuery;

    title: string | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('fileLinkCenterPanel');

        super.create();

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });

        this.$downloadLink = $('<a target="_blank"></a>');
        this.$content.append(this.$downloadLink);

        this.title = this.extension.helper.getLabel();
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            this.$downloadLink.text(String.format(this.content.downloadLink, canvas.getLabel()));
            //this.$downloadLink.attr('href', canvas.thumbnail);
        });
    }

    resize() {
        super.resize();

        if (this.title) {
            this.$title.ellipsisFill(this.title);
        }
    }
}