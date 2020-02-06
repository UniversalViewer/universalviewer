import "three";
import "three/examples/js/controls/VRControls";
import "three/examples/js/Detector";
import "three/examples/js/effects/VREffect";
import "three/examples/js/libs/stats.min";
import "three/examples/js/loaders/GLTFLoader";
import "three/examples/js/loaders/MTLLoader";
import "three/examples/js/loaders/OBJLoader";
import "three/examples/js/loaders/PLYLoader";
import "three/examples/js/vr/WebVR";
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { Bools } from "@edsilv/utils";
import { MediaType } from "@iiif/vocabulary";
import { sanitize } from "../../Utils";
import { Viewport } from "virtex3d";
import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class VirtexCenterPanel extends CenterPanel {

    $navigation: JQuery;
    $viewport: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;
    $vrButton: JQuery;
    viewport: Viewport | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('virtexCenterPanel');

        super.create();

        const that = this;

        this.component.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (resources: IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.$navigation = $('<div class="navigation"></div>');
        this.$content.prepend(this.$navigation);

        this.$zoomInButton = $(`
          <button class="btn imageBtn zoomIn" title="${this.content.zoomIn}">
            <i class="uv-icon-zoom-in" aria-hidden="true"></i>${this.content.zoomIn}
          </button>
        `);
        this.$navigation.append(this.$zoomInButton);

        this.$zoomOutButton = $(`
          <button class="btn imageBtn zoomOut" title="${this.content.zoomOut}">
            <i class="uv-icon-zoom-out" aria-hidden="true"></i>${this.content.zoomOut}
          </button>
        `);
        this.$navigation.append(this.$zoomOutButton);

        this.$vrButton = $(`
          <button class="btn imageBtn vr" title="${this.content.vr}">
            <i class="uv-icon-vr" aria-hidden="true"></i>${this.content.vr}
          </button>
        `);
        this.$navigation.append(this.$vrButton);

        this.$viewport = $('<div class="virtex"></div>');
        this.$content.prepend(this.$viewport);

        this.title = this.extension.helper.getLabel();

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

        if (!this._isVREnabled()) {
            this.$vrButton.hide();
        }

        this.component.publish(BaseEvents.OPENED_MEDIA);
    }

    async openMedia(resources: IExternalResource[]) {

        await this.extension.getExternalResources(resources);

        this.$viewport.empty();

        let mediaUri: string | null = null;
        let canvas: Canvas = this.extension.helper.getCurrentCanvas();
        const formats: AnnotationBody[] | null = this.extension.getMediaFormats(canvas);
        let resourceType: MediaType | null = null;
        // default to threejs format.
        let fileType: any = MediaType.THREEJS;

        if (formats && formats.length) {
            mediaUri = formats[0].id;
            resourceType = formats[0].getFormat();
        } else {
            mediaUri = canvas.id;
        }

        if (resourceType) {
            fileType = resourceType;
        }

        const isAndroid: boolean = navigator.userAgent.toLowerCase().indexOf("android") > -1;

        this.viewport = new Viewport({
            target:  <HTMLElement>this.$viewport[0],
            data: {
                antialias: !isAndroid,
                file: mediaUri as string,
                fullscreenEnabled: false,
                type: fileType,
                showStats: this.options.showStats
            }
        });

        if (this.viewport) {
            this.viewport.on('vravailable', () => {
                this.$vrButton.show();
            }, false);

            this.viewport.on('vrunavailable', () => {
                this.$vrButton.hide();
            }, false);
        }

        this.component.publish(BaseEvents.OPENED_MEDIA);
    }

    private _isVREnabled(): boolean {
        return (Bools.getBool(this.config.options.vrEnabled, false) && WEBVR.isAvailable());
    }

    resize() {
        super.resize();

        if (this.title) {
            this.$title.text(sanitize(this.title));
        }
        
        this.$viewport.width(this.$content.width());
        this.$viewport.height(this.$content.height());
        
        if (this.viewport) {
            this.viewport.resize();
        }
    }
}
