import { BaseView } from "./BaseView";
import { Information } from "./Information";
import { InformationArgs } from "./InformationArgs";
export declare class HeaderPanel extends BaseView {
    $centerOptions: JQuery;
    $helpButton: JQuery;
    $informationBox: JQuery;
    $localeToggleButton: JQuery;
    $options: JQuery;
    $rightOptions: JQuery;
    $settingsButton: JQuery;
    information: Information;
    constructor($element: JQuery);
    create(): void;
    updateLocaleToggle(): void;
    updateSettingsButton(): void;
    localeToggleIsVisible(): boolean;
    showInformation(args: InformationArgs): void;
    hideInformation(): void;
    getSettings(): ISettings;
    updateSettings(settings: ISettings): void;
    resize(): void;
}
