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

type AlephSettingsDialogueOptions = SettingsDialogueOptions & {};

type AlephSettingsDialogueContent = SettingsDialogueContent & {};

type AlephSettingsDialogue = ModuleConfig & {
  options: AlephSettingsDialogueOptions;
  content: AlephSettingsDialogueContent;
};

type Modules = {
  leftPanel: AlephLeftPanel;
  centerPanel: AlephCenterPanel;
  downloadDialogue: AlephDownloadDialogue;
  shareDialogue: AlephShareDialogue;
  settingsDialogue: AlephSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
