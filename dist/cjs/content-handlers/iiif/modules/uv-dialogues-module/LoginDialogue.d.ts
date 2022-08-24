import { Dialogue } from "../uv-shared-module/Dialogue";
import { ILoginDialogueOptions } from "../uv-shared-module/ILoginDialogueOptions";
import { IExternalResource } from "manifesto.js";
export declare class LoginDialogue extends Dialogue {
    loginCallback: any;
    logoutCallback: any;
    $cancelButton: JQuery;
    $loginButton: JQuery;
    $logoutButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    options: ILoginDialogueOptions;
    resource: IExternalResource;
    constructor($element: JQuery);
    create(): void;
    open(): void;
    updateLogoutButton(): void;
    resize(): void;
}
