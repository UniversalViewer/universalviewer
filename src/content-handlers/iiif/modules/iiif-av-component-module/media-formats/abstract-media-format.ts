import { MediaOptions } from "../types/media-options";

export abstract class MediaFormat {
  options: MediaOptions;
  source: string;
  protected constructor(source: string, options: MediaOptions = {}) {
    this.source = source;
    this.options = options;
  }
  attachTo(element: HTMLMediaElement) {
    element.setAttribute("src", this.source);
  }
}
