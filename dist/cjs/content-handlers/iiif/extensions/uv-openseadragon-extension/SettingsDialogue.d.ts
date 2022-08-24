import { SettingsDialogue as BaseSettingsDialogue } from "../../modules/uv-dialogues-module/SettingsDialogue";
export declare class SettingsDialogue extends BaseSettingsDialogue {
    $clickToZoomEnabled: JQuery;
    $clickToZoomEnabledCheckbox: JQuery;
    $clickToZoomEnabledLabel: JQuery;
    $navigatorEnabled: JQuery;
    $navigatorEnabledCheckbox: JQuery;
    $navigatorEnabledLabel: JQuery;
    $pagingEnabled: JQuery;
    $pagingEnabledCheckbox: JQuery;
    $pagingEnabledLabel: JQuery;
    $preserveViewport: JQuery;
    $preserveViewportCheckbox: JQuery;
    $preserveViewportLabel: JQuery;
    constructor($element: JQuery);
    create(): void;
    open(): void;
}
