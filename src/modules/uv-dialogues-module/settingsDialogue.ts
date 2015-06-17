import BaseExtension = require("../uv-shared-module/BaseExtension");
import BootstrapParams = require("../../BootstrapParams");
import Dialogue = require("../uv-shared-module/Dialogue");
import Extension = require("../../extensions/uv-seadragon-extension/Extension");
import Shell = require("../uv-shared-module/Shell");
import Utils = require("../../Utils");
import Version = require("../../_Version");

class SettingsDialogue extends Dialogue {

    $locale: JQuery;
    $localeDropDown: JQuery;
    $localeLabel: JQuery;
    $scroll: JQuery;
    $title: JQuery;
    $version: JQuery;

    static HIDE_SETTINGS_DIALOGUE: string = 'onHideSettingsDialogue';
    static SHOW_SETTINGS_DIALOGUE: string = 'onShowSettingsDialogue';
    static UPDATE_SETTINGS: string = 'onUpdateSettings';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('settingsDialogue');

        super.create();

        $.subscribe(SettingsDialogue.SHOW_SETTINGS_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(SettingsDialogue.HIDE_SETTINGS_DIALOGUE, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$version = $('<div class="version"></div>');
        this.$content.append(this.$version);

        this.$locale = $('<div class="setting locale"></div>');
        this.$scroll.append(this.$locale);

            this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
            this.$locale.append(this.$localeLabel);

            this.$localeDropDown = $('<select id="locale"></select>');
            this.$locale.append(this.$localeDropDown);

        // initialise ui.
        this.$title.text(this.content.title);

        this.$version.text("v" + Version);

        var locales = this.provider.getLocales();

        for (var i = 0; i < locales.length; i++){
            var locale = locales[i];
            this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
        }

        this.$localeDropDown.val(this.provider.locale);

        this.$localeDropDown.change(() => {
            this.provider.changeLocale(this.$localeDropDown.val());
        });

        if (this.provider.getLocales().length < 2){
            this.$locale.hide();
        }

        this.$element.hide();
    }

    getSettings(): ISettings {
        return this.provider.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.provider.updateSettings(settings);

        $.publish(SettingsDialogue.UPDATE_SETTINGS, [settings]);
    }

    open(): void {
        super.open();
    }

    resize(): void {
        super.resize();

    }
}

export = SettingsDialogue;