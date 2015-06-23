import BaseSettingsDialogue = require("../../modules/uv-dialogues-module/SettingsDialogue");

class SettingsDialogue extends BaseSettingsDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create() : void {
        this.setConfig('settingsDialogue');

        super.create();
    }
}

export = SettingsDialogue;