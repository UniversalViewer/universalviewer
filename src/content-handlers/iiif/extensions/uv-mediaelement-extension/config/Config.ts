import {
  BaseConfig,
  CenterPanelContent,
  CenterPanelOptions,
  DownloadDialogueContent,
  DownloadDialogueOptions,
  ModuleConfig,
  ShareDialogueContent,
  ShareDialogueOptions,
} from "@/content-handlers/iiif/BaseConfig";

type MediaElementCenterPanelOptions = CenterPanelOptions & {
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

type MediaElementSettingsDialogueOptions = ShareDialogueOptions & {};

type MediaElementSettingsDialogueContent = ShareDialogueContent & {};

type MediaElementSettingsDialogue = ModuleConfig & {
  options: MediaElementSettingsDialogueOptions;
  content: MediaElementSettingsDialogueContent;
};

type Modules = {
  mediaelementCenterPanel: MediaElementCenterPanel;
  downloadDialogue: MediaElementDownloadDialogue;
  shareDialogue: MediaElementShareDialogue;
  settingsDialogue: MediaElementSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
