import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import Params = require("../../Params");
import SearchResult = require("../../extensions/uv-seadragon-extension/SearchResult");
import SearchResultRect = require("../../extensions/uv-seadragon-extension/SearchResultRect");

class SeadragonCenterPanel extends CenterPanel {

    controlsVisible: boolean = false;
    currentBounds: any;
    handler: any;
    initialBounds: any;
    initialRotation: any;
    isCreated: boolean = false;
    isFirstLoad: boolean = true;
    nextButtonEnabled: boolean = false;
    pages: Manifesto.IExternalResource[];
    prevButtonEnabled: boolean = false;
    title: string;
    userData: any;
    viewer: any;

    $closeRightsBtn: JQuery;
    $goHomeButton: JQuery;
    $nextButton: JQuery;
    $prevButton: JQuery;
    $rights: JQuery;
    $rotateButton: JQuery;
    $spinner: JQuery;
    $viewer: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('seadragonCenterPanel');

        super.create();

        this.$viewer = $('<div id="viewer"></div>');
        this.$content.append(this.$viewer);

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, () => {
            // todo: OPEN_MEDIA should be able to waitFor RESIZE
            // https://facebook.github.io/flux/docs/dispatcher.html
            if (!this.isCreated) {
                setTimeout(() => {
                    this.createUI();
                    this.openMedia();
                }, 500); // hack to allow time for panel open animations to complete.
            } else {
                this.openMedia();
            }
        });
    }

    createUI(): void {
        //console.log("create ui");
        this.$spinner = $('<div class="spinner"></div>');
        this.$content.append(this.$spinner);

        this.$rights = $('<div class="rights">\
                               <div class="header">\
                                   <div class="title"></div>\
                                   <div class="close"></div>\
                               </div>\
                               <div class="main">\
                                   <div class="attribution"></div>\
                                   <div class="license"></div>\
                                   <div class="logo"></div>\
                               </div>\
                          </div>');

        this.$rights.find('.header .title').text(this.content.acknowledgements);
        this.$content.append(this.$rights);

        this.$closeRightsBtn = this.$rights.find('.header .close');
        this.$closeRightsBtn.on('click', (e) => {
            e.preventDefault();
            this.$rights.hide();
        });

        // todo: use compiler flag (when available)
        var prefixUrl = (window.DEBUG)? 'modules/uv-seadragoncenterpanel-module/img/' : 'themes/' + this.provider.config.options.theme + '/img/uv-seadragoncenterpanel-module/';

        // add to window object for testing automation purposes.
        window.openSeadragonViewer = this.viewer = OpenSeadragon({
            id: "viewer",
            ajaxWithCredentials: false,
            showNavigationControl: true,
            showNavigator: this.config.options.showNavigator == null ? true : this.config.options.showNavigator,
            showRotationControl: true,
            showHomeControl: true,
            showFullPageControl: false,
            defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
            controlsFadeDelay: this.config.options.controlsFadeDelay || 250,
            controlsFadeLength: this.config.options.controlsFadeLength || 250,
            navigatorPosition: this.config.options.navigatorPosition || "BOTTOM_RIGHT",
            animationTime: this.config.options.animationTime || 1.2,
            visibilityRatio: this.config.options.visibilityRatio || 0.5,
            constrainDuringPan: this.config.options.constrainDuringPan || false,
            immediateRender: this.config.options.immediateRender || false,
            maxZoomLevel: this.config.options.maxZoomLevel || null,
            blendTime: this.config.options.blendTime || 0,
            autoHideControls: this.config.options.autoHideControls == null ? true : this.config.options.autoHideControls,
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

        this.$zoomInButton = this.$viewer.find('div[title="Zoom in"]');
        this.$zoomInButton.attr('tabindex', 11);
        this.$zoomInButton.prop('title', this.content.zoomIn);
        this.$zoomInButton.addClass('zoomIn');

        this.$zoomOutButton = this.$viewer.find('div[title="Zoom out"]');
        this.$zoomOutButton.attr('tabindex', 12);
        this.$zoomOutButton.prop('title', this.content.zoomOut);
        this.$zoomOutButton.addClass('zoomOut');

        this.$goHomeButton = this.$viewer.find('div[title="Go home"]');
        this.$goHomeButton.attr('tabindex', 13);
        this.$goHomeButton.prop('title', this.content.goHome);
        this.$goHomeButton.addClass('goHome');

        this.$rotateButton = this.$viewer.find('div[title="Rotate right"]');
        this.$rotateButton.attr('tabindex', 14);
        this.$rotateButton.prop('title', this.content.rotateRight);
        this.$rotateButton.addClass('rotate');

        // events

        this.$element.on('mousemove', (e) => {
            if (this.controlsVisible) return;
            this.controlsVisible = true;
            this.viewer.setControlsEnabled(true);
        });

        this.$element.on('mouseleave', (e) => {
            if (!this.controlsVisible) return;
            this.controlsVisible = false;
            this.viewer.setControlsEnabled(false);
        });

        // when mouse move stopped
        this.$element.on('mousemove', (e) => {
            // if over element, hide controls.
            if (!this.$viewer.find('.navigator').ismouseover()){
                if (!this.controlsVisible) return;
                this.controlsVisible = false;
                this.viewer.setControlsEnabled(false);
            }
        }, this.config.options.controlsFadeAfterInactive);

        this.viewer.addHandler('open', (viewer) => {
            $.publish(Commands.SEADRAGON_OPEN, [viewer]);
            this.openPagesHandler();
        });

        this.viewer.addHandler('tile-drawn', () => {
            this.$spinner.hide();
        });

        //this.viewer.addHandler("open-failed", () => {
        //});

        this.viewer.addHandler('resize', (viewer) => {
            $.publish(Commands.SEADRAGON_RESIZE, [viewer]);
            this.viewerResize(viewer);
        });

        this.viewer.addHandler('animation-start', (viewer) => {
            $.publish(Commands.SEADRAGON_ANIMATION_START, [viewer]);
        });

        this.viewer.addHandler('animation', (viewer) => {
            $.publish(Commands.SEADRAGON_ANIMATION, [viewer]);
        });

        this.viewer.addHandler('animation-finish', (viewer) => {
            this.currentBounds = this.getBounds();

            $.publish(Commands.SEADRAGON_ANIMATION_FINISH, [viewer]);
        });

        this.$rotateButton.on('click', () => {
            $.publish(Commands.SEADRAGON_ROTATION, [this.viewer.viewport.getRotation()]);
        });

        this.title = this.extension.provider.getTitle();

        this.createNavigationButtons();

        // if firefox, hide rotation and prev/next until this is resolved
        //var browser = window.browserDetect.browser;

        //if (browser == 'Firefox') {
        //    if (this.provider.isMultiCanvas()){
        //        this.$prevButton.hide();
        //        this.$nextButton.hide();
        //    }
        //    this.$rotateButton.hide();
        //}

        this.showAttribution();

        this.isCreated = true;

        this.resize();
    }

    createNavigationButtons() {
        if (!this.provider.isMultiCanvas()) return;

        this.$prevButton = $('<div class="paging btn prev"></div>');
        this.$prevButton.prop('title', this.content.previous);
        this.viewer.addControl(this.$prevButton[0], {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT});

        this.$nextButton = $('<div class="paging btn next"></div>');
        this.$nextButton.prop('title', this.content.next);
        this.viewer.addControl(this.$nextButton[0], {anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT});

        var that = this;

        this.$prevButton.on('touchstart click', (e) => {
            e.preventDefault();
            OpenSeadragon.cancelEvent(e);

            if (!that.prevButtonEnabled) return;

            $.publish(Commands.PREV);
        });

        this.$nextButton.on('touchstart click', (e) => {
            e.preventDefault();
            OpenSeadragon.cancelEvent(e);

            if (!that.nextButtonEnabled) return;

            $.publish(Commands.NEXT);
        });
    }

    openMedia(): void {

        this.$spinner.show();

        this.extension.getExternalResources().then((resources: Manifesto.IExternalResource[]) => {
            // OSD can open an array info.json objects
            this.viewer.open(resources);
        });
    }

    positionPages() {

        var viewingDirection = this.provider.getViewingDirection().toString();

        // if there's more than one image, align them next to each other.
        if ((<ISeadragonProvider>this.provider).resources.length > 1) {

            // check if tilesources should be aligned horizontally or vertically
            if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()) {
                // vertical
                var topPage = this.viewer.world.getItemAt(0);
                var topPageBounds = topPage.getBounds(true);
                var y = topPageBounds.y + topPageBounds.height;
                var bottomPage = this.viewer.world.getItemAt(1);
                var bottomPagePos = bottomPage.getBounds(true).getTopLeft();
                bottomPagePos.y = y + this.config.options.pageGap;
                bottomPage.setPosition(bottomPagePos, true);
            } else {
                // horizontal
                var leftPage = this.viewer.world.getItemAt(0);
                var leftPageBounds = leftPage.getBounds(true);
                var x = leftPageBounds.x + leftPageBounds.width;
                var rightPage = this.viewer.world.getItemAt(1);
                var rightPagePos = rightPage.getBounds(true).getTopLeft();
                rightPagePos.x = x + this.config.options.pageGap;
                rightPage.setPosition(rightPagePos, true);
            }
        }
    }

    openPagesHandler() {

        this.positionPages();

        // check for initial zoom/rotation params.
        if (this.isFirstLoad){

            this.initialRotation = this.extension.getParam(Params.rotation);

            if (this.initialRotation){
                this.viewer.viewport.setRotation(parseInt(this.initialRotation));
            }

            this.initialBounds = this.extension.getParam(Params.zoom);

            if (this.initialBounds){
                this.initialBounds = this.deserialiseBounds(this.initialBounds);
                this.currentBounds = this.initialBounds;
                this.fitToBounds(this.currentBounds);
            }
        } else {
            // it's not the first load
            var settings: ISettings = this.provider.getSettings();

            // zoom to bounds unless setting disabled
            if (settings.preserveViewport && this.currentBounds){
                this.fitToBounds(this.currentBounds);
            } else {
                this.goHome();
            }
        }

        if (this.provider.isMultiCanvas()) {

            $('.navigator').addClass('extraMargin');

            if (!this.provider.isFirstCanvas()) {
                this.enablePrevButton();
            } else {
                this.disablePrevButton();
            }

            if (!this.provider.isLastCanvas()) {
                this.enableNextButton();
            } else {
                this.disableNextButton();
            }
        }

        this.isFirstLoad = false;
        this.overlaySearchResults();
    }

    showAttribution(): void {
        var attribution = this.provider.getAttribution();
        //var license = this.provider.getLicense();
        //var logo = this.provider.getLogo();

        if (!attribution){
            this.$rights.hide();
            return;
        }

        var $attribution = this.$rights.find('.attribution');
        var $license = this.$rights.find('.license');
        var $logo = this.$rights.find('.logo');

        if (attribution){
            $attribution.html(this.provider.sanitize(attribution));
            $attribution.find('img').one("load", () => {
                this.resize();
            }).each(function() {
                if(this.complete) $(this).load();
            });
            $attribution.targetBlank();
            $attribution.toggleExpandText(this.options.trimAttributionCount, () => {
                this.resize();
            });
        } else {
            $attribution.hide();
        }

        //if (license){
        //    $license.append('<a href="' + license + '">' + license + '</a>');
        //} else {
        $license.hide();
        //}
        //
        //if (logo){
        //    $logo.append('<img src="' + logo + '"/>');
        //} else {
        $logo.hide();
        //}
    }

    goHome(): void {
        var viewingDirection = this.provider.getViewingDirection().toString();

        switch (viewingDirection.toString()){
            case manifesto.ViewingDirection.topToBottom().toString() :
                this.viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, 1, this.viewer.world.getItemAt(0).normHeight * (<ISeadragonProvider>this.provider).resources.length), true);
                break;
            case manifesto.ViewingDirection.leftToRight().toString():
            case manifesto.ViewingDirection.rightToLeft().toString() :
                this.viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, (<ISeadragonProvider>this.provider).resources.length, this.viewer.world.getItemAt(0).normHeight), true);
                break;
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

        if (!this.viewer || !this.viewer.viewport) return null;

        var bounds = this.viewer.viewport.getBounds(true);

        return {
            x: Math.roundToDecimalPlace(bounds.x, 4),
            y: Math.roundToDecimalPlace(bounds.y, 4),
            width: Math.roundToDecimalPlace(bounds.width, 4),
            height: Math.roundToDecimalPlace(bounds.height, 4)
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

    overlaySearchResults(): void {

        var searchResults = (<ISeadragonProvider>this.provider).searchResults;

        if (!searchResults.length) return;

        var indices = this.provider.getPagedIndices();

        for (var i = 0; i < indices.length; i++){
            var canvasIndex = indices[i];

            var searchResult: SearchResult = null;

            for (var j = 0; j < searchResults.length; j++) {
                if (searchResults[j].canvasIndex === canvasIndex) {
                    searchResult = searchResults[j];
                    break;
                }
            }

            if (!searchResult) continue;

            var rects = this.getSearchOverlayRects(searchResult.rects, i);

            for (var k = 0; k < rects.length; k++) {
                var rect = rects[k];

                var div = document.createElement("div");
                div.className = "searchOverlay";

                this.viewer.addOverlay(div, rect);
            }
        }
    }

    getSearchOverlayRects(rects: SearchResultRect[], index: number) {
        var newRects = [];

        var width = this.viewer.world.getItemAt(index).source.dimensions.x;
        var offsetX = 0;

        if (index > 0){
            offsetX = this.viewer.world.getItemAt(index - 1).source.dimensions.x;
        }

        for (var i = 0; i < rects.length; i++) {
            var searchRect: SearchResultRect = rects[i];

            var factor = 1 / width;
            var x = factor * (Number(searchRect.x) + offsetX) + ((index > 0) ? this.config.options.pageGap : 0);
            var y = factor * Number(searchRect.y);
            var w = factor * Number(searchRect.width);
            var h = factor * Number(searchRect.height);

            var rect = new OpenSeadragon.Rect(x, y, w, h);

            newRects.push(rect);
        }

        return newRects;
    }

    resize(): void {

        //console.log("resize");
        
        super.resize();

        this.$viewer.height(this.$content.height() - this.$viewer.verticalMargins());
        this.$viewer.width(this.$content.width() - this.$viewer.horizontalMargins());

        if (!this.isCreated) return;

        if (this.currentBounds) {
            this.fitToBounds(this.currentBounds);
        }

        this.$title.ellipsisFill(this.title);

        this.$spinner.css('top', (this.$content.height() / 2) - (this.$spinner.height() / 2));
        this.$spinner.css('left', (this.$content.width() / 2) - (this.$spinner.width() / 2));

        if (this.provider.isMultiCanvas() && this.$prevButton && this.$nextButton) {
            this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
            this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
        }

        if (this.$rights && this.$rights.is(':visible')){
            this.$rights.css('top', this.$content.height() - this.$rights.outerHeight() - this.$rights.verticalMargins());
        }
    }
}
export = SeadragonCenterPanel;