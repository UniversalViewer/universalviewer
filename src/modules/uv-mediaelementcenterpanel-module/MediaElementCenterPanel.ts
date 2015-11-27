import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import Commands = require("../../extensions/uv-mediaelement-extension/Commands");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import IMediaElementProvider = require("../../extensions/uv-mediaelement-extension/IMediaElementProvider");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import IMediaElementExtension = require("../../extensions/uv-mediaelement-extension/IMediaElementExtension");

class MediaElementCenterPanel extends CenterPanel {

    $container: JQuery;
    media: any;
    mediaHeight: number;
    mediaWidth: number;
    player: any;
    title: string;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('mediaelementCenterPanel');

        super.create();

        var that = this;

        // events.

        // only full screen video
        if ((<IMediaElementExtension>this.extension).isVideo()){
            $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, (e) => {
                if (that.bootstrapper.isFullScreen) {
                    that.$container.css('backgroundColor', '#000');
                    that.player.enterFullScreen(false);
                } else {
                    that.$container.css('backgroundColor', 'transparent');
                    that.player.exitFullScreen(false);
                }
            });
        }

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, (e, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.$container = $('<div class="container"></div>');
        this.$content.append(this.$container);

        this.title = this.extension.provider.getTitle();

    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        var that = this;

        this.extension.getExternalResources(resources).then(() => {

            this.$container.empty();

            var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();
            this.mediaHeight = this.config.defaultHeight;
            this.mediaWidth = this.config.defaultWidth;

            this.$container.height(this.mediaHeight);
            this.$container.width(this.mediaWidth);

            var id = Utils.Dates.GetTimeStamp();
            var poster = (<IMediaElementProvider>this.provider).getPosterImageUri();
            var posterAttr: string = poster ? ' poster="' + poster + '"' : '';

            var sources = [];

            _.each(canvas.getRenderings(), (rendering: Manifesto.IRendering) => {
                sources.push({
                    type: rendering.getFormat().toString(),
                    src: rendering.id
                });
            });

            if ((<IMediaElementExtension>this.extension).isVideo()){

                this.media = this.$container.append('<video id="' + id + '" type="video/mp4" class="mejs-uv" controls="controls" preload="none"' + posterAttr + '></video>');

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
                            $.publish(Commands.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(Commands.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            $.publish(Commands.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        media.setSrc(sources);

                        try {
                            media.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            } else {

                // Try to find an MP3, since this is most likely to work:
                var preferredSource = 0;
                for (var i in sources) {
                    if (sources[i].type === "audio/mp3") {
                        preferredSource = i;
                        break;
                    }
                }

                this.media = this.$container.append('<audio id="' + id + '" type="' + sources[preferredSource].type + '" src="' + sources[preferredSource].src + '" class="mejs-uv" controls="controls" preload="none"' + posterAttr + '></audio>');

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
                            $.publish(Commands.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', (e) => {
                            // mediaelement creates a pause event before the ended event. ignore this.
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(Commands.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', (e) => {
                            $.publish(Commands.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        //media.setSrc(sources);

                        try {
                            media.load();
                        } catch (e) {
                            // do nothing
                        }
                    }
                });
            }

            this.resize();
        });
    }

    resize() {

        super.resize();

        // if in Firefox < v13 don't resize the media container.
        if (window.browserDetect.browser === 'Firefox' && window.browserDetect.version < 13) {
            this.$container.width(this.mediaWidth);
            this.$container.height(this.mediaHeight);
        } else {
            // fit media to available space.
            var size: Utils.Measurements.Size = Utils.Measurements.Dimensions.FitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());

            this.$container.height(size.height);
            this.$container.width(size.width);
        }

        if (this.player && !this.extension.isFullScreen()){
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

export = MediaElementCenterPanel;