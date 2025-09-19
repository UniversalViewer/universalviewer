import { IIIFEvents } from "../../IIIFEvents";

const $ = require("jquery");
import { BaseView } from "./BaseView";
import { Position } from "./Position";
import { sanitize, isVisible } from "../../../../Utils";
import { Bools } from "../../Utils";
import { BaseConfig } from "../../BaseConfig";

export class CenterPanel<
  T extends BaseConfig["modules"]["centerPanel"],
> extends BaseView<T> {
  title: string | null;
  subtitle: string | null;
  subtitleExpanded: boolean = false;
  $attribution: JQuery;
  $closeAttributionButton: JQuery;
  $content: JQuery;
  $title: JQuery;
  $subtitle: JQuery;
  $subtitleWrapper: JQuery;
  $subtitleExpand: JQuery;
  $subtitleText: JQuery;
  isAttributionOpen: boolean = false;
  attributionExplicitlyClosed: boolean = false;
  attributionPosition: Position = Position.BOTTOM_LEFT;
  isAttributionLoaded: boolean = false;

  constructor($element: JQuery) {
    super($element, false, true);
  }

  create(): void {
    super.create();

    this.$title = $('<h1 class="title"></h1>');
    this.$element.append(this.$title);

    this.$subtitle = $(`<div class="subtitle">
                                <div class="wrapper">
                                    <button type="button" class="expand-btn" aria-label="Expand">
                                        <span aria-hidden="true">+</span>
                                    </button>
                                    <span class="text"></span>
                                </div>
                            </div>`);
    this.$element.append(this.$subtitle);

    this.$subtitleWrapper = this.$subtitle.find(".wrapper");
    this.$subtitleExpand = this.$subtitle.find(".expand-btn");
    this.$subtitleText = this.$subtitle.find(".text");

    this.$content = $('<div id="content" class="content"></div>');
    this.$element.append(this.$content);

    this.$attribution = $(`
                                <div class="attribution">
                                  <div class="header">
                                    <div class="title"></div>
                                    <button type="button" class="close">
                                      <span aria-hidden="true">&#215;</span>
                                    </button>
                                  </div>
                                  <div class="main">
                                    <div class="attribution-text"></div>
                                    <div class="license"></div>
                                    <div class="logo"></div>
                                  </div>
                                </div>
        `);

    this.$attribution.find(".header .title").text(this.content.attribution);
    this.$content.append(this.$attribution);
    this.closeAttribution();

    this.$closeAttributionButton = this.$attribution.find(".header .close");
    this.$closeAttributionButton.attr(
      "aria-label",
      this.content.closeAttribution
    );
    this.$closeAttributionButton.on("click", (e) => {
      e.preventDefault();
      this.closeAttribution(true);
    });

    this.$subtitleExpand.on("click", (e) => {
      e.preventDefault();

      this.subtitleExpanded = !this.subtitleExpanded;

      if (this.subtitleExpanded) {
        this.$subtitleWrapper.addClass("expanded");
        this.$subtitleExpand.text("-");
      } else {
        this.$subtitleWrapper.removeClass("expanded");
        this.$subtitleExpand.text("+");
      }

      this.resize();
    });

    if (Bools.getBool(this.options.titleEnabled, true)) {
      this.$title.show();
    } else {
      this.$title.hide();
    }

    if (Bools.getBool(this.options.subtitleEnabled, false)) {
      this.$subtitle.show();
    } else {
      this.$subtitle.hide();
    }

    this.whenResized(() => {
      this.updateRequiredStatement();
    });

    this.extensionHost.subscribe(IIIFEvents.RANGE_CHANGE, () => {
      this.updateRequiredStatement();
    });
    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      this.updateRequiredStatement();
    });
    this.extensionHost.subscribe(IIIFEvents.MANIFEST_INDEX_CHANGE, () => {
      this.updateRequiredStatement();
    });
  }

  openAttribution(): void {
    // If the user explicitly closed the box, don't reopen it:
    if (this.attributionExplicitlyClosed) {
      return;
    }
    this.$attribution.show();
    this.isAttributionOpen = true;
  }

  closeAttribution(explicitlyClosed: boolean = false): void {
    // If the user explicitly closes the box once, remember that state; this
    // will get reset in the viewer reload when a different manifest is loaded.
    this.attributionExplicitlyClosed =
      this.attributionExplicitlyClosed || explicitlyClosed;
    this.$attribution.hide();
    this.isAttributionOpen = false;
  }

  updateRequiredStatement(): void {
    if (this.isAttributionLoaded) {
      return;
    }

    const mostSpecific = Bools.getBool(
      this.config.options.mostSpecificRequiredStatement,
      false
    );
    const requiredStatement = mostSpecific
      ? this.extension.helper.getMostSpecificRequiredStatement()
      : this.extension.helper.getRequiredStatement();

    // isAttributionLoaded

    //var license = this.provider.getLicense();
    //var logo = this.provider.getLogo();

    const enabled: boolean = Bools.getBool(
      this.options.requiredStatementEnabled,
      true
    );

    if (!requiredStatement || !requiredStatement.value || !enabled) {
      return;
    }

    this.openAttribution();

    const $attributionTitle: JQuery = this.$attribution.find(".title");
    const $attributionText: JQuery =
      this.$attribution.find(".attribution-text");
    const $license: JQuery = this.$attribution.find(".license");
    const $logo: JQuery = this.$attribution.find(".logo");

    if (requiredStatement.label) {
      const sanitizedTitle: string = sanitize(requiredStatement.label);
      $attributionTitle.html(sanitizedTitle);
    } else {
      $attributionTitle.text(this.content.attribution);
    }

    if (requiredStatement.value) {
      const sanitizedText: string = sanitize(requiredStatement.value);

      $attributionText.html(sanitizedText);

      const resize = () => this.resize();

      $attributionText
        .find("img")
        .one("load", () => {
          this.resize();
        })
        .each(function () {
          if (this.complete) {
            resize();
          }
        });

      $attributionText.find("img").one("error", () => {
        resize();
      });

      $attributionText.targetBlank();
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

    this.resize();

    // We mark it as loaded if mostSpecific=false to prevent it reloading
    if (!mostSpecific) {
      this.isAttributionLoaded = true;
    }
  }

  resize(): void {
    super.resize();

    let titleHeight: number;
    let subtitleHeight: number;

    if (
      (this.options && this.options.titleEnabled === false) ||
      !isVisible(this.$title)
    ) {
      titleHeight = 0;
    } else {
      titleHeight = this.$title.outerHeight(true);
    }

    if (
      (this.options && this.options.subtitleEnabled === false) ||
      !isVisible(this.$subtitle)
    ) {
      subtitleHeight = 0;
    } else {
      subtitleHeight = this.$subtitle.outerHeight(true);
    }

    this.$content.height(this.$element.height() - titleHeight - subtitleHeight);
    this.$content.width(this.$element.width());
    const $text = this.$attribution.find(".attribution-text");

    $text.css("maxHeight", `calc(${this.$content.height()}px - 100px)`);
    $text.css("overflow-y", "auto");

    if (this.$attribution && this.isAttributionOpen) {
      switch (this.attributionPosition) {
        case Position.BOTTOM_LEFT:
          this.$attribution.css("bottom", 0);
          this.$attribution.css("left", 0);
          break;
        case Position.BOTTOM_RIGHT:
          this.$attribution.css("bottom", 0);
          this.$attribution.css("right", 0);
          break;
      }

      // hide the attribution if there's no room for it
      if (this.$content.width() <= this.$attribution.width()) {
        this.$attribution.hide();
      } else {
        this.$attribution.show();
      }
    }

    if (this.subtitle && this.options.subtitleEnabled) {
      this.$subtitleText.html(
        sanitize(this.subtitle.replace(/<br\s*[\/]?>/gi, "; "))
      );
      this.$subtitleText.removeClass("elided");
      this.$subtitle.show();
      this.$subtitleWrapper.css(
        "max-height",
        this.$content.height() + this.$subtitle.outerHeight()
      );
      this.$subtitleWrapper.width(this.$content.width());

      if (!this.subtitleExpanded) {
        this.$subtitleText.width("auto");
        this.$subtitleWrapper.width("auto");
        this.$subtitleExpand.hide();

        // if the subtitle span is wider than the container, set it to display:block
        // and set its width to that of the container
        // this will make it appear elided.
        // show the expand button
        if (this.$subtitleText.width() > this.$content.width()) {
          this.$subtitleExpand.show();
          this.$subtitleText.addClass("elided");
          this.$subtitleText.width(
            this.$content.width() -
              (this.$subtitleExpand.outerWidth() +
                this.$subtitleText.horizontalMargins())
          );
        }
      } else {
        // subtitle expanded
        this.$subtitleText.width(
          this.$content.width() - this.$subtitleText.horizontalMargins() - 2
        );
      }
    } else {
      this.$subtitle.hide();
    }
  }
}
