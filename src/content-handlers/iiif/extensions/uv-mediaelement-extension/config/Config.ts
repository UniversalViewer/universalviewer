import { CaptionsContent } from "../../../modules/uv-captions-module/CaptionsControl";
import { CaptionStyle } from "../../../modules/uv-captions-module/CaptionStyle";
import {
  BaseConfig,
  CenterPanelContent,
  CenterPanelOptions,
  DownloadDialogueContent,
  DownloadDialogueOptions,
  ModuleConfig,
  SettingsDialogueContent,
  SettingsDialogueOptions,
  ShareDialogueContent,
  ShareDialogueOptions,
} from "@/content-handlers/iiif/BaseConfig";

type MediaElementCenterPanelOptions = CenterPanelOptions & {
  autoPlayOnSetTarget: boolean;
  defaultHeight: number;
  defaultWidth: number;
  iconSprite: string;
  /** Determines if media errors are hidden */
  hideMediaError: boolean;
  /** Determines if the volume controls are left out on Android and iOS */
  hideVolumeOnTouchDevices: boolean;
  /** The colours offered for captions, in place of UV's own */
  captionStyles?: CaptionStyle[];
};

type MediaElementCenterPanelContent = CenterPanelContent &
  CaptionsContent & {
    mediaUnavailable: string;
    /** Added to mediaUnavailable when a stream's server sends no CORS headers, in a browser without its own HLS player */
    mediaBlockedByCors: string;
    audioVolume: string;
    fullScreen: string;
    mute: string;
    pause: string;
    play: string;
    playbackPosition: string;
    positionOfDuration: string;
    unmute: string;
  };

type MediaElementCenterPanel = {
  options: MediaElementCenterPanelOptions;
  content: MediaElementCenterPanelContent;
};

type MediaElementDownloadDialogueOptions = DownloadDialogueOptions & {};

type MediaElementDownloadDialogueContent = DownloadDialogueContent & {};

type MediaElementDownloadDialogue = ModuleConfig & {
  options: MediaElementDownloadDialogueOptions;
  content: MediaElementDownloadDialogueContent;
};

type MediaElementShareDialogueOptions = ShareDialogueOptions & {};

type MediaElementShareDialogueContent = ShareDialogueContent & {};

type MediaElementShareDialogue = ModuleConfig & {
  options: MediaElementShareDialogueOptions;
  content: MediaElementShareDialogueContent;
};

type MediaElementSettingsDialogueOptions = SettingsDialogueOptions & {};

type MediaElementSettingsDialogueContent = SettingsDialogueContent & {};

type MediaElementSettingsDialogue = ModuleConfig & {
  options: MediaElementSettingsDialogueOptions;
  content: MediaElementSettingsDialogueContent;
};

type Modules = {
  mediaElementCenterPanel: MediaElementCenterPanel;
  downloadDialogue: MediaElementDownloadDialogue;
  shareDialogue: MediaElementShareDialogue;
  settingsDialogue: MediaElementSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
