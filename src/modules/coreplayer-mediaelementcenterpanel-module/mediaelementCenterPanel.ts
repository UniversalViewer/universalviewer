/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseApp = require("../coreplayer-shared-module/baseApp");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import app = require("../../extensions/coreplayer-mediaelement-extension/app");
import baseCenter = require("../coreplayer-shared-module/centerPanel");
import utils = require("../../utils");

export class MediaElementCenterPanel extends baseCenter.CenterPanel {

    title: string;
    $container: JQuery;
    player: any;
    media: any;
    mediaHeight: number;
    mediaWidth: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('mediaelementCenterPanel');

        super.create();

        var that = this;

        // events.
        $.subscribe(baseApp.BaseApp.TOGGLE_FULLSCREEN, (e) => {
            if (that.app.isFullScreen) {
                that.$container.css('backgroundColor', '#000');
                that.player.enterFullScreen(false);
            } else {
                that.$container.css('backgroundColor', 'transparent');
                that.player.exitFullScreen(false);
            }
        });

        $.subscribe(app.App.OPEN_MEDIA, (e, uri) => {
            that.viewMedia(uri);
        });

        this.$container = $('<div class="container"></div>');
        this.$content.append(this.$container);

        this.title = this.app.provider.getTitle();

    }

    viewMedia(uri) {

        var that = this;

        this.$container.empty();

        this.mediaHeight = 576;
        this.mediaWidth = 720;

        this.$container.height(this.mediaHeight);
        this.$container.width(this.mediaWidth);

        var id = utils.Utils.getTimeStamp();

        var poster = this.provider.assetSequence.extensions.posterImage;

        switch (this.provider.type){
            case 'video':
                this.media = this.$container.append('<video id="' + id + '" type="video/mp4" class="mejs-wellcome" src="' + uri + '" controls="controls" preload="none" poster="' + poster + '"></video>');

                this.player = new MediaElementPlayer("#" + id, {
                    plugins: ['flash'],
                    alwaysShowControls: false,
                    autosizeProgress: false,
                    success: function (media) {
                        media.addEventListener('canplay', (e) => {
                            that.resize();
                        });

                        media.addEventListener('play', (e) => {
                            //$.wellcome.player.trackAction("Video", "Play: " + Math.floor(this.player.media.currentTime));
                            //$.wellcome.player.trackAction("Video", "Play");
                        });
                
                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                //$.wellcome.player.trackAction("Video", "Pause: " + Math.floor(this.player.media.currentTime));
                                //$.wellcome.player.trackAction("Video", "Pause");
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            //$.wellcome.player.trackAction("Video", "Ended: " + Math.floor(this.player.media.duration));
                            //$.wellcome.player.trackAction("Video", "Ended");
                        });

                        try {
                            that.player.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            break;
            case 'audio':

                this.media = this.$container.append('<audio id="' + id + '" type="audio/mp3" class="mejs-wellcome" src="' + uri + '" controls="controls" preload="none" poster="' + poster + '"></audio>');

                this.player = new MediaElementPlayer("#" + id, {
                    plugins: ['flash'],
                    alwaysShowControls: false,
                    autosizeProgress: false,
                    defaultVideoWidth: that.mediaWidth,
                    defaultVideoHeight: that.mediaHeight,
                    success: function (media) {
                        media.addEventListener('canplay', (e) => {
                            that.resize();
                        });

                        media.addEventListener('play', (e) => {
                            //$.wellcome.player.trackAction("Video", "Play: " + Math.floor(this.player.media.currentTime));
                            //$.wellcome.player.trackAction("Video", "Play");
                        });
                
                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                //$.wellcome.player.trackAction("Video", "Pause: " + Math.floor(this.player.media.currentTime));
                                //$.wellcome.player.trackAction("Video", "Pause");
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            //$.wellcome.player.trackAction("Video", "Ended: " + Math.floor(this.player.media.duration));
                            //$.wellcome.player.trackAction("Video", "Ended");
                        });

                        try {
                            that.player.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            break;
        }

        try {
            this.player.load();
        } catch (e) {
            // do nothing
        }

        this.resize();
    }

    getPlayer() {
        return this.player;
    }

    resize() {

        super.resize();

        // if in Firefox < v13 don't resize the media container.
        if (window.BrowserDetect.browser == 'Firefox' && window.BrowserDetect.version < 13) {
            this.$container.width(this.mediaWidth);
            this.$container.height(this.mediaHeight);
        } else {
            // fit media to available space.
            var size: utils.Size = utils.Utils.fitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());

            this.$container.height(size.height);
            this.$container.width(size.width);
        }

        var left = Math.floor((this.$content.width() - this.$container.width()) / 2);
        var top = Math.floor((this.$content.height() - this.$container.height()) / 2);

        this.$container.css({
            'left': left,
            'top': top
        });

        this.$title.ellipsisFill(this.title);
    }
}