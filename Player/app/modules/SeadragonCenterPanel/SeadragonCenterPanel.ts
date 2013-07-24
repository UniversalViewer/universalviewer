/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import app = module("app/extensions/seadragon/App");
import baseCenter = module("app/shared/Center");
import utils = module("app/Utils");

export class SeadragonCenterPanel extends baseCenter.Center {

    $viewer: JQuery;
    viewer: any;
    title: string;

    // events
    static SEADRAGON_OPEN: string = 'center.open';
    static SEADRAGON_RESIZE: string = 'center.resize';
    static SEADRAGON_ANIMATION_START: string = 'center.animationstart';
    static SEADRAGON_ANIMATION: string = 'center.animation';
    static SEADRAGON_ANIMATION_FINISH: string = 'center.animationfinish';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/SeadragonCenterPanel/css/styles.css');

        // events.
        $.subscribe(app.App.OPEN_DZI, (e, uri) => {
            this.viewer.openDzi(uri);
        });

        this.$viewer = $('<div id="viewer"></div>');
        this.$content.append(this.$viewer);

        // Seadragon

        OpenSeadragon.DEFAULT_SETTINGS.autoHideControls = true;

        this.viewer = OpenSeadragon({
            id: "viewer",
            prefixUrl: "/app/modules/SeadragonCenterPanel/img/",
            showNavigator: true
        });

        this.viewer.clearControls();

        this.viewer.setControlsEnabled(false);

        this.viewer.addHandler('open', function (viewer) {
            $.publish(SeadragonCenterPanel.SEADRAGON_OPEN, [viewer]);
        })

        this.viewer.addHandler('resize', (viewer) => {
            $.publish(SeadragonCenterPanel.SEADRAGON_RESIZE, [viewer]);
            this.viewerResize(viewer);
        });

        this.viewer.addHandler('animationstart', function (viewer) {
            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_START, [viewer]);
        });

        this.viewer.addHandler('animation', function (viewer) {
            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION, [viewer]);
        });

        this.viewer.addHandler('animationfinish', function (viewer) {
            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, [viewer]);
        });

        this.title = this.app.provider.getTitle();
    }

    /*
    getViewerBounds(viewer): any {

        if (!viewer) viewer = Center.viewer;

        var bounds = viewer.viewport.getBounds(true);

        var x = utils.Utils.roundNumber(bounds.x, 4);
        var y = utils.Utils.roundNumber(bounds.y, 4);
        var width = utils.Utils.roundNumber(bounds.width, 4);
        var height = utils.Utils.roundNumber(bounds.height, 4);

        return { x: x, y: y, width: width, height: height };
    }
    */

    viewerResize(viewer: any): void {

        if (!viewer.viewport) return;

        var center = viewer.viewport.getCenter(true);
        if (!center) return;

        // postpone pan for a millisecond - fixes iPad image stretching/squashing issue.
        setTimeout(function () {
            viewer.viewport.panTo(center, true);
        }, 1);
    }

    resize(): void {
        super.resize();

        this.$title.ellipsisFill(this.title);

        this.$viewer.height(this.$content.height());
        this.$viewer.width(this.$content.width());
    }
}