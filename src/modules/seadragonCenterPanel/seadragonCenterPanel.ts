/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseApp = require("../shared/baseApp");
import app = require("../../extensions/seadragon/app");
import baseCenter = require("../shared/centerPanel");
import utils = require("../../utils");

export class SeadragonCenterPanel extends baseCenter.CenterPanel {

    prevButtonEnabled: boolean = false;
    nextButtonEnabled: boolean = false;

    $viewer: JQuery;
    viewer: any;
    title: string;
    currentBounds: any;
    $prevButtonCont: JQuery;
    $prevButton: JQuery;
    $nextButtonCont: JQuery;
    $nextButton: JQuery;

    // events
    static SEADRAGON_OPEN: string = 'center.open';
    static SEADRAGON_RESIZE: string = 'center.resize';
    static SEADRAGON_ANIMATION_START: string = 'center.animationstart';
    static SEADRAGON_ANIMATION: string = 'center.animation';
    static SEADRAGON_ANIMATION_FINISH: string = 'center.animationfinish';
    static PREV: string = 'center.onPrev';
    static NEXT: string = 'center.onNext';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('seadragonCenterPanel');

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
            showNavigationControl: false,
            showNavigator: true,
            navigatorPosition: 'BOTTOM_RIGHT'
        });

        this.viewer.clearControls();

        this.viewer.setControlsEnabled(false);

        // create prev/next buttons.
        if (this.isMultiAsset()) {

            this.$prevButton = $('<div class="paging btn prev"></div>');
            this.$prevButton.prop('title', this.content.previous);
            this.viewer.addControl(this.$prevButton[0], {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});

            this.$nextButton = $('<div class="paging btn next"></div>');
            this.$nextButton.prop('title', this.content.next);
            this.viewer.addControl(this.$nextButton[0], {anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT});

            this.$prevButton.click((e) => {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);

                if (!this.prevButtonEnabled) return;

                $.publish(SeadragonCenterPanel.PREV);
            });

            this.$nextButton.click((e) => {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
 
                if (!this.nextButtonEnabled) return;

                $.publish(SeadragonCenterPanel.NEXT);
            });
        };

        this.viewer.addHandler('open', (viewer) => {
            this.viewerOpen();
            $.publish(SeadragonCenterPanel.SEADRAGON_OPEN, [viewer]);
        });

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

    isMultiAsset(): boolean{
        return this.provider.assetSequence.assets.length > 1;
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
                return;
            }
        }

        if (this.currentBounds) {
            this.fitToBounds(this.currentBounds);
        } else {
            // player is embedded, initial zoom params may be on the querystring.
            bounds = this.provider.initialZoom;

            if (bounds) {
                bounds = this.deserialiseBounds(bounds);
                this.fitToBounds(bounds);
            }
        }

        if (this.isMultiAsset()) {
            
            $('.navigator').addClass('extraMargin');

            if (this.app.currentAssetIndex != 0) {
                this.enablePrevButton();
            } else {
                this.disablePrevButton();
            }

            if (this.app.currentAssetIndex != this.provider.assetSequence.assets.length - 1) {
                this.enableNextButton();
            } else {
                this.disableNextButton();
            }
        }
    }

    disablePrevButton () {
        this.prevButtonEnabled = false;
        this.$prevButton.addClass('disabled');
    }

    enablePrevButton () {
        this.prevButtonEnabled = true;
        this.$prevButton.removeClass('disabled');
    }

    disableNextButton () {
        this.nextButtonEnabled = false;
        this.$nextButton.addClass('disabled');
    }

    enableNextButton () {
        this.nextButtonEnabled = true;
        this.$nextButton.removeClass('disabled');
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

        if (!this.viewer.viewport) return null;

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

        if (this.isMultiAsset()) {
            //this.$prevButtonCont.height(this.$content.height());
            //this.$nextButtonCont.height(this.$content.height());

            //this.$prevButton.css('top', (this.$prevButtonCont.height() - this.$prevButton.height()) / 2);
            //this.$nextButton.css('top', (this.$nextButtonCont.height() - this.$nextButton.height()) / 2);

            this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
            this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
        }
    }
}