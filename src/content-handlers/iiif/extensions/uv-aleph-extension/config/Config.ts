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
import {
  ExpandPanelContent,
  ExpandPanelOptions,
} from "../../config/ExpandPanel";

type AlephLeftPanelOptions = ExpandPanelOptions & {
  consoleTabEnabled: boolean;
  graphTabEnabled: boolean;
  settingsTabEnabled: boolean;
  srcTabEnabled: boolean;
};

type AlephLeftPanelContent = ExpandPanelContent & {
  title: string;
};

type AlephLeftPanel = {
  options: AlephLeftPanelOptions;
  content: AlephLeftPanelContent;
};

type AlephCenterPanelOptions = CenterPanelOptions & {};

type AlephCenterPanelContent = CenterPanelContent & {};

type AlephCenterPanel = {
  options: AlephCenterPanelOptions;
  content: AlephCenterPanelContent;
};

type AlephDownloadDialogueOptions = DownloadDialogueOptions & {};

type AlephDownloadDialogueContent = DownloadDialogueContent & {};

type AlephDownloadDialogue = ModuleConfig & {
  options: AlephDownloadDialogueOptions;
  content: AlephDownloadDialogueContent;
};

type AlephShareDialogueOptions = ShareDialogueOptions & {};

type AlephShareDialogueContent = ShareDialogueContent & {};

type AlephShareDialogue = ModuleConfig & {
  options: AlephShareDialogueOptions;
  content: AlephShareDialogueContent;
};

type AlephSettingsDialogueOptions = ShareDialogueOptions & {};

type AlephSettingsDialogueContent = ShareDialogueContent & {};

type AlephSettingsDialogue = ModuleConfig & {
  options: AlephSettingsDialogueOptions;
  content: AlephSettingsDialogueContent;
};

type Modules = {
  alephLeftPanel: AlephLeftPanel;
  alephCenterPanel: AlephCenterPanel;
  downloadDialogue: AlephDownloadDialogue;
  shareDialogue: AlephShareDialogue;
  settingsDialogue: AlephSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
