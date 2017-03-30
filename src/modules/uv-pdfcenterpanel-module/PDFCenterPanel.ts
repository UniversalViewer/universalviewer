import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class PDFCenterPanel extends CenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            const pdfUri: string = canvas.id;
            window.PDFObject.embed(pdfUri, '#content', {id: "PDF"});
        });
    }

    resize() {
        super.resize();
    }
}