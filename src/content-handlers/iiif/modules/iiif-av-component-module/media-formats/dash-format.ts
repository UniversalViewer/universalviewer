import { MediaOptions } from "../types/media-options";
import { MediaFormat } from "./abstract-media-format";

export class DashFormat extends MediaFormat {
  player: any;
  constructor(source: string, options: MediaOptions = {}) {
    super(source, options);
    this.player = dashjs.MediaPlayer().create();
    this.player.getDebug().setLogToBrowserConsole(false);
    if (options.adaptiveAuthEnabled) {
      this.player.setXHRWithCredentialsForType("MPD", true); // send cookies
    }
  }
  attachTo(element: HTMLMediaElement) {
    this.player.initialize(element, this.source, false);
  }
  debug() {
    this.player.getDebug().setLogToBrowserConsole(true);
    this.player.getDebug().setLogLevel(4);
  }
}
