import BaseView = require("../uv-shared-module/ThumbsView");

class ThumbsView extends BaseView {
    create(): void {

        this.setConfig('resourcesLeftPanel');

        super.create();
    }
}

export = ThumbsView;