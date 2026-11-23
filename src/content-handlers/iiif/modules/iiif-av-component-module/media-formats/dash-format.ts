import { MediaOptions } from "../types/media-options";
import { MediaFormat } from "./abstract-media-format";
import { attachDash } from "../../uv-shared-module/StreamingLibraries";

export class DashFormat extends MediaFormat {
  constructor(source: string, options: MediaOptions = {}) {
    super(source, options);
  }

  attachTo(element: HTMLMediaElement) {
    attachDash(element, this.source, this.options.adaptiveAuthEnabled);
  }
}
