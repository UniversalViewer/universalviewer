import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {ILocale} from "../../ILocale";

export class SettingsDialogue extends Dialogue {

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

        this.openCommand = BaseEvents.SHOW_SETTINGS_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_SETTINGS_DIALOGUE;

        $.subscribe(this.openCommand, () => {
            this.open();
        });

        $.subscribe(this.closeCommand, () => {
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

        this.$website.html(this.content.website);
        this.$website.targetBlank();

        this._createLocalesMenu();

        this.$element.hide();
    }

    getSettings(): ISettings {
        return this.extension.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.extension.updateSettings(settings);

        $.publish(BaseEvents.UPDATE_SETTINGS, [settings]);
    }

    open(): void {
        super.open();

        $.getJSON(this.extension.data.root + "/info.json", (pjson: any) => {
            this.$version.text("v" + pjson.version);
        });
    }

    private _createLocalesMenu(): void {

        const locales: ILocale[] = this.extension.data.locales;

        if (locales && locales.length > 1) {
            
            for (let i = 0; i < locales.length; i++) {
                const locale: ILocale = locales[i];
                this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
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
}