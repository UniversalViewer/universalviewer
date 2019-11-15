import {SettingsDialogue as BaseSettingsDialogue} from "../../modules/uv-dialogues-module/SettingsDialogue";

export class SettingsDialogue extends BaseSettingsDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create() : void {
        this.setConfig('settingsDialogue');

        super.create();
    }
}