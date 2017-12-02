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
            
            let mediaUri: string | null = null;
            let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
            const formats: Manifesto.IAnnotationBody[] | null = this.extension.getMediaFormats(canvas);

            if (formats && formats.length) {
                mediaUri = formats[0].id;
            } else {
                mediaUri = canvas.id;
            }

            window.PDFObject.embed(mediaUri, '#content', {id: "PDF"});
        });
    }

    resize() {
        super.resize();
    }
}