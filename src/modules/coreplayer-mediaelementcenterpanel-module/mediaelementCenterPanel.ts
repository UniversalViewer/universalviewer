/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import IMediaElementProvider = require("../../extensions/coreplayer-mediaelement-extension/iMediaElementProvider");
import extension = require("../../extensions/coreplayer-mediaelement-extension/extension");
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

        // only full screen video
        if (this.provider.type == 'video'){
            $.subscribe(baseExtension.BaseExtension.TOGGLE_FULLSCREEN, (e) => {
                if (that.extension.isFullScreen) {
                    that.$container.css('backgroundColor', '#000');
                    that.player.enterFullScreen(false);
                } else {
                    that.$container.css('backgroundColor', 'transparent');
                    that.player.exitFullScreen(false);
                }
            });
        }

        $.subscribe(extension.Extension.OPEN_MEDIA, (e, asset) => {
            that.viewMedia(asset);
        });

        this.$container = $('<div class="container"></div>');
        this.$content.append(this.$container);

        this.title = this.extension.provider.getTitle();

    }

    viewMedia(asset) {

        var that = this;

        this.$container.empty();

        this.mediaHeight = 576;
        this.mediaWidth = 720;

        this.$container.height(this.mediaHeight);
        this.$container.width(this.mediaWidth);

        var id = utils.Utils.getTimeStamp();

        var poster = (<IMediaElementProvider>this.provider).getPosterImageUri();

        switch (this.provider.type){
            case 'video':

                if (!asset.sources){
                    this.media = this.$container.append('<video id="' + id + '" type="video/mp4" src="' + asset.fileUri + '" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></video>');
                } else {
                    this.media = this.$container.append('<video id="' + id + '" type="video/mp4" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></video>');
                }

                this.player = new MediaElementPlayer("#" + id, {
                    type: ['video/mp4', 'video/webm', 'video/flv'],
                    plugins: ['flash'],
                    alwaysShowControls: false,
                    autosizeProgress: false,
                    success: function (media) {
                        media.addEventListener('canplay', (e) => {
                            that.resize();
                        });

                        media.addEventListener('play', (e) => {
                            $.publish(extension.Extension.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(extension.Extension.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            $.publish(extension.Extension.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        if (asset.sources && asset.sources.length){
                            media.setSrc(asset.sources);
                        }

                        try {
                            media.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            break;
            case 'audio':

                this.media = this.$container.append('<audio id="' + id + '" type="audio/mp3" src="' + asset.fileUri + '" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></audio>');

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
                            $.publish(extension.Extension.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(extension.Extension.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            $.publish(extension.Extension.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        try {
                            media.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            break;
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

        if (this.player && !this.extension.isFullScreen){
            this.player.resize();
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