import BaseCommands = require("../uv-shared-module/BaseCommands");
import BootstrapParams = require("../../BootstrapParams");
import Commands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import Shell = require("../uv-shared-module/Shell");
import Version = require("../../_Version");

class SettingsDialogue extends Dialogue {

    $locale: JQuery;
    $localeDropDown: JQuery;
    $localeLabel: JQuery;
    $scroll: JQuery;
    $title: JQuery;
    $version: JQuery;
    $website: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('settingsDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_SETTINGS_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_SETTINGS_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$version = $('<div class="version"></div>');
        this.$content.append(this.$version);

        this.$website = $('<div class="website"></div>');
        this.$content.append(this.$website);

        this.$locale = $('<div class="setting locale"></div>');
        this.$scroll.append(this.$locale);

        this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
        this.$locale.append(this.$localeLabel);

        this.$localeDropDown = $('<select id="locale"></select>');
        this.$locale.append(this.$localeDropDown);

        // initialise ui.
        this.$title.text(this.content.title);

        this.$version.text("v" + Version.Version);

        this.$website.html(this.content.website);
        this.$website.targetBlank();

        var locales: any[] = this.provider.getLocales();

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

        $.publish(Commands.UPDATE_SETTINGS, [settings]);
    }

    open(): void {
        super.open();
    }

    resize(): void {
        super.resize();
    }
}

export = SettingsDialogue;