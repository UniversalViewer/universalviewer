import { MediaOptions } from "../types/media-options";
import { MediaFormat } from "./abstract-media-format";

export class MpegFormat extends MediaFormat {
  constructor(source: string, options: MediaOptions = {}) {
    super(source, options);
  }
  attachTo(element: HTMLMediaElement) {
    element.src = this.source;
  }
}
