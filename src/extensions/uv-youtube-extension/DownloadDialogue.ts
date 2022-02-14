import { DownloadDialogue as BaseDownloadDialogue } from "../../modules/uv-dialogues-module/DownloadDialogue";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { Canvas } from "manifesto.js";

export class DownloadDialogue extends BaseDownloadDialogue {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("downloadDialogue");

    super.create();
  }

  open(triggerButton: HTMLElement) {
    super.open(triggerButton);

    this.addEntireFileDownloadOptions();
    this.updateNoneAvailable();

    // Download option for text representation
    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const content = canvas.getContent();
    for (const annotation of content) {
      const body = annotation.getBody();
      for (const item of body) {
        const format = item.getFormat();
        if (
          format &&
          (format.toString() === "text/plain" ||
            format.toString() === "text/vtt")
        ) {
          this.addEntireFileDownloadOption(
            item.id,
            item.getDefaultLabel() ||
              `Download as text ${
                item.__jsonld.language ? `(${item.__jsonld.language})` : ""
              }`,
            format.toString()
          );
        }
      }
    }

    this.resize();
  }

  isDownloadOptionAvailable(option: DownloadOption): boolean {
    return super.isDownloadOptionAvailable(option);
  }
}
