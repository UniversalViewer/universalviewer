const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "./BaseView";
import { ILocale } from "./ILocale";
import { Information } from "./Information";
import { InformationAction } from "./InformationAction";
import { InformationArgs } from "./InformationArgs";
import { InformationFactory } from "./InformationFactory";
import { Bools } from "../../Utils";
import { isVisible } from "../../../../Utils";
import { BaseConfig } from "../../BaseConfig";

export class HeaderPanel<
  T extends BaseConfig["modules"]["headerPanel"],
> extends BaseView<T> {
  $centerOptions: JQuery;
  $helpButton: JQuery;
  $informationBox: JQuery;
  $localeToggleButton: JQuery;
  $options: JQuery;
  $rightOptions: JQuery;
  $settingsButton: JQuery;
  information: Information;

  constructor($element: JQuery) {
    super($element, false, false);
  }

  create(): void {
    this.setConfig("headerPanel");

    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.SHOW_INFORMATION,
      (args: InformationArgs) => {
        this.showInformation(Array.isArray(args) ? args[0] : args);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.HIDE_INFORMATION, () => {
      this.hideInformation();
    });

    this.$options = $('<div class="options"></div>');
    this.$element.append(this.$options);

    this.$centerOptions = $('<div class="centerOptions"></div>');
    this.$options.append(this.$centerOptions);

    this.$rightOptions = $('<div class="rightOptions"></div>');
    this.$options.append(this.$rightOptions);

    this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
    this.$rightOptions.append(this.$localeToggleButton);

    this.$settingsButton = $(`
          <button class="btn imageBtn settings" tabindex="0" title="${this.content.settings}">
            <i class="uv-icon-settings" aria-hidden="true"></i>
          </button>
        `);
    this.$settingsButton.attr("title", this.content.settings);
    this.$rightOptions.append(this.$settingsButton);

    this.$helpButton = $(`
      <a class="btn imageBtn help" tabindex="0" title="${this.content.help}" role="button">
        <i class="uv-icon-help" aria-hidden="true"></i>
      </a>
    `);
    this.$rightOptions.append(this.$helpButton);

    this.$informationBox = $(
      '<div class="informationBox" aria-hidden="true"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <button type="button" class="close"> \
                                        <span aria-hidden="true">&#215;</span>\
                                    </button> \
                                  </div>'
    );

    this.$element.append(this.$informationBox);

    this.$informationBox.hide();
    var $closeButton = this.$informationBox.find(".close");
    $closeButton.attr("aria-label", this.content.close);
    $closeButton.attr("title", this.content.close);
    $closeButton.on("click", (e) => {
      e.preventDefault();
      this.extensionHost.publish(IIIFEvents.HIDE_INFORMATION);
    });

    this.$localeToggleButton.on("click", () => {
      this.extension.changeLocale(
        String(this.$localeToggleButton.data("locale"))
      );
    });

    this.$settingsButton.onPressed(() => {
      this.extensionHost.publish(
        IIIFEvents.SHOW_SETTINGS_DIALOGUE,
        this.$settingsButton
      );
    });

    if (!Bools.getBool(this.options.centerOptionsEnabled, true)) {
      this.$centerOptions.hide();
    }

    this.updateLocaleToggle();
    this.updateSettingsButton();
  }

  updateLocaleToggle(): void {
    if (!this.localeToggleIsVisible()) {
      this.$localeToggleButton.hide();
      return;
    }

    const alternateLocale: any = this.extension.getAlternateLocale();
    const text: string = alternateLocale.name.split("-")[0].toUpperCase();

    this.$localeToggleButton.data("locale", alternateLocale.name);
    this.$localeToggleButton.attr("title", alternateLocale.label);
    this.$localeToggleButton.text(text);
  }

  updateSettingsButton(): void {
    const settingsEnabled: boolean = Bools.getBool(
      this.options.settingsButtonEnabled,
      true
    );
    if (!settingsEnabled) {
      this.$settingsButton.hide();
    } else {
      this.$settingsButton.show();
    }
  }

  localeToggleIsVisible(): boolean {
    const locales: ILocale[] | undefined = this.extension.data.locales;

    if (locales) {
      return (
        locales.length > 1 &&
        Bools.getBool(this.options.localeToggleEnabled, false)
      );
    }

    return false;
  }

  showInformation(args: InformationArgs): void {
    const informationFactory: InformationFactory = new InformationFactory(
      this.extension
    );
    this.information = informationFactory.Get(args);
    if (!this.information) return;

    var $message = this.$informationBox.find(".message");
    $message.html(this.information.message).find("a").attr("target", "_top");
    var $actions = this.$informationBox.find(".actions");
    $actions.empty();

    for (let i = 0; i < this.information.actions.length; i++) {
      const action: InformationAction = this.information.actions[i];
      const $action: JQuery = $(
        '<a href="#" class="btn btn-default">' + action.label + "</a>"
      );
      $action.on("click", action.action);
      $actions.append($action);
    }

    this.extensionHost.publish(IIIFEvents.MESSAGE_DISPLAYED, this.information);

    this.$informationBox.attr("aria-hidden", "false");
    this.$informationBox.show();
    this.$element.addClass("showInformation");
    this.extension.resize();
  }

  hideInformation(): void {
    this.$element.removeClass("showInformation");
    this.$informationBox.attr("aria-hidden", "true");
    this.$informationBox.hide();
    this.extension.resize();
  }

  getSettings(): ISettings {
    return this.extension.getSettings();
  }

  updateSettings(settings: ISettings): void {
    this.extension.updateSettings(settings);
    this.extensionHost.publish(IIIFEvents.UPDATE_SETTINGS, settings);
  }

  resize(): void {
    super.resize();

    const headerWidth: number = this.$element.width();
    const center: number = headerWidth / 2;
    const containerWidth: number = this.$centerOptions.outerWidth();
    const pos: number = center - containerWidth / 2;

    this.$centerOptions.css({
      left: pos,
    });

    if (isVisible(this.$informationBox)) {
      const $actions: JQuery = this.$informationBox.find(".actions");
      const $message: JQuery = this.$informationBox.find(".message");
      $message.width(
        Math.floor(this.$element.width()) -
          Math.ceil($message.horizontalMargins()) -
          Math.ceil($actions.outerWidth(true)) -
          Math.ceil(this.$informationBox.find(".close").outerWidth(true)) -
          2
      );
      if (this.information) {
        $message.text(this.information.message);
      }
    }

    this.$helpButton.onPressed(() => {
      window.open(this.options.helpUrl);
    });

    if (this.options.helpEnabled && this.options.helpUrl) {
      this.$helpButton.show();
    } else {
      this.$helpButton.hide();
    }

    // hide toggle buttons below minimum width
    if (this.extension.isMobileMetric()) {
      if (this.localeToggleIsVisible()) this.$localeToggleButton.hide();
    } else {
      if (this.localeToggleIsVisible()) this.$localeToggleButton.show();
    }
  }
}
