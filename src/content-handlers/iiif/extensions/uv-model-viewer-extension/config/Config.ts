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

type ModelViewerCenterPanelOptions = CenterPanelOptions & {
  /** Determines if auto rotation is enabled */
  autoRotateEnabled: boolean;
  /** Delay in camera change */
  cameraChangeDelay: number;
  /** Determines if double click annotation is enabled */
  doubleClickAnnotationEnabled: boolean;
  /** Determines if interaction prompt is enabled */
  interactionPromptEnabled: boolean;
};

type ModelViewerCenterPanelContent = CenterPanelContent & {};

type ModelViewerCenterPanel = {
  options: ModelViewerCenterPanelOptions;
  content: ModelViewerCenterPanelContent;
};

type ModelViewerDownloadDialogueOptions = DownloadDialogueOptions & {};

type ModelViewerDownloadDialogueContent = DownloadDialogueContent & {};

type ModelViewerDownloadDialogue = ModuleConfig & {
  options: ModelViewerDownloadDialogueOptions;
  content: ModelViewerDownloadDialogueContent;
};

type ModelViewerShareDialogueOptions = ShareDialogueOptions & {};

type ModelViewerShareDialogueContent = ShareDialogueContent & {};

type ModelViewerShareDialogue = ModuleConfig & {
  options: ModelViewerShareDialogueOptions;
  content: ModelViewerShareDialogueContent;
};

type ModelViewerSettingsDialogueOptions = SettingsDialogueOptions & {};

type ModelViewerSettingsDialogueContent = SettingsDialogueContent & {};

type ModelViewerSettingsDialogue = ModuleConfig & {
  options: ModelViewerSettingsDialogueOptions;
  content: ModelViewerSettingsDialogueContent;
};

type Modules = {
  modelViewerCenterPanel: ModelViewerCenterPanel;
  downloadDialogue: ModelViewerDownloadDialogue;
  shareDialogue: ModelViewerShareDialogue;
  settingsDialogue: ModelViewerSettingsDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
