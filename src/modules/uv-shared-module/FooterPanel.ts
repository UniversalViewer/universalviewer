import {BaseEvents} from "./BaseEvents";
import {BaseView} from "./BaseView";

export class FooterPanel extends BaseView {

    $feedbackButton: JQuery;
    $bookmarkButton: JQuery;
    $downloadButton: JQuery;
    $moreInfoButton: JQuery;
    $shareButton: JQuery;
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

        $.subscribe(BaseEvents.TOGGLE_FULLSCREEN, () => {
            this.updateFullScreenButton();
        });

        $.subscribe(BaseEvents.METRIC_CHANGED, () => {
            this.updateMinimisedButtons();
            this.updateMoreInfoButton();
        });

        $.subscribe(BaseEvents.SETTINGS_CHANGED, () => {
            this.updateDownloadButton();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$feedbackButton = $(`
          <button class="feedback btn imageBtn" title="${this.content.feedback}" tabindex="0">
            <i class="uv-icon uv-icon-feedback" aria-hidden="true"></i>${this.content.feedback}
          </button>
        `);
        this.$options.prepend(this.$feedbackButton);

        this.$openButton = $(`
          <button class="open btn imageBtn" title="${this.content.open}" tabindex="0">
            <i class="uv-icon-open" aria-hidden="true"></i>${this.content.open}
          </button>
        `);
        this.$options.prepend(this.$openButton);

        this.$bookmarkButton = $(`
          <button class="bookmark btn imageBtn" title="${this.content.bookmark}" tabindex="0">
            <i class="uv-icon uv-icon-bookmark" aria-hidden="true"></i>${this.content.bookmark}
          </button>
        `);
        this.$options.prepend(this.$bookmarkButton);

        this.$shareButton = $(`
          <button class="share btn imageBtn" title="${this.content.share}" tabindex="0">
            <i class="uv-icon uv-icon-share" aria-hidden="true"></i>${this.content.share}
          </button>
        `);
        this.$options.append(this.$shareButton);

        this.$embedButton = $(`
          <button class="embed btn imageBtn" title="${this.content.embed}" tabindex="0">
            <i class="uv-icon uv-icon-embed" aria-hidden="true"></i>${this.content.embed}
          </button>
        `);
        this.$options.append(this.$embedButton);

        this.$downloadButton = $(`
          <button class="download btn imageBtn" title="${this.content.download}" tabindex="0">
            <i class="uv-icon uv-icon-download" aria-hidden="true"></i>${this.content.download}
          </button>
        `);
        this.$options.prepend(this.$downloadButton);

        this.$moreInfoButton = $(`
          <button class="moreInfo btn imageBtn" title="${this.content.moreInfo}" tabindex="0">
            <i class="uv-icon uv-icon-more-info" aria-hidden="true"></i>${this.content.moreInfo}
          </button>
        `);
        this.$options.prepend(this.$moreInfoButton);

        this.$fullScreenBtn = $(`
          <button class="fullScreen btn imageBtn" title="${this.content.fullScreen}" tabindex="0">
            <i class="uv-icon uv-icon-fullscreen" aria-hidden="true"></i>${this.content.fullScreen}
          </button>
        `);
        this.$options.append(this.$fullScreenBtn);

        this.$openButton.onPressed(() => {
            $.publish(BaseEvents.OPEN);
        });

        this.$feedbackButton.onPressed(() => {
            $.publish(BaseEvents.FEEDBACK);
        });

        this.$bookmarkButton.onPressed(() => {
            $.publish(BaseEvents.BOOKMARK);
        });

        this.$shareButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_SHARE_DIALOGUE, [this.$shareButton]);
        });

        this.$embedButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_EMBED_DIALOGUE, [this.$embedButton]);
        });

        this.$downloadButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_DOWNLOAD_DIALOGUE, [this.$downloadButton]);
        });

        this.$moreInfoButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_MOREINFO_DIALOGUE, [this.$moreInfoButton]);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseEvents.TOGGLE_FULLSCREEN);
        });

        if (!Utils.Bools.getBool(this.options.embedEnabled, true)) {
            this.$embedButton.hide();
        }

        this.updateMoreInfoButton();
        this.updateOpenButton();
        this.updateFeedbackButton();
        this.updateBookmarkButton();
        this.updateEmbedButton();
        this.updateDownloadButton();
        this.updateFullScreenButton();
        this.updateShareButton();
        this.updateMinimisedButtons();
    }

    updateMinimisedButtons(): void {
        
        // if configured to always minimise buttons
        if (Utils.Bools.getBool(this.options.minimiseButtons, false)) {
            this.$options.addClass('minimiseButtons');
            return;
        }

        // otherwise, check metric
        if (!this.extension.isDesktopMetric()) {
            this.$options.addClass('minimiseButtons');
        } else {
            this.$options.removeClass('minimiseButtons');
        }
    }

    updateMoreInfoButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.moreInfoEnabled, false);

        if (configEnabled && !this.extension.isDesktopMetric()) {
            this.$moreInfoButton.show();
        } else {
            this.$moreInfoButton.hide();
        }
    }

    updateOpenButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.openEnabled, false);

        if (configEnabled && Utils.Documents.isInIFrame()) {
            this.$openButton.show();
        } else {
            this.$openButton.hide();
        }
    }

    updateFullScreenButton(): void {
        if (!Utils.Bools.getBool(this.options.fullscreenEnabled, true) || !Utils.Documents.supportsFullscreen()) {
            this.$fullScreenBtn.hide();
            return;
        }

        if (this.extension.data.isLightbox) {
            this.$fullScreenBtn.addClass('lightbox');
        }

        if (this.extension.isFullScreen()) {
            this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
            this.$fullScreenBtn.find('i').swapClass('uv-icon-fullscreen', 'uv-icon-exit-fullscreen');
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
            this.$fullScreenBtn.find('i').swapClass('uv-icon-exit-fullscreen', 'uv-icon-fullscreen');
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    updateEmbedButton(): void {
        if (this.extension.helper.isUIEnabled('embed') && Utils.Bools.getBool(this.options.embedEnabled, false)) {
            // current jquery version sets display to 'inline' in mobile version, while this should remain hidden (see media query)
            if (!$.browser.mobile) {
              this.$embedButton.show();
            }
        } else {
            this.$embedButton.hide();
        }
    }

    updateShareButton(): void {
        if (this.extension.helper.isUIEnabled('share') && Utils.Bools.getBool(this.options.shareEnabled, true)) {
            this.$shareButton.show();
        } else {
            this.$shareButton.hide();
        }
    }

    updateDownloadButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.downloadEnabled, true);

        if (configEnabled){
            this.$downloadButton.show();
        } else {
            this.$downloadButton.hide();
        }
    }

    updateFeedbackButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.feedbackEnabled, false);

        if (configEnabled){
            this.$feedbackButton.show();
        } else {
            this.$feedbackButton.hide();
        }
    }

    updateBookmarkButton(): void {
        const configEnabled: boolean = Utils.Bools.getBool(this.options.bookmarkEnabled, false);

        if (configEnabled) {
            this.$bookmarkButton.show();
        } else {
            this.$bookmarkButton.hide();
        }
    }

    resize(): void {
        super.resize();
    }
}
