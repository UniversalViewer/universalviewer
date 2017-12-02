import {ThumbsView as BaseView} from "../uv-shared-module/ThumbsView";

export class ThumbsView extends BaseView {
    create(): void {

        this.setConfig('resourcesLeftPanel');
        super.create();
    }
}