import BaseSettingsDialogue = require("../../modules/uv-dialogues-module/SettingsDialogue");
import ISeadragonProvider = require("./ISeadragonProvider");

class SettingsDialogue extends BaseSettingsDialogue {

    $navigatorEnabled: JQuery;
    $navigatorEnabledCheckbox: JQuery;
    $navigatorEnabledLabel: JQuery;
    $pagingEnabled: JQuery;
    $pagingEnabledCheckbox: JQuery;
    $pagingEnabledLabel: JQuery;
    $preserveViewport: JQuery;
    $preserveViewportCheckbox: JQuery;
    $preserveViewportLabel: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create() : void {
        this.setConfig('settingsDialogue');

        super.create();

        this.$navigatorEnabled = $('<div class="setting navigatorEnabled"></div>');
        this.$scroll.append(this.$navigatorEnabled);

        // todo: use .checkboxButton jquery extension
        this.$navigatorEnabledCheckbox = $('<input id="navigatorEnabled" type="checkbox" />');
        this.$navigatorEnabled.append(this.$navigatorEnabledCheckbox);

        this.$navigatorEnabledLabel = $('<label for="navigatorEnabled">' + this.content.navigatorEnabled + '</label>');
        this.$navigatorEnabled.append(this.$navigatorEnabledLabel);
        
        this.$pagingEnabled = $('<div class="setting pagingEnabled"></div>');
        this.$scroll.append(this.$pagingEnabled);

        this.$pagingEnabledCheckbox = $('<input id="pagingEnabled" type="checkbox" />');
        this.$pagingEnabled.append(this.$pagingEnabledCheckbox);

        this.$pagingEnabledLabel = $('<label for="pagingEnabled">' + this.content.pagingEnabled + '</label>');
        this.$pagingEnabled.append(this.$pagingEnabledLabel);

        this.$preserveViewport = $('<div class="setting preserveViewport"></div>');
        this.$scroll.append(this.$preserveViewport);

        this.$preserveViewportCheckbox = $('<input id="preserveViewport" type="checkbox" />');
        this.$preserveViewport.append(this.$preserveViewportCheckbox);

        this.$preserveViewportLabel = $('<label for="preserveViewport">' + this.content.preserveViewport + '</label>');
        this.$preserveViewport.append(this.$preserveViewportLabel);

        this.$navigatorEnabledCheckbox.change(() => {
            var settings: ISettings = {};

            if(this.$navigatorEnabledCheckbox.is(":checked")) {
                settings.navigatorEnabled = true;
            } else {
                settings.navigatorEnabled = false;
            }

            this.updateSettings(settings);
        });

        this.$pagingEnabledCheckbox.change(() => {
            var settings: ISettings = {};

            if(this.$pagingEnabledCheckbox.is(":checked")) {
                settings.pagingEnabled = true;
            } else {
                settings.pagingEnabled = false;
            }

            this.updateSettings(settings);
        });

        this.$preserveViewportCheckbox.change(() => {
            var settings: ISettings = {};

            if(this.$preserveViewportCheckbox.is(":checked")) {
                settings.preserveViewport = true;
            } else {
                settings.preserveViewport = false;
            }

            this.updateSettings(settings);
        });
    }

    open(): void {
        super.open();

        var settings: ISettings = this.getSettings();
        
        if (settings.navigatorEnabled){
            this.$navigatorEnabledCheckbox.prop("checked", true);
        } else {
            this.$navigatorEnabledCheckbox.removeAttr("checked");
        }

        if (!(<ISeadragonProvider>this.provider).isPagingAvailable()){
            this.$pagingEnabled.hide();
        } else {
            if (settings.pagingEnabled){
                this.$pagingEnabledCheckbox.prop("checked", true);
            } else {
                this.$pagingEnabledCheckbox.removeAttr("checked");
            }
        }

        if (settings.preserveViewport){
            this.$preserveViewportCheckbox.prop("checked", true);
        } else {
            this.$preserveViewportCheckbox.removeAttr("checked");
        }
    }

}

export = SettingsDialogue;