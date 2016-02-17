import BaseCommands = require("./BaseCommands");
import BaseView = require("./BaseView");

class FooterPanel extends BaseView {

    $feedbackButton: JQuery;
    $bookmarkButton: JQuery;
    $downloadButton: JQuery;
    $embedButton: JQuery;
    $openButton: JQuery;
    $fullScreenBtn: JQuery;
    $options: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig('footerPanel');

        super.create();

        $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, () => {
            this.updateFullScreenButton();
        });

        $.subscribe(BaseCommands.SETTINGS_CHANGED, () => {
            this.updateDownloadButton();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$feedbackButton = $('<a class="feedback" title="' + this.content.feedback + '">' + this.content.feedback + '</a>');
        this.$options.prepend(this.$feedbackButton);

        this.$openButton = $('<a class="open" title="' + this.content.open + '">' + this.content.open + '</a>');
        this.$options.prepend(this.$openButton);

        this.$bookmarkButton = $('<a class="bookmark" title="' + this.content.bookmark + '">' + this.content.bookmark + '</a>');
        this.$options.prepend(this.$bookmarkButton);

        this.$embedButton = $('<a href="#" class="embed" title="' + this.content.embed + '">' + this.content.embed + '</a>');
        this.$options.append(this.$embedButton);
        this.$embedButton.attr('tabindex', '6');

        this.$downloadButton = $('<a class="download" title="' + this.content.download + '">' + this.content.download + '</a>');
        this.$options.prepend(this.$downloadButton);

        this.$fullScreenBtn = $('<a href="#" class="fullScreen" title="' + this.content.fullScreen + '">' + this.content.fullScreen + '</a>');
        this.$options.append(this.$fullScreenBtn);
        this.$fullScreenBtn.attr('tabindex', '5');

        this.$openButton.onPressed(() => {
            $.publish(BaseCommands.OPEN);
        });

        this.$feedbackButton.onPressed(() => {
            $.publish(BaseCommands.FEEDBACK);
        });

        this.$bookmarkButton.onPressed(() => {
            $.publish(BaseCommands.BOOKMARK);
        });

        this.$embedButton.onPressed(() => {
            $.publish(BaseCommands.SHOW_EMBED_DIALOGUE);
        });

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            $.publish(BaseCommands.SHOW_DOWNLOAD_DIALOGUE);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseCommands.TOGGLE_FULLSCREEN);
        });

        if (!Utils.Bools.GetBool(this.options.embedEnabled, true)){
            this.$embedButton.hide();
        }

        this.updateOpenButton();
        this.updateFeedbackButton();
        this.updateBookmarkButton();
        this.updateDownloadButton();
        this.updateFullScreenButton();

        if (Utils.Bools.GetBool(this.options.minimiseButtons, false)){
            this.$options.addClass('minimiseButtons');
        }
    }

    updateOpenButton(): void {
        var configEnabled = Utils.Bools.GetBool(this.options.openEnabled, false);

        if (configEnabled && !this.provider.isHomeDomain){
            this.$openButton.show();
        } else {
            this.$openButton.hide();
        }
    }

    updateFullScreenButton(): void {
        if (!Utils.Bools.GetBool(this.options.fullscreenEnabled, true)){
            this.$fullScreenBtn.hide();
        }

        if (this.provider.isLightbox){
            this.$fullScreenBtn.addClass('lightbox');
        }

        if (this.extension.isFullScreen()) {
            this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
            this.$fullScreenBtn.text(this.content.exitFullScreen);
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
            this.$fullScreenBtn.text(this.content.fullScreen);
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    updateDownloadButton(): void {
        var configEnabled = Utils.Bools.GetBool(this.options.downloadEnabled, true);

        if (configEnabled){
            this.$downloadButton.show();
        } else {
            this.$downloadButton.hide();
        }
    }

    updateFeedbackButton(): void {
        var configEnabled = Utils.Bools.GetBool(this.options.feedbackEnabled, false);

        if (configEnabled){
            this.$feedbackButton.show();
        } else {
            this.$feedbackButton.hide();
        }
    }

    updateBookmarkButton(): void {
        var configEnabled = Utils.Bools.GetBool(this.options.bookmarkEnabled, false);

        if (configEnabled){
            this.$bookmarkButton.show();
        } else {
            this.$bookmarkButton.hide();
        }
    }

    resize(): void {
        super.resize();
    }
}

export = FooterPanel;