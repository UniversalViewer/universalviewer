const $ = require("jquery");
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { ILocale } from "../uv-shared-module/ILocale";

export class SettingsDialogue extends Dialogue<
  BaseConfig["modules"]["settingsDialogue"]
> {
  $locale: JQuery;
  $localeDropDown: JQuery;
  $localeLabel: JQuery;
  $scroll: JQuery;
  $title: JQuery;
  $version: JQuery;
  $website: JQuery;

  // Theme selector
  $themeSelector:  JQuery;
  $themeSelectorDropDown:  JQuery;
  $themeSelectorLabel:  JQuery;

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

    // Theme selector dropdown
    this.$themeSelector = $('<div class="setting color-scheme"></div>');
    this.$scroll.append(this.$themeSelector);
    this.$themeSelectorLabel = $('<label for="theme-selection">' + "Color Scheme" + "</label>");
    this.$themeSelector.append(this.$themeSelectorLabel);
    this.$themeSelectorDropDown = $('<select id="theme-selection"></select>');
    this.$themeSelector.append(this.$themeSelectorDropDown);

    // initialise ui.
    this.$title.text(this.content.title);

    this.$website.html(this.content.website);
    this.$website.targetBlank();

    this._createLocalesMenu();
    this._createThemeSelectorMenu();

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
    
  private _createThemeSelectorMenu(): void {
    // @todo pull activeThemes structure into managed typed data + manage custom themes in base config properties
    const activeThemes = [{
      name: "dark",
      label: "Dark"
       },
      {
      name: "auto",
      label: "Auto"
       },
      {
      name: "light",
      label: "Light"
       },
      {
      name: "chris-purple",
      label: "Dev Chris Purple"
       },
      {
      name: "high-contrast",
      label: "High Contrast"
       }];

  if (activeThemes) {
    for (let i = 0; i < activeThemes.length; i++) {
        const theme =  activeThemes[i];
        this.$themeSelectorDropDown.append(
          '<option value="' + theme.name + '">' + theme.label + "</option>"
        );
      }

      this.$themeSelectorDropDown.val(activeThemes[0].name);
    }

    this.$themeSelectorDropDown.change(() => {
      let uv = document.getElementById('uv');
        if (uv)
          // @todo build functional classes in IExtension.ts + BaseExtension.ts to mirror changeLocale()
          uv.dataset.theme = this.$themeSelectorDropDown.val();
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

    const settings: ISettings = this.getSettings();

    if (settings.animationDuration) {
      document.documentElement.style.setProperty(
        "--uv-animation-duration",
        `${settings.animationDuration}ms`
      );
    }

    if (settings.reducedAnimation) {
      document.documentElement.style.setProperty("--uv-animation", "0");
      this.$reducedAnimationCheckbox.prop("checked", true);
    } else {
      document.documentElement.style.setProperty("--uv-animation", "1");
      this.$reducedAnimationCheckbox.removeAttr("checked");
    }

    this.$reducedAnimationCheckbox.change(() => {
      const settings: ISettings = {};

      if (this.$reducedAnimationCheckbox.is(":checked")) {
        settings.reducedAnimation = true;
        document.documentElement.style.setProperty("--uv-animation", "0");
      } else {
        settings.reducedAnimation = false;
        document.documentElement.style.setProperty("--uv-animation", "1");
      }

      this.updateSettings(settings);
    });
  }
}
