/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseCenter = require("../coreplayer-shared-module/centerPanel");
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
        $.subscribe(extension.Extension.OPEN_DZI, (e, uri) => {
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

            var that = this;

            this.$prevButton.click((e) => {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);

                if (!that.prevButtonEnabled) return;

                $.publish(SeadragonCenterPanel.PREV);
            });

            this.$nextButton.click((e) => {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
 
                if (!that.nextButtonEnabled) return;

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

        this.title = this.extension.provider.getTitle();
    }

    isMultiAsset(): boolean{
        return this.provider.assetSequence.assets.length > 1;
    }

    // called every time the seadragon viewer opens a new image.
    viewerOpen() {

        if (this.isMultiAsset()) {
            
            $('.navigator').addClass('extraMargin');

            if (this.extension.currentAssetIndex != 0) {
                this.enablePrevButton();
            } else {
                this.disablePrevButton();
            }

            if (this.extension.currentAssetIndex != this.provider.assetSequence.assets.length - 1) {
                this.enableNextButton();
            } else {
                this.disableNextButton();
            }
        }
        
        // if there are no currentBounds check for initial zoom params.
        if (!this.currentBounds){
            var initialBounds = this.extension.getParam(baseProvider.params.zoom);

            if (initialBounds){
                initialBounds = this.deserialiseBounds(initialBounds);
                this.currentBounds = initialBounds;
            }   
        }

        if (this.currentBounds){
            this.fitToBounds(this.currentBounds);
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

        if (this.isMultiAsset()) {
            this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
            this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
        }
    }
}