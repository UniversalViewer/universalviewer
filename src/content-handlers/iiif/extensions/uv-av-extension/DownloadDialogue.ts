const $ = window.$;
import { DownloadDialogue as BaseDownloadDialogue } from "../../modules/uv-dialogues-module/DownloadDialogue";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { IIIFEvents } from "../../IIIFEvents";
import { IRenderingOption } from "../../modules/uv-shared-module/IRenderingOption";
import { Strings } from "@edsilv/utils";
import { Canvas, Range, Annotation } from "manifesto.js";

export class DownloadDialogue extends BaseDownloadDialogue {
  $canvasOptions: JQuery;
  $canvasOptionsContainer: JQuery;
  $downloadButton: JQuery;
  $entireFileAsOriginal: JQuery;
  $imageOptions: JQuery;
  $imageOptionsContainer: JQuery;
  $manifestOptions: JQuery;
  $manifestOptionsContainer: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {

    this.setConfig("downloadDialogue");

    super.create();

    this.$entireFileAsOriginal = $(
      '<li class="option single"><input id="' +
      DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
      '" type="radio" name="downloadOptions" tabindex="0" /><label id="' +
      DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
      'label" for="' +
      DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
      '"></label></li>'
    );
    this.$downloadOptions.append(this.$entireFileAsOriginal);
    this.$entireFileAsOriginal.hide();

    this.$downloadButton = $(
      '<a class="btn btn-primary" href="#" tabindex="0">' +
      this.content.download +
      "</a>"
    );
    this.$buttons.prepend(this.$downloadButton);
    this.$imageOptionsContainer = $('<li class="group image"></li>');
    this.$imageOptions = $("<ul></ul>");
    this.$imageOptionsContainer.append(this.$imageOptions);

    this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
    this.$canvasOptions = $("<ul></ul>");
    this.$canvasOptionsContainer.append(this.$canvasOptions);

    this.$manifestOptionsContainer = $('<li class="group manifest"></li>');
    this.$manifestOptions = $("<ul></ul>");
    this.$manifestOptionsContainer.append(this.$manifestOptions);

    const that = this;

    this.$downloadButton.on("click", (e) => {
      e.preventDefault();

      const $selectedOption: JQuery = that.getSelectedOption();

      const id: string = $selectedOption.attr("id");
      const label: string = $selectedOption.attr("title");
      let type: string = DownloadOption.UNKNOWN;

      if (this.renderingUrls[<any>id]) {
        window.open(this.renderingUrls[<any>id]);
      } else {
        const id: string = this.getCurrentResourceId();
        window.open(id);
      }

      this.extensionHost.publish(IIIFEvents.DOWNLOAD, {
        type: type,
        label: label,
      });

      this.close();
    });
  }

  private _isAdaptive(): boolean {
    const format: string = this.getCurrentResourceFormat();
    return format === "mpd" || format === "m3u8";
  }

  open(triggerButton: HTMLElement) {

    super.open(triggerButton);

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();

    if (
      this.isDownloadOptionAvailable(DownloadOption.ENTIRE_FILE_AS_ORIGINAL) &&
      !this._isAdaptive()
    ) {
      const $input: JQuery = this.$entireFileAsOriginal.find("input");
      const $label: JQuery = this.$entireFileAsOriginal.find("label");
      const label: string = Strings.format(
        this.content.entireFileAsOriginalWithFormat,
        this.getCurrentResourceFormat()
      );
      $label.text(label);
      $input.prop("title", label);
      this.$entireFileAsOriginal.show();
    }
    this.resetDynamicDownloadOptions();

    if (this.isDownloadOptionAvailable(DownloadOption.RANGE_RENDERINGS)) {
      if (canvas.ranges && canvas.ranges.length) {
        const currentRange: Range | null = this.extension.helper.getCurrentRange();

        if (currentRange) {
          this.$downloadOptions.append(this.$canvasOptionsContainer);

          const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
            currentRange,
            this.content.entireFileAsOriginal,
            DownloadOption.CANVAS_RENDERINGS
          );
          this.addDownloadOptionsForRenderings(renderingOptions);
        }

        // commented out as part of https://github.com/UniversalViewer/universalviewer/issues/876
        // for (let i = 0; i < canvas.ranges.length; i++) {
        //   const range: Range = canvas.ranges[i];
        //   const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
        //     range,
        //     this.content.entireFileAsOriginal,
        //     DownloadOption.CANVAS_RENDERINGS
        //   );
        //   console.log("renderingOptions", renderingOptions);
        //   this.addDownloadOptionsForRenderings(renderingOptions);
        // }
      }
    }

    if (this.isDownloadOptionAvailable(DownloadOption.IMAGE_RENDERINGS)) {
      const images: Annotation[] = canvas.getImages();
      if (images.length) {
        this.$downloadOptions.append(this.$imageOptionsContainer);
      }
      for (let i = 0; i < images.length; i++) {
        const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
          images[i].getResource(),
          this.content.entireFileAsOriginal,
          DownloadOption.IMAGE_RENDERINGS
        );
        this.addDownloadOptionsForRenderings(renderingOptions);
      }
    }

    if (this.isDownloadOptionAvailable(DownloadOption.CANVAS_RENDERINGS)) {
      const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
        canvas,
        this.content.entireFileAsOriginal,
        DownloadOption.CANVAS_RENDERINGS
      );
      if (renderingOptions.length) {
        this.$downloadOptions.append(this.$canvasOptionsContainer);
        this.addDownloadOptionsForRenderings(renderingOptions);
      }
    }

    if (this.isDownloadOptionAvailable(DownloadOption.MANIFEST_RENDERINGS)) {
      let renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
        this.extension.helper.getCurrentSequence(),
        this.content.entireDocument,
        DownloadOption.MANIFEST_RENDERINGS
      );

      if (!renderingOptions.length && this.extension.helper.manifest) {
        renderingOptions = this.getDownloadOptionsForRenderings(
          this.extension.helper.manifest,
          this.content.entireDocument,
          DownloadOption.MANIFEST_RENDERINGS
        );
      }

      if (renderingOptions.length) {
        this.$downloadOptions.append(this.$manifestOptionsContainer);
        this.addDownloadOptionsForRenderings(renderingOptions);
      }
    }

    if (this.$downloadOptions.length) {
      this.$entireFileAsOriginal.hide();
    }

    if (!this.$downloadOptions.find("li.option:visible").length) {
      this.$noneAvailable.show();
      this.$downloadButton.hide();
    } else {
      // select first option.
      this.$downloadOptions
        .find("li.option input:visible:first")
        .prop("checked", true);
      this.$noneAvailable.hide();
      this.$downloadButton.show();
    }

    this.resize();
  }

  addDownloadOptionsForRenderings(renderingOptions: IRenderingOption[]): void {
    renderingOptions.forEach((option: IRenderingOption) => {
      switch (option.type) {
        case DownloadOption.IMAGE_RENDERINGS:
          this.$imageOptions.append(option.button);
          break;
        case DownloadOption.CANVAS_RENDERINGS:
          this.$canvasOptions.append(option.button);
          break;
        case DownloadOption.MANIFEST_RENDERINGS:
          this.$manifestOptions.append(option.button);
          break;
      }
    });
  }

  isDownloadOptionAvailable(_option: DownloadOption): boolean {
    return this.isMediaDownloadEnabled();
  }
}
