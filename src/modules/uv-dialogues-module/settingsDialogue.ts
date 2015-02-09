import baseExtension = require("../uv-shared-module/baseExtension");
import extension = require("../../extensions/uv-seadragon-extension/extension");
import shell = require("../uv-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../uv-shared-module/dialogue");
import version = require("../../_Version");

export class SettingsDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $version: JQuery;
    $pagingEnabled: JQuery;
    $pagingEnabledTitle: JQuery;
    $pagingEnabledCheckbox: JQuery;
    $preserveViewport: JQuery;
    $preserveViewportTitle: JQuery;
    $preserveViewportCheckbox: JQuery;

    static SHOW_SETTINGS_DIALOGUE: string = 'onShowSettingsDialogue';
    static HIDE_SETTINGS_DIALOGUE: string = 'onHideSettingsDialogue';
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

        this.$pagingEnabled = $('<div class="setting pagingEnabled"></div>');
        this.$scroll.append(this.$pagingEnabled);

            this.$pagingEnabledCheckbox = $('<input id="pagingEnabled" type="checkbox" />');
            this.$pagingEnabled.append(this.$pagingEnabledCheckbox);

            this.$pagingEnabledTitle = $('<label for="pagingEnabled">' + this.content.pagingEnabled + '</label>');
            this.$pagingEnabled.append(this.$pagingEnabledTitle);

        this.$preserveViewport = $('<div class="setting preserveViewport"></div>');
        this.$scroll.append(this.$preserveViewport);

            this.$preserveViewportCheckbox = $('<input id="preserveViewport" type="checkbox" />');
            this.$preserveViewport.append(this.$preserveViewportCheckbox);

            this.$preserveViewportTitle = $('<label for="preserveViewport">' + this.content.preserveViewport + '</label>');
            this.$preserveViewport.append(this.$preserveViewportTitle);

        // initialise ui.
        this.$title.text(this.content.title);

        var that = this;

        this.$version.text("v" + version.Version);

        this.$pagingEnabledCheckbox.change(function() {
            var settings: ISettings = that.getSettings();

            if($(this).is(":checked")) {
                settings.pagingEnabled = true;
            } else {
                settings.pagingEnabled = false;
            }

            that.updateSettings(settings);
        });

        this.$preserveViewportCheckbox.change(function() {
            var settings: ISettings = that.getSettings();

            if($(this).is(":checked")) {
                settings.preserveViewport = true;
            } else {
                settings.preserveViewport = false;
            }

            that.updateSettings(settings);
        });

        var settings: ISettings = this.getSettings();

        if (settings.pagingEnabled){
            this.$pagingEnabledCheckbox.attr("checked", "checked");
        }

        if (settings.preserveViewport){
            this.$preserveViewportCheckbox.attr("checked", "checked");
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

    resize(): void {
        super.resize();

    }
}