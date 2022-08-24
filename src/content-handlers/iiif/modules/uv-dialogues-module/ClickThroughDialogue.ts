const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { IExternalResource } from "manifesto.js";

export class ClickThroughDialogue extends Dialogue {
  acceptCallback: any;
  $acceptTermsButton: JQuery;
  $message: JQuery;
  $title: JQuery;
  resource: IExternalResource;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("clickThroughDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_CLICKTHROUGH_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_CLICKTHROUGH_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, (params: any) => {
      this.acceptCallback = params.acceptCallback;
      this.resource = params.resource;
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
                    <a class="acceptTerms btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
    );

    this.$message = this.$content.find(".message");

    this.$acceptTermsButton = this.$content.find(".acceptTerms");
    // TODO: get from config this.$acceptTermsButton.text(this.content.acceptTerms); // figure out config
    this.$acceptTermsButton.text("Accept Terms and Open");

    this.$element.hide();

    this.$acceptTermsButton.on("click", (e) => {
      e.preventDefault();
      this.close();
      this.extensionHost.publish(IIIFEvents.ACCEPT_TERMS);
      if (this.acceptCallback) this.acceptCallback();
    });
  }

  open(): void {
    super.open();

    if (this.resource.clickThroughService) {
      this.$title.text(this.resource.clickThroughService.getProperty("label"));
      this.$message.html(
        this.resource.clickThroughService.getProperty("description")
      );
      this.$message.targetBlank();
    }

    this.$message.find("a").on("click", function() {
      var url: string = $(this).attr("href");
      this.extensionHost.publish(IIIFEvents.EXTERNAL_LINK_CLICKED, url);
    });

    this.resize();
  }

  resize(): void {
    super.resize();
  }
}
