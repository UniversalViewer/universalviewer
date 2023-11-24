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
  posterImageExpanded: boolean;
  hideMediaError: boolean;
  includeParentInTitleEnabled: boolean;
  subtitleMetadataField: string;
  autoPlay: boolean;
  enableFastForward: boolean;
  enableFastRewind: boolean;
  posterImageRatio: number;
  limitToRange: boolean;
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
