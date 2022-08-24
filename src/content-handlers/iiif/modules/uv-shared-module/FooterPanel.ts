const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "./BaseView";
import { Bools, Documents } from "@edsilv/utils";
import { Events } from "../../../../Events";

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
    this.setConfig("footerPanel");

    super.create();

    this.extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, () => {
      this.updateFullScreenButton();

      // hack for firefox when exiting full screen
      if (!this.extensionHost.isFullScreen) {
        setTimeout(() => {
          this.resize();
        }, 1001); // wait one ms longer than the resize timeout in uv-helpers.js
      }
    });

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      this.updateMinimisedButtons();
      this.updateMoreInfoButton();
    });

    this.extensionHost.subscribe(IIIFEvents.SETTINGS_CHANGE, () => {
      this.updateDownloadButton();
    });

    this.$options = $('<div class="options"></div>');
    this.$element.append(this.$options);

    this.$feedbackButton = $(`
          <button class="feedback btn imageBtn" title="${this.content.feedback}">
            <i class="uv-icon uv-icon-feedback" aria-hidden="true"></i>
            <span class="sr-only">${this.content.feedback}</span>
          </button>
        `);
    this.$options.prepend(this.$feedbackButton);

    this.$openButton = $(`
          <button class="open btn imageBtn" title="${this.content.open}">
            <i class="uv-icon-open" aria-hidden="true"></i>
            <span class="sr-only">${this.content.open}</span>
          </button>
        `);
    this.$options.prepend(this.$openButton);

    this.$bookmarkButton = $(`
          <button class="bookmark btn imageBtn" title="${this.content.bookmark}">
            <i class="uv-icon uv-icon-bookmark" aria-hidden="true"></i>
            <span class="sr-only">${this.content.bookmark}</span>
          </button>
        `);
    this.$options.prepend(this.$bookmarkButton);

    this.$shareButton = $(`
          <button class="share btn imageBtn" title="${this.content.share}">
            <i class="uv-icon uv-icon-share" aria-hidden="true"></i>
            <span class="sr-only">${this.content.share}</span>
          </button>
        `);
    this.$options.append(this.$shareButton);

    this.$embedButton = $(`
          <button class="embed btn imageBtn" title="${this.content.embed}">
            <i class="uv-icon uv-icon-embed" aria-hidden="true"></i>
            <span class="sr-only">${this.content.embed}</span>
          </button>
        `);
    this.$options.append(this.$embedButton);

    this.$downloadButton = $(`
          <button class="download btn imageBtn" title="${this.content.download}" id="download-btn">
            <i class="uv-icon uv-icon-download" aria-hidden="true"></i>
            <span class="sr-only">${this.content.download}</span>
          </button>
        `);
    this.$options.prepend(this.$downloadButton);

    this.$moreInfoButton = $(`
          <button class="moreInfo btn imageBtn" title="${this.content.moreInfo}">
            <i class="uv-icon uv-icon-more-info" aria-hidden="true"></i>
            <span class="sr-only">${this.content.moreInfo}</span>
          </button>
        `);
    this.$options.prepend(this.$moreInfoButton);

    this.$fullScreenBtn = $(`
          <button class="fullScreen btn imageBtn" title="${this.content.fullScreen}">
            <i class="uv-icon uv-icon-fullscreen" aria-hidden="true"></i>
            <span class="sr-only">${this.content.fullScreen}</span>
          </button>
        `);
    this.$options.append(this.$fullScreenBtn);

    this.$openButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.OPEN);
    });

    this.$feedbackButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.FEEDBACK);
    });

    this.$bookmarkButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.BOOKMARK);
    });

    this.$shareButton.onPressed(() => {
      this.extensionHost.publish(
        IIIFEvents.SHOW_SHARE_DIALOGUE,
        this.$shareButton
      );
    });

    this.$embedButton.onPressed(() => {
      this.extensionHost.publish(
        IIIFEvents.SHOW_EMBED_DIALOGUE,
        this.$embedButton
      );
    });

    this.$downloadButton.onPressed(() => {
      this.extensionHost.publish(
        IIIFEvents.SHOW_DOWNLOAD_DIALOGUE,
        this.$downloadButton
      );
    });

    this.$moreInfoButton.onPressed(() => {
      this.extensionHost.publish(
        IIIFEvents.SHOW_MOREINFO_DIALOGUE,
        this.$moreInfoButton
      );
    });

    this.onAccessibleClick(
      this.$fullScreenBtn,
      (e) => {
        e.preventDefault();
        this.extensionHost.publish(Events.TOGGLE_FULLSCREEN);
      },
      true
    );

    if (!Bools.getBool(this.options.embedEnabled, true)) {
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
    if (Bools.getBool(this.options.minimiseButtons, false)) {
      this.$options.addClass("minimiseButtons");
      return;
    }

    // otherwise, check metric
    if (!this.extension.isDesktopMetric()) {
      this.$options.addClass("minimiseButtons");
    } else {
      this.$options.removeClass("minimiseButtons");
    }
  }

  updateMoreInfoButton(): void {
    // const configEnabled: boolean = Bools.getBool(
    //   this.options.moreInfoEnabled,
    //   false
    // );
    // if (configEnabled && !this.extension.isDesktopMetric()) {
    //   this.$moreInfoButton.show();
    // } else {
    //   this.$moreInfoButton.hide();
    // }
  }

  updateOpenButton(): void {
    const configEnabled: boolean = Bools.getBool(
      this.options.openEnabled,
      false
    );

    if (configEnabled && Documents.isInIFrame()) {
      this.$openButton.show();
    } else {
      this.$openButton.hide();
    }
  }

  updateFullScreenButton(): void {
    if (
      !Bools.getBool(this.options.fullscreenEnabled, true) ||
      !Documents.supportsFullscreen()
    ) {
      this.$fullScreenBtn.hide();
      return;
    }

    if (this.extension.isFullScreen()) {
      this.$fullScreenBtn.switchClass("fullScreen", "exitFullscreen");
      this.$fullScreenBtn
        .find("i")
        .switchClass("uv-icon-fullscreen", "uv-icon-exit-fullscreen");
      this.$fullScreenBtn.attr("title", this.content.exitFullScreen);
      $(
        (<any>this.$fullScreenBtn[0].firstChild).nextSibling.nextSibling
      ).replaceWith(this.content.exitFullScreen);
    } else {
      this.$fullScreenBtn.switchClass("exitFullscreen", "fullScreen");
      this.$fullScreenBtn
        .find("i")
        .switchClass("uv-icon-exit-fullscreen", "uv-icon-fullscreen");
      this.$fullScreenBtn.attr("title", this.content.fullScreen);
      $(
        (<any>this.$fullScreenBtn[0].firstChild).nextSibling.nextSibling
      ).replaceWith(this.content.fullScreen);
    }
  }

  updateEmbedButton(): void {
    if (
      this.extension.helper.isUIEnabled("embed") &&
      Bools.getBool(this.options.embedEnabled, false)
    ) {
      // current jquery version sets display to 'inline' in mobile version, while this should remain hidden (see media query)
      if (!this.extension.isMobile()) {
        this.$embedButton.show();
      }
    } else {
      this.$embedButton.hide();
    }
  }

  updateShareButton(): void {
    if (
      this.extension.helper.isUIEnabled("share") &&
      Bools.getBool(this.options.shareEnabled, true)
    ) {
      this.$shareButton.show();
    } else {
      this.$shareButton.hide();
    }
  }

  updateDownloadButton(): void {
    const configEnabled: boolean = Bools.getBool(
      this.options.downloadEnabled,
      true
    );

    if (configEnabled) {
      this.$downloadButton.show();
    } else {
      this.$downloadButton.hide();
    }
  }

  updateFeedbackButton(): void {
    const configEnabled: boolean = Bools.getBool(
      this.options.feedbackEnabled,
      false
    );

    if (configEnabled) {
      this.$feedbackButton.show();
    } else {
      this.$feedbackButton.hide();
    }
  }

  updateBookmarkButton(): void {
    const configEnabled: boolean = Bools.getBool(
      this.options.bookmarkEnabled,
      false
    );

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
