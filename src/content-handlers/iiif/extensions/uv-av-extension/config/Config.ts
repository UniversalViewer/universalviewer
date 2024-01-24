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

type AVCenterPanelOptions = CenterPanelOptions & {
  /** Determines if the poster image is expanded */
  posterImageExpanded: boolean;
  /** Determines if media errors are hidden */
  hideMediaError: boolean;
  /** Determines if parent is included in title */
  includeParentInTitleEnabled: boolean;
  /** Field for subtitle metadata */
  subtitleMetadataField: string;
  /** Determines if auto play is enabled */
  autoPlay: boolean;
  /** Determines if fast forward is enabled */
  enableFastForward: boolean;
  /** Determines if fast rewind is enabled */
  enableFastRewind: boolean;
  /** Ratio of the poster image */
  posterImageRatio: number;
  /** Determines if limit is set to range */
  limitToRange: boolean;
  /** Determines if ranges auto advance */
  autoAdvanceRanges: boolean;
};

type AVCenterPanelContent = CenterPanelContent & {
  delimiter: string;
};

type AVCenterPanel = {
  options: AVCenterPanelOptions;
  content: AVCenterPanelContent;
};

type AVDownloadDialogueOptions = DownloadDialogueOptions & {};

type AVDownloadDialogueContent = DownloadDialogueContent & {};

type AVDownloadDialogue = ModuleConfig & {
  options: AVDownloadDialogueOptions;
  content: AVDownloadDialogueContent;
};

type AVShareDialogueOptions = ShareDialogueOptions & {};

type AVShareDialogueContent = ShareDialogueContent & {};

type AVShareDialogue = ModuleConfig & {
  options: AVShareDialogueOptions;
  content: AVShareDialogueContent;
};

type AVSettingsDialogueOptions = SettingsDialogueOptions & {};

type AVSettingsDialogueContent = SettingsDialogueContent & {};

type AVSettingsDialogue = ModuleConfig & {
  options: AVSettingsDialogueOptions;
  content: AVSettingsDialogueContent;
};

type Modules = {
  avCenterPanel: AVCenterPanel;
  downloadDialogue: AVDownloadDialogue;
  shareDialogue: AVShareDialogue;
  settingsDialogue: AVSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
