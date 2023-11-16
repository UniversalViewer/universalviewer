import {
  BaseConfig,
  LeftPanelContent,
  LeftPanelOptions,
} from "@/content-handlers/iiif/BaseConfig";

type AlephLeftPanelOptions = LeftPanelOptions & {
  consoleTabEnabled: boolean;
  graphTabEnabled: boolean;
  settingsTabEnabled: boolean;
  srcTabEnabled: boolean;
};

type AlephLeftPanelContent = LeftPanelContent & {
  title: string;
};

type AlephLeftPanel = {
  options: AlephLeftPanelOptions;
  content: AlephLeftPanelContent;
};

type Modules = {
  alephLeftPanel: AlephLeftPanel;
};

export type Config = BaseConfig & {
  modules: Modules;
};
