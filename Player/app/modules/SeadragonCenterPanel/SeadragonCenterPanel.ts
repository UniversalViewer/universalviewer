/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import app = module("app/extensions/seadragon/App");
import baseCenter = module("app/shared/CenterPanel");
import utils = module("app/Utils");

export class SeadragonCenterPanel extends baseCenter.CenterPanel {

    $viewer: JQuery;
    viewer: any;
    title: string;
    currentBounds: any;

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

        this.viewer.addHandler('open', (viewer) => {
            this.viewerOpen();
            $.publish(SeadragonCenterPanel.SEADRAGON_OPEN, [viewer]);
        })

        this.viewer.addHandler('resize', (viewer) => {
            $.publish(SeadragonCenterPanel.SEADRAGON_RESIZE, [viewer]);
            this.viewerResize(viewer);
        });

        this.viewer.addHandler('animationstart', (viewer) => {
            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_START, [viewer]);
        });

        this.viewer.addHandler('animation', (viewer) => {
            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION, [viewer]);
        });

        this.viewer.addHandler('animationfinish', (viewer) => {
            this.currentBounds = this.getBounds();

            $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, [viewer]);
        });

        this.title = this.app.provider.getTitle();
    }

    viewerOpen() {

        var bounds, hash;

        // check for URL zoom params
        if (this.app.isDeepLinkingEnabled()) {
            hash = this.app.getHashValues();

            if (hash.length > 2) {
                // the third param is the zoom bounds.
                bounds = this.deserialiseBounds(hash[2]);
                this.fitToBounds(bounds);
            } else {
                if (this.currentBounds) {
                    this.fitToBounds(this.currentBounds);
                }
            }
        } else {
            if (this.currentBounds) {
                this.fitToBounds(this.currentBounds);
            } else {
                // player is embedded, initial zoom params may be on the querystring.
                bounds = utils.Utils.getParameterByName('z');

                if (bounds) {
                    bounds = this.deserialiseBounds(bounds);
                    this.fitToBounds(bounds);
                }
            }
        }

        // create touch controller.
        //var touchController = new Seadragon.TouchController(viewer);
    }

    serialiseBounds(bounds): string{
        return bounds.x + ',' + bounds.y + ',' + bounds.width + ',' + bounds.height;
    }

    deserialiseBounds(bounds: string): any {

        var boundsArr = bounds.split(',');

        return {
            x: Number(boundsArr[0]),
            y: Number(boundsArr[1]),
            width: Number(boundsArr[2]),
            height: Number(boundsArr[3])
        };
    }

    fitToBounds(bounds): void {
        var rect = new OpenSeadragon.Rect();
        rect.x = bounds.x;
        rect.y = bounds.y;
        rect.width = bounds.width;
        rect.height = bounds.height;

        this.viewer.viewport.fitBounds(rect, true);
    }

    getBounds(): any {

        var bounds = this.viewer.viewport.getBounds(true);

        return {
            x: utils.Utils.roundNumber(bounds.x, 4),
            y: utils.Utils.roundNumber(bounds.y, 4),
            width: utils.Utils.roundNumber(bounds.width, 4),
            height: utils.Utils.roundNumber(bounds.height, 4)
        };
    }

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
        /*this.$viewer.width(this.$content.width());*/
    }
}