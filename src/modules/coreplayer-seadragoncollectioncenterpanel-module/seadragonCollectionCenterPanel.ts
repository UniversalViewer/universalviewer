/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseCenter = require("../coreplayer-shared-module/seadragonCenterPanel");
import ISeadragonProvider = require("../../extensions/coreplayer-seadragon-extension/iSeadragonProvider");
import utils = require("../../utils");

export class SeadragonCollectionCenterPanel extends baseCenter.SeadragonCenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('seadragonCenterPanel');

        super.create();

        var that = this;

        // events.
        $.subscribe(baseExtension.BaseExtension.OPEN_MEDIA, (e, uri) => {

            // method 1
            that.viewer.tileSources = this.getTileSources();
            that.viewer.forceRedraw();

            // method 2
            //var tileSources = that.getTileSources();
            //that.viewer.open(tileSources[0]);
            //that.viewer.open(tileSources[1]);
        });
    }

    createSeadragonViewer(): void {
        OpenSeadragon.DEFAULT_SETTINGS.autoHideControls = true;

        // todo: use compiler flag (when available)
        var prefixUrl = (window.DEBUG)? 'modules/coreplayer-seadragoncollectioncenterpanel-module/img/' : 'themes/' + this.provider.config.options.theme + '/img/coreplayer-seadragoncollectioncenterpanel-module/';

        this.viewer = OpenSeadragon({
            id: "viewer",
            collectionMode: true,
            collectionRows: 1,
            collectionTileSize: 1024,
            collectionTileMargin: 0,
            showNavigationControl: true,
            showNavigator: true,
            showRotationControl: true,
            showHomeControl: false,
            showFullPageControl: false,
            defaultZoomLevel: this.options.defaultZoomLevel || 0,
            navigatorPosition: 'BOTTOM_RIGHT',
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
                }
            }
        });

        //this.viewer.clearControls();

        //this.viewer.setControlsEnabled(false);
    }

    getTileSources(){
        if (this.provider.isFirstCanvas()){
            // if it's the first page, return an empty tilesource and the first page.
            return ["", this.getCanvasImageUri(0)];
        } else if (this.provider.isLastCanvas()){
            // if it's the last page, return the last page and an empty tilesource.
            return [this.getCanvasImageUri(this.provider.getTotalCanvases() - 1), ""];
        } else {
            // if it's not the first or last page, return the current two-page spread.
            return [this.getCanvasImageUri(this.provider.canvasIndex), this.getCanvasImageUri(this.provider.canvasIndex + 1)];
        }
    }

    getCanvasImageUri(canvasIndex: number): string{
        var canvas = this.provider.getCanvasByIndex(canvasIndex);
        return (<ISeadragonProvider>this.provider).getImageUri(canvas);
    }
}