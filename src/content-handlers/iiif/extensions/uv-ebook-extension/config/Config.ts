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
import {
  ExpandPanelContent,
  ExpandPanelOptions,
} from "../../config/ExpandPanel";

type EbookLeftPanelOptions = ExpandPanelOptions & {};

type EbookLeftPanelContent = ExpandPanelContent & {
  title: string;
};

type EbookLeftPanel = {
  options: EbookLeftPanelOptions;
  content: EbookLeftPanelContent;
};

type EbookCenterPanelOptions = CenterPanelOptions & {};

type EbookCenterPanelContent = CenterPanelContent & {};

type EbookCenterPanel = {
  options: EbookCenterPanelOptions;
  content: EbookCenterPanelContent;
};

type EbookDownloadDialogueOptions = DownloadDialogueOptions & {};

type EbookDownloadDialogueContent = DownloadDialogueContent & {};

type EbookDownloadDialogue = ModuleConfig & {
  options: EbookDownloadDialogueOptions;
  content: EbookDownloadDialogueContent;
};

type EbookShareDialogueOptions = ShareDialogueOptions & {};

type EbookShareDialogueContent = ShareDialogueContent & {};

type EbookShareDialogue = ModuleConfig & {
  options: EbookShareDialogueOptions;
  content: EbookShareDialogueContent;
};

type EbookSettingsDialogueOptions = SettingsDialogueOptions & {};

type EbookSettingsDialogueContent = SettingsDialogueContent & {};

type EbookSettingsDialogue = ModuleConfig & {
  options: EbookSettingsDialogueOptions;
  content: EbookSettingsDialogueContent;
};

type Modules = {
  ebookLeftPanel: EbookLeftPanel;
  ebookCenterPanel: EbookCenterPanel;
  downloadDialogue: EbookDownloadDialogue;
  shareDialogue: EbookShareDialogue;
  settingsDialogue: EbookSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
