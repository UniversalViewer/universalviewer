/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseCenter = require("../coreplayer-shared-module/seadragonCenterPanel");
import ISeadragonProvider = require("../../extensions/coreplayer-seadragon-extension/iSeadragonProvider");
import utils = require("../../utils");

export class SeadragonCenterPanel extends baseCenter.SeadragonCenterPanel {

    private lastTilesNum: number;
    private tileSources: any[];
    private userData: any;
    private handler: any;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('seadragonCenterPanel');

        super.create();

        // events.

        $.subscribe(baseExtension.BaseExtension.OPEN_MEDIA, (e, uri) => {
            this.loadTileSources();
        });

        this.$element.on('mousemove', (e) => {
            this.viewer.showControls();
        });

        this.$element.on('mouseout', (e) => {
            this.viewer.hideControls();
        });

        // when mouse move stopped
        this.$element.on('mousemove', (e) => {
            // if over element, hide controls.
            if (this.$element.ismouseover()){
                this.viewer.hideControls();
            }
        }, this.config.options.controlsFadeAfterInactive);

        this.$element.on('click', () => {
            this.$viewer.find('.keyboard-command-area').focus();
        });
    }

    createSeadragonViewer(): void {
        // todo: use compiler flag (when available)
        var prefixUrl = (window.DEBUG)? 'modules/coreplayer-seadragoncenterpanel-module/img/' : 'themes/' + this.provider.config.options.theme + '/img/coreplayer-seadragoncenterpanel-module/';

        this.viewer = OpenSeadragon({
            id: "viewer",
            autoHideControls: true,
            showNavigationControl: true,
            showNavigator: true,
            showRotationControl: true,
            showHomeControl: true,
            showFullPageControl: false,
            defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
            controlsFadeDelay: this.config.options.controlsFadeDelay,
            controlsFadeLength: this.config.options.controlsFadeLength,
            navigatorPosition: this.config.options.navigatorPosition,
            prefixUrl: prefixUrl,
            navImages: {
                zoomIn: {
                    REST:   'zoom_in.png',
                    GROUP:  'zoom_in.png',
                    HOVER:  'zoom_in.png',
                    DOWN:   'zoom_in.png'
                },
                zoomOut: {
                    REST:   'zoom_out.png',
                    GROUP:  'zoom_out.png',
                    HOVER:  'zoom_out.png',
                    DOWN:   'zoom_out.png'
                },
                home: {
                    REST:   'home.png',
                    GROUP:  'home.png',
                    HOVER:  'home.png',
                    DOWN:   'home.png'
                },
                rotateright: {
                    REST:   'rotate_right.png',
                    GROUP:  'rotate_right.png',
                    HOVER:  'rotate_right.png',
                    DOWN:   'rotate_right.png'
                },
                rotateleft: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                },
                next: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                },
                previous: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                }
            }
        });

        //this.viewer.addHandler("open-failed", () => {
        //    this.viewer.open();
        //});
    }

    // called every time the seadragon viewer opens a new image.
    viewerOpen() {

        super.viewerOpen();

        var settings: ISettings = this.provider.getSettings();

        // zoom to bounds unless setting disabled
        if (this.currentBounds && settings.preserveViewport){
            this.fitToBounds(this.currentBounds);
        } else {
            this.goHome();
        }
    }

    openTileSourcesHandler() {
        var that = this.userData;

        that.viewer.removeHandler('open', that.handler);

        var viewingDirection = that.provider.getViewingDirection();

        // if there's more than one tilesource, align them next to each other.
        if (that.tileSources.length > 1) {

            // check if tilesources should be aligned horizontally or vertically
            if (viewingDirection == "top-to-bottom" || viewingDirection == "bottom-to-top") {
                // vertical
                that.tileSources[1].y = that.viewer.world.getItemAt(0).getBounds().y + that.viewer.world.getItemAt(0).getBounds().height + that.config.options.pageGap;
            } else {
                // horizontal
                that.tileSources[1].x = that.viewer.world.getItemAt(0).getBounds().x + that.viewer.world.getItemAt(0).getBounds().width + that.config.options.pageGap;
            }

            that.viewer.addTiledImage(that.tileSources[1]);
        }

        // if the number of tilesources being displayed differs from the last number, re-center the viewer.
        if (that.tileSources.length != that.lastTilesNum){
            that.goHome();
        }

        that.lastTilesNum = that.tileSources.length;

        that.$viewer.find('div[title="Zoom in"]').attr('tabindex', 11);
        that.$viewer.find('div[title="Zoom out"]').attr('tabindex', 12);
        that.$viewer.find('div[title="Rotate right"]').attr('tabindex', 13);
    }

    goHome(): void {
        var viewingDirection = this.provider.getViewingDirection();

        switch (viewingDirection){
            case "top-to-bottom" :
                this.viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, 1, this.viewer.world.getItemAt(0).normHeight * this.tileSources.length));
                break;
            case "left-to-right" :
            case "right-to-left" :
                this.viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, this.tileSources.length, this.viewer.world.getItemAt(0).normHeight));
                break;
        }
    }

    loadTileSources(): void {
        this.tileSources = this.provider.getTileSources();

        // todo: use compiler flag (when available)
        var imageUnavailableUri = (window.DEBUG)? '/src/extensions/coreplayer-seadragon-extension/js/imageunavailable.js' : 'js/imageunavailable.js';

        _.each(this.tileSources, function(ts) {
            if (!ts.tileSource){
                ts.tileSource = imageUnavailableUri
            }
        });

        this.viewer.open(this.tileSources[0]);

        this.viewer.addHandler('open', this.openTileSourcesHandler, this);
    }


}