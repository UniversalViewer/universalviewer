const $ = require("jquery");
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { Bools, Numbers } from "@edsilv/utils";
import { ILabelValuePair } from "@iiif/manifold";

export class ShareDialogue<
  T extends BaseConfig["modules"]["shareDialogue"]
> extends Dialogue<T> {
  $shareButton: JQuery;

  $urlInput: JQuery;
  $urlSection: JQuery;
  isShareViewVisible: boolean = false;

  $manifestInput: JQuery;
  $manifestSection: JQuery;
  shareManifestsEnabled: boolean = false;

  embedCode: string;
  $embedCode: JQuery;
  $embedSection: JQuery;
  isEmbedViewVisible: boolean = false;

  $customSize: JQuery;
  $customSizeDropDown: JQuery;
  $size: JQuery;
  $widthInput: JQuery;
  $x: JQuery;
  $heightInput: JQuery;

  $termsOfUseButton: JQuery;

  aspectRatio: number = 1.0;
  currentHeight: number;
  currentWidth: number;
  maxWidth: number = 8000;
  maxHeight: number = this.maxWidth * this.aspectRatio;
  minWidth: number = 200;
  minHeight: number = this.minWidth * this.aspectRatio;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("shareDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_SHARE_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_SHARE_DIALOGUE;
    this.shareManifestsEnabled = this.options.shareManifestsEnabled || false;

    let lastElement: HTMLElement;
    this.extensionHost.subscribe(
      this.openCommand,
      (triggerButton: HTMLElement) => {
        lastElement = triggerButton;
        this.open(triggerButton);
      }
    );

    this.extensionHost.subscribe(this.closeCommand, () => {
      if (lastElement) {
        lastElement.focus();
      }
      this.close();
    });

    this.extensionHost.subscribe(
      IIIFEvents.SHOW_EMBED_DIALOGUE,
      (triggerButton: HTMLElement) => {
        this.open(triggerButton);
      }
    );

    // Share URL

    this.$urlSection = $(
      `<div class="share__section"><label class="share__label" for="embedCode">${this.content.share}</label></div>`
    );

    const shareUrl = this.getShareUrl();
    this.$urlInput = $(
      `<input class="copy-input" id="urlInput" type="text" value="${shareUrl}" readonly/>`
    );
    this.$urlInput.focus(function () {
      $(this).select();
    });
    this.$urlSection.append(this.$urlInput);
    this.$content.append(this.$urlSection);

    // Manifest URL

    this.$manifestSection = $(
      `<div class="share__section"><label class="share__label" for="manifestCode">${this.content.iiif}</label></div>`
    );

    const iiifUrl: string = this.extension.getIIIFShareUrl(
      this.shareManifestsEnabled
    );
    this.$manifestInput = $(
      `<input class="copy-input" id="manifestInput" type="text" value="${iiifUrl}" readonly/>`
    );
    this.$manifestInput.focus(function () {
      $(this).select();
    });
    this.$manifestSection.append(this.$manifestInput);
    this.$content.append(this.$manifestSection);

    // Embed IFRAME code

    this.$embedSection = $(
      `<div class="share__section"><label class="share__label" for="embedCode">${this.content.embed}</label></div>`
    );

    this.$embedCode = $(
      `<input class="copy-input" id="embedCode" type="text" readonly/>`
    );
    this.$embedCode.focus(function () {
      $(this).select();
    });
    this.$embedSection.append(this.$embedCode);
    this.$content.append(this.$embedSection);

    // Embed size customization

    this.$customSize = $('<div class="customSize"></div>');
    this.$embedSection.append(this.$customSize);

    this.$size = $(
      '<label for="size" class="size">' + this.content.size + "</label>"
    );
    this.$customSize.append(this.$size);

    this.$customSizeDropDown = $(
      '<select class="embed-size-select" id="size" aria-label="' +
        this.content.size +
        '"></select>'
    );
    this.$customSizeDropDown.append(
      '<option value="small" data-width="560" data-height="420">560 x 420</option>'
    );
    this.$customSizeDropDown.append(
      '<option value="medium" data-width="640" data-height="480">640 x 480</option>'
    );
    this.$customSizeDropDown.append(
      '<option value="large" data-width="800" data-height="600">800 x 600</option>'
    );
    this.$customSizeDropDown.append(
      '<option value="custom">' + this.content.customSize + "</option>"
    );
    this.$customSizeDropDown.change(() => {
      this.update();
    });
    this.$customSize.append(this.$customSizeDropDown);

    this.$widthInput = $(
      '<input class="width" type="text" maxlength="10" aria-label="' +
        this.content.width +
        '"/>'
    );
    this.$widthInput.on("keydown", (e) => {
      return Numbers.numericalInput(e);
    });
    this.$widthInput.change(() => {
      this.updateHeightRatio();
      this.update();
    });
    this.$customSize.append(this.$widthInput);

    // WIDTH x HEIGHT
    this.$x = $('<span class="x">x</span>');
    this.$customSize.append(this.$x);

    this.$heightInput = $(
      '<input class="height" type="text" maxlength="10" aria-label="' +
        this.content.height +
        '"/>'
    );
    this.$heightInput.on("keydown", (e) => {
      return Numbers.numericalInput(e);
    });
    this.$heightInput.change(() => {
      this.updateWidthRatio();
      this.update();
    });
    this.$customSize.append(this.$heightInput);

    // Share IFRAME

    this.$shareFrame = $('<iframe class="shareFrame"></iframe>');
    this.$content.append(this.$shareFrame);

    // Options

    if (this.shareManifestsEnabled) {
      this.$manifestSection.show();
    } else {
      this.$manifestSection.hide();
    }

    if (Bools.getBool(this.config.options.embedEnabled, false)) {
      this.$embedSection.show();
    } else {
      this.$embedSection.hide();
    }

    this.$termsOfUseButton = $(
      '<a href="#">' + this.extension.data.config!.content.termsOfUse + "</a>"
    );
    this.onAccessibleClick(this.$termsOfUseButton, () => {
      this.extensionHost.publish(IIIFEvents.SHOW_TERMS_OF_USE);
    });
    this.$content.append(this.$termsOfUseButton);

    this.$element.hide();
    this.update();
  }

  open(triggerButton?: HTMLElement): void {
    super.open(triggerButton);
    this.update();
  }

  getShareUrl(): string | null {
    return this.extension.getShareUrl();
  }

  isShareAvailable(): boolean {
    return !!this.getShareUrl();
  }

  update(): void {
    if (this.isShareAvailable()) {
      this.$urlSection.show();
    } else {
      this.$urlSection.hide();
    }

    const $selected: JQuery = this.getSelectedSize();

    if ($selected.val() === "custom") {
      this.$widthInput.show();
      this.$x.show();
      this.$heightInput.show();
    } else {
      this.$widthInput.hide();
      this.$x.hide();
      this.$heightInput.hide();
      this.currentWidth = Number($selected.data("width"));
      this.currentHeight = Number($selected.data("height"));
      this.$widthInput.val(String(this.currentWidth));
      this.$heightInput.val(String(this.currentHeight));
    }

    this.updateInstructions();
    this.updateShareOptions();
    this.updateTermsOfUseButton();
  }

  updateShareOptions(): void {
    const shareUrl: string | null = this.getShareUrl();

    if (shareUrl) {
      this.$urlInput.val(shareUrl);
    }

    if (this.extension.isMobile()) {
      this.$urlInput.hide();
    } else {
      this.$urlInput.show();
    }
  }

  updateInstructions(): void {
    // if (Bools.getBool(this.options.instructionsEnabled, false)) {
    //   this.$shareHeader.show();
    //   this.$embedHeader.show();
    //   this.$shareHeader.text(this.content.shareInstructions);
    //   this.$embedHeader.text(this.content.embedInstructions);
    // } else {
    //   this.$shareHeader.hide();
    //   this.$embedHeader.hide();
    // }
  }

  // updateThumbnail(): void {
  //     var canvas: manifesto.Canvas = this.extension.helper.getCurrentCanvas();

  //     if (!canvas) return;

  //     var thumbnail = canvas.getProperty('thumbnail');

  //     if (!thumbnail || !_.isString(thumbnail)){
  //         thumbnail = canvas.getCanonicalImageUri(this.extension.data.config!.options.bookmarkThumbWidth);
  //     }

  //     this.$link.attr('href', thumbnail);
  //     this.$image.attr('src', thumbnail);
  // }

  getSelectedSize(): JQuery {
    return this.$customSizeDropDown.find(":selected");
  }

  updateWidthRatio(): void {
    this.currentHeight = Number(this.$heightInput.val());
    if (this.currentHeight < this.minHeight) {
      this.currentHeight = this.minHeight;
      this.$heightInput.val(String(this.currentHeight));
    } else if (this.currentHeight > this.maxHeight) {
      this.currentHeight = this.maxHeight;
      this.$heightInput.val(String(this.currentHeight));
    }
    this.currentWidth = Math.floor(this.currentHeight / this.aspectRatio);
    this.$widthInput.val(String(this.currentWidth));
  }

  updateHeightRatio(): void {
    this.currentWidth = Number(this.$widthInput.val());
    if (this.currentWidth < this.minWidth) {
      this.currentWidth = this.minWidth;
      this.$widthInput.val(String(this.currentWidth));
    } else if (this.currentWidth > this.maxWidth) {
      this.currentWidth = this.maxWidth;
      this.$widthInput.val(String(this.currentWidth));
    }
    this.currentHeight = Math.floor(this.currentWidth * this.aspectRatio);
    this.$heightInput.val(String(this.currentHeight));
  }

  updateTermsOfUseButton(): void {
    const requiredStatement: ILabelValuePair | null =
      this.extension.helper.getRequiredStatement();

    if (
      Bools.getBool(
        this.extension.data.config!.options.termsOfUseEnabled,
        false
      ) &&
      requiredStatement &&
      requiredStatement.value
    ) {
      this.$termsOfUseButton.show();
    } else {
      this.$termsOfUseButton.hide();
    }
  }

  close(): void {
    super.close();
  }

  resize(): void {
    this.setDockedPosition();
  }
}
