const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { DownloadOption } from "../uv-shared-module/DownloadOption";
import { IRenderingOption } from "../uv-shared-module/IRenderingOption";
import { Bools, Files, Strings } from "@edsilv/utils";
import {
  Annotation,
  AnnotationBody,
  Canvas,
  LanguageMap,
  ManifestResource,
  Rendering,
} from "manifesto.js";
import { RenderingFormat, MediaType } from "@iiif/vocabulary/dist-commonjs/";
import { ILabelValuePair } from "@iiif/manifold";

export class DownloadDialogue extends Dialogue {
  $downloadOptions: JQuery;
  $noneAvailable: JQuery;
  $title: JQuery;
  $footer: JQuery;
  $termsOfUseButton: JQuery;

  renderingUrls: string[];
  renderingUrlsCount: number;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("downloadDialogue");

    super.create();

    // Accessibility.
    this.$element.attr("role", "region");
    this.$element.attr("aria-label", this.content.title);

    this.openCommand = IIIFEvents.SHOW_DOWNLOAD_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_DOWNLOAD_DIALOGUE;

    let lastButton: HTMLElement;
    this.extensionHost.subscribe(
      this.openCommand,
      (triggerButton: HTMLElement) => {
        lastButton = triggerButton;
        this.open(triggerButton);
      }
    );

    this.extensionHost.subscribe(this.closeCommand, () => {
      if (lastButton) {
        lastButton.focus();
      }
      this.close();
    });

    // create ui.
    this.$title = $(
      `<div role="heading" class="heading">${this.content.title}</div>`
    );
    this.$content.append(this.$title);

    this.$noneAvailable = $(
      '<div class="noneAvailable">' + this.content.noneAvailable + "</div>"
    );
    this.$content.append(this.$noneAvailable);

    this.$downloadOptions = $('<ol class="options"></ol>');
    this.$content.append(this.$downloadOptions);

    this.$footer = $('<div class="footer"></div>');
    this.$content.append(this.$footer);

    this.$termsOfUseButton = $(
      '<a href="#">' + this.extension.data.config.content.termsOfUse + "</a>"
    );
    this.$footer.append(this.$termsOfUseButton);

    this.$termsOfUseButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.SHOW_TERMS_OF_USE);
    });

    // hide
    this.$element.hide();
    this.updateTermsOfUseButton();
  }

  addEntireFileDownloadOptions(): void {
    if (
      this.isDownloadOptionAvailable(DownloadOption.ENTIRE_FILE_AS_ORIGINAL)
    ) {
      this.$downloadOptions.empty();

      //

      // add each file src
      const canvas: Canvas = this.extension.helper.getCurrentCanvas();

      let renderingFound: boolean = false;

      const renderings: Rendering[] = canvas.getRenderings();

      for (let i = 0; i < renderings.length; i++) {
        const rendering: Rendering = renderings[i];
        const renderingFormat: RenderingFormat = rendering.getFormat();
        let format: string = "";
        if (renderingFormat) {
          format = renderingFormat.toString();
        }
        this.addEntireFileDownloadOption(
          rendering.id,
          <string>LanguageMap.getValue(rendering.getLabel()),
          format
        );
        renderingFound = true;
      }

      if (!renderingFound) {
        let annotationFound: boolean = false;

        const annotations: Annotation[] = canvas.getContent();

        for (let i = 0; i < annotations.length; i++) {
          const annotation: Annotation = annotations[i];
          const body: AnnotationBody[] = annotation.getBody();

          if (body.length) {
            const format: MediaType | null = body[0].getFormat();

            if (format) {
              this.addEntireFileDownloadOption(
                body[0].id,
                "",
                format.toString()
              );
              annotationFound = true;
            }
          }
        }

        if (!annotationFound) {
          this.addEntireFileDownloadOption(canvas.id, "", "");
        }
      }
    }
  }

  addEntireFileDownloadOption(
    uri: string,
    label: string,
    format: string
  ): void {
    let fileType: string | null;

    if (format) {
      fileType = Files.simplifyMimeType(format);
    } else {
      fileType = this.getFileExtension(uri);
    }

    if (!label) {
      label = this.content.entireFileAsOriginal;
    }

    if (fileType) {
      label += " (" + fileType + ")";
    }

    this.$downloadOptions.append(
      '<li><a href="' +
      uri +
      '" target="_blank" download tabindex="0">' +
      label +
      "</li>"
    );
  }

  resetDynamicDownloadOptions(): void {
    this.renderingUrls = [];
    this.renderingUrlsCount = 0;
    this.$downloadOptions.find("li.dynamic").remove();
  }

  getDownloadOptionsForRenderings(
    resource: ManifestResource,
    defaultLabel: string,
    type: DownloadOption
  ): IRenderingOption[] {

    const renderings: Rendering[] = resource.getRenderings();

    const downloadOptions: any[] = [];

    for (let i = 0; i < renderings.length; i++) {
      const rendering: Rendering = renderings[i];
      if (rendering) {
        let label: string | null = LanguageMap.getValue(
          rendering.getLabel(),
          this.extension.getLocale()
        );
        const currentId: string = "downloadOption" + ++this.renderingUrlsCount;
        if (label) {
          label += " ({0})";
        } else {
          label = defaultLabel;
        }
        const mime: string = Files.simplifyMimeType(
          rendering.getFormat().toString()
        );
        label = Strings.format(label, mime);
        this.renderingUrls[<any>currentId] = rendering.id;
        const $button: JQuery = $(
          '<li class="option dynamic"><input id="' +
          currentId +
          '" data-mime="' +
          mime +
          '" title="' +
          label +
          '" type="radio" name="downloadOptions" tabindex="0" /><label for="' +
          currentId +
          '">' +
          label +
          "</label></li>"
        );

        downloadOptions.push({
          type: type,
          button: $button,
        });
      }
    }

    return downloadOptions;
  }

  getSelectedOption() {
    return this.$downloadOptions.find("li.option input:checked");
  }

  getCurrentResourceId(): string {
    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    let id = canvas.externalResource.data.id;

    // if there's no id, use contentLocation
    if (!id) {
      id = canvas.externalResource.data.contentLocation;
    }

    return id;
  }

  getCurrentResourceFormat(): string {
    const id: string = this.getCurrentResourceId();
    return id?.substr(id.lastIndexOf(".") + 1).toLowerCase();
  }

  updateNoneAvailable(): void {
    if (!this.$downloadOptions.find("li:visible").length) {
      this.$noneAvailable.show();
    } else {
      // select first option.
      this.$noneAvailable.hide();
    }
  }

  updateTermsOfUseButton(): void {
    const requiredStatement: ILabelValuePair | null = this.extension.helper.getRequiredStatement();

    if (
      Bools.getBool(
        this.extension.data.config.options.termsOfUseEnabled,
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

  getFileExtension(fileUri: string): string | null {
    let extension: string = <string>fileUri.split(".").pop();

    // if it's not a valid file extension
    if (extension.length > 5 || extension.indexOf("/") !== -1) {
      return null;
    }

    return extension;
  }

  isMediaDownloadEnabled(): boolean {
    return this.extension.helper.isUIEnabled("mediaDownload");
  }

  isDownloadOptionAvailable(option: DownloadOption): boolean {
    switch (option) {
      case DownloadOption.ENTIRE_FILE_AS_ORIGINAL:
        return this.isMediaDownloadEnabled();
    }

    return true;
  }

  close(): void {
    super.close();
  }

  resize(): void {
    this.setDockedPosition();
  }
}
