import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class VirtexCenterPanel extends CenterPanel {

    $navigation: JQuery;
    $viewport: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;
    $vrButton: JQuery;
    title: string | null;
    viewport: Virtex.Viewport | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('virtexCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.$navigation = $('<div class="navigation"></div>');
        this.$content.prepend(this.$navigation);

        this.$zoomInButton = $('<button class="imageBtn zoomIn" title="' + this.content.zoomIn + '"><i></i></button>');
        this.$navigation.append(this.$zoomInButton);

        this.$zoomOutButton = $('<button class="imageBtn zoomOut" title="' + this.content.zoomOut + '"><i></i></button>');
        this.$navigation.append(this.$zoomOutButton);

        this.$vrButton = $('<button class="imageBtn vr" title="' + this.content.vr + '"><i></i></button>');
        this.$navigation.append(this.$vrButton);

        this.$viewport = $('<div class="virtex"></div>');
        this.$content.prepend(this.$viewport);

        this.title = this.extension.helper.getLabel();

        this.updateAttribution();

        this.$zoomInButton.on('click', (e: any) => {
            e.preventDefault();
            if (this.viewport) {
                this.viewport.zoomIn();
            }
        });

        this.$zoomOutButton.on('click', (e: any) => {
            e.preventDefault();
            if (this.viewport) {
                this.viewport.zoomOut();
            }
        });

        this.$vrButton.on('click', (e: any) => {
            e.preventDefault();
            if (this.viewport) {
                this.viewport.toggleVR();
            }
        });

        if (!WEBVR.isAvailable()) {
            this.$vrButton.hide();
        }
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.$viewport.empty();

            let mediaUri: string | null = null;
            let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
            const formats: Manifesto.IAnnotationBody[] | null = this.extension.getMediaFormats(canvas);
            let resourceType: Manifesto.MediaType | null = null;
            // default to threejs format.
            let fileType: Virtex.FileType = new Virtex.FileType("application/vnd.threejs+json");

            if (formats && formats.length) {
                mediaUri = formats[0].id;
                resourceType = formats[0].getFormat();
            } else {
                mediaUri = canvas.id;
            }

            if (resourceType) {
                fileType = new Virtex.FileType(resourceType.toString());
            }

            const isAndroid: boolean = navigator.userAgent.toLowerCase().indexOf("android") > -1;

            this.viewport = new Virtex.Viewport({
                target: this.$viewport[0],
                data: {
                    antialias: !isAndroid,
                    file: mediaUri,
                    fullscreenEnabled: false,
                    type: fileType,
                    showStats: this.options.showStats
                }
            });

            this.resize();
        });
    }

    resize() {
        super.resize();

        if (this.title) {
            this.$title.ellipsisFill(this.title);
        }
        
        this.$viewport.width(this.$content.width());
        this.$viewport.height(this.$content.height());
        
        if (this.viewport) {
            this.viewport.resize();
        }
    }
}
