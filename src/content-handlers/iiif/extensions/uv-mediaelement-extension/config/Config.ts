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
};

type MediaElementCenterPanelContent = CenterPanelContent & {};

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
