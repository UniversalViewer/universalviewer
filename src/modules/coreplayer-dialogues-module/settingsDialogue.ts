import baseExtension = require("../coreplayer-shared-module/baseExtension");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import shell = require("../coreplayer-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../coreplayer-shared-module/dialogue");

export class SettingsDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $pagingEnabledTitle: JQuery;
    $pagingEnabledCheckbox: JQuery;

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

        this.$pagingEnabledCheckbox = $('<input id="pagingEnabled" type="checkbox" />');
        this.$scroll.append(this.$pagingEnabledCheckbox);

        this.$pagingEnabledTitle = $('<label for="pagingEnabled">' + this.content.pagingEnabled + '</label>');
        this.$scroll.append(this.$pagingEnabledTitle);

        // initialise ui.
        this.$title.text(this.content.title);

        var that = this;

        this.$pagingEnabledCheckbox.change(function() {
            var settings: ISettings = that.getSettings();

            if($(this).is(":checked")) {
                settings.pagingEnabled = true;
            } else {
                settings.pagingEnabled = false;
            }

            that.updateSettings(settings);
        });

        var settings: ISettings = this.getSettings();

        if (settings.pagingEnabled){
            this.$pagingEnabledCheckbox.attr("checked", "checked");
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