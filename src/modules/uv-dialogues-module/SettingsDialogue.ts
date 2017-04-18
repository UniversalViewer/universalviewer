import BaseCommands = require("../uv-shared-module/BaseCommands");
import BootstrapParams = require("../../BootstrapParams");
import Commands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import Shell = require("../uv-shared-module/Shell");

class SettingsDialogue extends Dialogue {

    $contributedBy: JQuery;
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

        // Adding contributed by text
        var contributedByText = this.content.contributedBy;
        var contributedByLink = '<a href="' + this.options.contributedByOptions.website + '" title="' + this.options.contributedByOptions.contributor + '" tabindex="0" target="_blank">' + this.options.contributedByOptions.contributor + '</a>';
        contributedByText = String.format(contributedByText, contributedByLink);

        this.$contributedBy = $('<div class="version">' + contributedByText + '</div>');
        this.$content.append(this.$contributedBy);

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

        this.$website.html(this.content.website);
        this.$website.targetBlank();

        var locales: any[] = this.extension.getLocales();

        for (var i = 0; i < locales.length; i++) {
            var locale = locales[i];
            this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
        }

        this.$localeDropDown.val(this.extension.locale);

        this.$localeDropDown.change(() => {
            this.extension.changeLocale(this.$localeDropDown.val());
        });

        if (this.extension.getLocales().length < 2){
            this.$locale.hide();
        }

        this.updateContributedBy();

        this.$element.hide();
    }

    getSettings(): ISettings {
        return this.extension.getSettings();
    }

    updateContributedBy(): void {
        var configEnabled = Utils.Bools.getBool(this.options.contributedByEnabled, false);

        if (configEnabled){
            this.$contributedBy.show();
        } else {
            this.$contributedBy.hide();
        }
    }

    updateSettings(settings: ISettings): void {
        this.extension.updateSettings(settings);

        $.publish(Commands.UPDATE_SETTINGS, [settings]);
    }

    open(): void {
        super.open();

        if (!window.DEBUG) {
            $.getJSON("package.json", (pjson: any) => {
                this.$version.text("v" + pjson.version);
            });
        }
    }

    resize(): void {
        super.resize();
    }

}

export = SettingsDialogue;