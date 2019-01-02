import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";

export class AMICenterPanel extends CenterPanel {

    $amicomponent: JQuery;

    constructor($element: JQuery) {
        super($element);
        this.attributionPosition = Position.BOTTOM_RIGHT;
    }

    create(): void {

        this.setConfig('amiCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this._createAMIComponent();
    }

    private _createAMIComponent(): void {

        this.$amicomponent = $('<my-el name="ed"></my-el>');
        this.$content.prepend(this.$amicomponent);

    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            this.resize();
        });
    }

    resize() {

        super.resize();

        this.$amicomponent.height(this.$content.height());
        this.$amicomponent.width(this.$content.width());
    
    }
}