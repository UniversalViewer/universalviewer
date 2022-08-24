import { Dialogue } from "../uv-shared-module/Dialogue";
export declare class SettingsDialogue extends Dialogue {
    $locale: JQuery;
    $localeDropDown: JQuery;
    $localeLabel: JQuery;
    $scroll: JQuery;
    $title: JQuery;
    $version: JQuery;
    $website: JQuery;
    $reducedAnimation: JQuery;
    $reducedAnimationLabel: JQuery;
    $reducedAnimationCheckbox: JQuery;
    constructor($element: JQuery);
    create(): void;
    getSettings(): ISettings;
    updateSettings(settings: ISettings): void;
    open(): void;
    private _createLocalesMenu;
    resize(): void;
    private _createAccessibilityMenu;
}
