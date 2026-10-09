import { CaptionsContent } from "../../uv-captions-module/CaptionsControl";

export interface IAVComponentContent extends CaptionsContent {
  audioVolume: string;
  playbackPosition: string;
  // e.g. "{0} of {1}": the time played, of the duration.
  positionOfDuration: string;
  currentTime: string;
  collapse: string;
  duration: string;
  expand: string;
  mute: string;
  next: string;
  pause: string;
  play: string;
  previous: string;
  unmute: string;
  fastForward: string;
  fastRewind: string;
  noMediaMessage?: string;
  mediaUnavailable: string;
}
