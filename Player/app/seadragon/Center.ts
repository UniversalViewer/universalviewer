/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import app = module("app/seadragon/App");
import baseCenter = module("app/shared/Center");
import utils = module("app/Utils");

export class Center extends baseCenter.Center {

    $viewer: JQuery;
    viewer: any;
    title: string;

    // events
    static SEADRAGON_OPEN: string = 'seadragon.center.open';
    static SEADRAGON_RESIZE: string = 'seadragon.center.resize';
    static SEADRAGON_ANIMATION_START: string = 'seadragon.center.animationstart';
    static SEADRAGON_ANIMATION: string = 'seadragon.center.animation';
    static SEADRAGON_ANIMATION_FINISH: string = 'seadragon.center.animationfinish';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();
        
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
            prefixUrl: "/app/seadragon/img/viewer/",
            showNavigator: true
        });

        this.viewer.setControlsEnabled(false);

        this.viewer.addHandler('open', function (viewer) {
            $.publish(Center.SEADRAGON_OPEN, [viewer]);
        })

        this.viewer.addHandler('resize', (viewer) => {
            $.publish(Center.SEADRAGON_RESIZE, [viewer]);
            this.viewerResize(viewer);
        });

        this.viewer.addHandler('animationstart', function (viewer) {
            $.publish(Center.SEADRAGON_ANIMATION_START, [viewer]);
        });

        this.viewer.addHandler('animation', function (viewer) {
            $.publish(Center.SEADRAGON_ANIMATION, [viewer]);
        });

        this.viewer.addHandler('animationfinish', function (viewer) {
            $.publish(Center.SEADRAGON_ANIMATION_FINISH, [viewer]);
        });

        this.title = baseApp.BaseApp.provider.getTitle();
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
            viewer.viewport.panTo(center, false);
        }, 1);
    }

    resize(): void {
        super.resize();

        this.$title.ellipsisFill(this.title);

        this.$viewer.height(this.$content.height());
        this.$viewer.width(this.$content.width());
    }
}