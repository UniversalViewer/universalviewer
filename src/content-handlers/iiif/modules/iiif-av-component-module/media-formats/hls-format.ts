import { MediaOptions } from "../types/media-options";
import { MediaFormat } from "./abstract-media-format";
import { getHls } from "../helpers/get-hls";

export class HlsFormat extends MediaFormat {
  hls: any;
  constructor(source: string, options: MediaOptions = {}) {
    super(source, options);

    const Hls = getHls();

    if (Hls) {
      if (options.adaptiveAuthEnabled) {
        this.hls = new Hls({
          xhrSetup: (xhr: any) => {
            xhr.withCredentials = true; // send cookies
          },
        });
      } else {
        this.hls = new Hls();
      }
      this.hls.loadSource(this.source);
    }
  }

  attachTo(element: HTMLMediaElement) {
    if (this.hls) {
      this.hls.attachMedia(element);
    }
  }
}
