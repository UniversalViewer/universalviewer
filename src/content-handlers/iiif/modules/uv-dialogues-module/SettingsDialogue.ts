const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { ILocale } from "../uv-shared-module/ILocale";

export class SettingsDialogue extends Dialogue {
  $locale: JQuery;
  $localeDropDown: JQuery;
  $localeLabel: JQuery;
  $scroll: JQuery;
  $title: JQuery;
  $version: JQuery;
  $website: JQuery;

  // Accessibility elements
  $reducedAnimation: JQuery;
  $reducedAnimationLabel: JQuery;
  $reducedAnimationCheckbox: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("settingsDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_SETTINGS_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_SETTINGS_DIALOGUE;

    let lastElement: HTMLElement;
    this.extensionHost.subscribe(this.openCommand, (element: HTMLElement) => {
      lastElement = element;
      this.open();
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      if (lastElement) {
        lastElement.focus();
      }
      this.close();
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);

    this.$scroll = $('<div class="scroll"></div>');
    this.$content.append(this.$scroll);

    this.$version = $('<div class="version"></div>');
    this.$content.append(this.$version);

    this.$website = $('<div class="website"></div>');
    this.$content.append(this.$website);

    this.$locale = $('<div class="setting locale"></div>');
    this.$scroll.append(this.$locale);

    this.$localeLabel = $(
      '<label for="locale">' + this.content.locale + "</label>"
    );
    this.$locale.append(this.$localeLabel);

    this.$localeDropDown = $('<select id="locale"></select>');
    this.$locale.append(this.$localeDropDown);

    // initialise ui.
    this.$title.text(this.content.title);

    this.$website.html(this.content.website);
    this.$website.targetBlank();

    this._createLocalesMenu();

    this._createAccessibilityMenu();

    this.$element.hide();
  }

  getSettings(): ISettings {
    return this.extension.getSettings();
  }

  updateSettings(settings: ISettings): void {
    this.extension.updateSettings(settings);

    this.extensionHost.publish(IIIFEvents.UPDATE_SETTINGS, settings);
  }

  open(): void {
    super.open();
    this.$version.text("v" + process.env.PACKAGE_VERSION);
  }

  private _createLocalesMenu(): void {
    const locales: ILocale[] | undefined = this.extension.data.locales;

    if (locales && locales.length > 1) {
      for (let i = 0; i < locales.length; i++) {
        const locale: ILocale = locales[i];
        this.$localeDropDown.append(
          '<option value="' + locale.name + '">' + locale.label + "</option>"
        );
      }

      this.$localeDropDown.val(locales[0].name);
    } else {
      this.$locale.hide();
    }

    this.$localeDropDown.change(() => {
      this.extension.changeLocale(this.$localeDropDown.val());
    });
  }

  resize(): void {
    super.resize();
  }

  private _createAccessibilityMenu() {
    // Accessibility
    this.$reducedAnimation = $('<div class="setting reducedAnimation"></div>');
    this.$scroll.append(this.$reducedAnimation);

    this.$reducedAnimationCheckbox = $(
      '<input id="reducedAnimation" type="checkbox" tabindex="0" />'
    );

    this.$reducedAnimation.append(this.$reducedAnimationCheckbox);

    this.$reducedAnimationLabel = $(
      '<label for="reducedAnimation">' + this.content.reducedMotion + "</label>"
    );

    this.$reducedAnimation.append(this.$reducedAnimationLabel);

    this.$reducedAnimationCheckbox.change(() => {
      const settings: ISettings = {};

      if (this.$reducedAnimationCheckbox.is(":checked")) {
        settings.reducedAnimation = true;
      } else {
        settings.reducedAnimation = false;
      }

      this.updateSettings(settings);
    });
  }
}
