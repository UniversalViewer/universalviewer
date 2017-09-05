import {BaseEvents} from "../uv-shared-module/BaseEvents";
//import {Events} from "../../extensions/uv-av-extension/Events";
import {CenterPanel} from "../uv-shared-module/CenterPanel";
//import {IAVExtension} from "../../extensions/uv-av-extension/IAVExtension";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: IIIFComponents.AVComponent;
    title: string | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('avCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.$avcomponent = $('<div class="iiif-av-component"></div>');
        this.$content.append(this.$avcomponent);

        this.title = this.extension.helper.getLabel();

        this.avcomponent = new IIIFComponents.AVComponent({
            target: this.$avcomponent[0]
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.avcomponent.set({
                helper: this.extension.helper,
                defaultCanvasHeight: 400,
                defaultCanvasWidth: 600
            });

            this.resize();
        });
    }

    resize() {

        super.resize();

        // const left: number = Math.floor((this.$content.width() - this.$container.width()) / 2);
        // const top: number = Math.floor((this.$content.height() - this.$container.height()) / 2);

        // this.$container.css({
        //     'left': left,
        //     'top': top
        // });

        if (this.title) {
            this.$title.ellipsisFill(this.title);
        }

        this.$avcomponent.height(this.$content.height());

        // if (this.player) {

        //     if (!this.isVideo() || (this.isVideo() && !this.component.isFullScreen)) {
        //         this.player.setPlayerSize();
        //         this.player.setControlsSize();

        //         const $mejs: JQuery = $('.mejs__container');

        //         $mejs.css({
        //             'margin-top': (this.$container.height() - $mejs.height()) / 2
        //         });
        //     }

        // }
        
    }
}