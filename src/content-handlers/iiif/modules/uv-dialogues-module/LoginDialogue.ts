const $ = require("jquery");
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { ILoginDialogueOptions } from "../uv-shared-module/ILoginDialogueOptions";
import { IExternalResource } from "manifesto.js";

export class LoginDialogue extends Dialogue<
  BaseConfig["modules"]["loginDialogue"]
> {
  loginCallback: any;
  logoutCallback: any;
  $cancelButton: JQuery;
  $loginButton: JQuery;
  $logoutButton: JQuery;
  $message: JQuery;
  $title: JQuery;
  options: ILoginDialogueOptions;
  resource: IExternalResource;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("loginDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_LOGIN_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_LOGIN_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, (e: any) => {
      this.loginCallback = e.loginCallback;
      this.logoutCallback = e.logoutCallback;
      this.options = e.options;
      this.resource = e.resource;
      this.open();
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      this.close();
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);

    this.$content.append(
      '\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="logout btn btn-primary" href="#" target="_parent"></a>\
                    <a class="login btn btn-primary" href="#" target="_parent"></a>\
                    <a class="cancel btn btn-primary" href="#"></a>\
                </div>\
            </div>'
    );

    this.$message = this.$content.find(".message");

    this.$loginButton = this.$content.find(".login");
    this.$loginButton.text(this.content.login);

    this.$logoutButton = this.$content.find(".logout");
    this.$logoutButton.text(this.content.logout);

    this.$cancelButton = this.$content.find(".cancel");
    this.$cancelButton.text(this.content.cancel);

    this.$element.hide();

    this.$loginButton.on("click", (e) => {
      e.preventDefault();
      this.close();
      if (this.loginCallback) this.loginCallback();
    });

    this.$logoutButton.on("click", (e) => {
      e.preventDefault();
      this.close();
      if (this.logoutCallback) this.logoutCallback();
    });

    this.$cancelButton.on("click", (e) => {
      e.preventDefault();
      this.close();
    });

    this.updateLogoutButton();
  }

  open(): void {
    super.open();

    let message: string = "";

    if (this.resource.loginService) {
      this.$title.text(this.resource.loginService.getProperty("label"));
      message = this.resource.loginService.getProperty("description");
    }

    if (this.options.warningMessage) {
      message =
        '<span class="warning">' +
        this.extension.data.config!.content[this.options.warningMessage] +
        '</span><span class="description">' +
        message +
        "</span>";
    }

    this.updateLogoutButton();

    this.$message.html(message);
    this.$message.targetBlank();

    this.$message.find("a").on("click", function () {
      var url: string = $(this).attr("href");
      this.extensionHost.publish(IIIFEvents.EXTERNAL_LINK_CLICKED, url);
    });

    if (this.options.showCancelButton) {
      this.$cancelButton.show();
    } else {
      this.$cancelButton.hide();
    }

    this.resize();
  }

  updateLogoutButton(): void {
    if (this.extension.isLoggedIn) {
      this.$logoutButton.show();
    } else {
      this.$logoutButton.hide();
    }
  }

  resize(): void {
    super.resize();
  }
}
