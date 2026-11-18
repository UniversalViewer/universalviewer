import { MediaOptions } from "../types/media-options";
import { MediaFormat } from "./abstract-media-format";
import { attachHls } from "../../uv-shared-module/StreamingLibraries";

export class HlsFormat extends MediaFormat {
  constructor(source: string, options: MediaOptions = {}) {
    super(source, options);
  }

  attachTo(element: HTMLMediaElement) {
    attachHls(element, this.source, this.options.adaptiveAuthEnabled);
  }
}
