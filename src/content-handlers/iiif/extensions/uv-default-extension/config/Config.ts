import {
  BaseConfig,
  LeftPanelContent,
  LeftPanelOptions,
} from "@/content-handlers/iiif/BaseConfig";

type ResourcesLeftPanelOptions = LeftPanelOptions & {
  expandFullEnabled: boolean;
  panelAnimationDuration: number;
  panelCollapsedWidth: number;
  panelExpandedWidth: number;
  panelOpen: boolean;
  twoColThumbWidth: number;
  twoColThumbHeight: number;
  oneColThumbWidth: number;
  oneColThumbHeight: number;
};

type ResourcesLeftPanelContent = LeftPanelContent & {
  title: string;
};

type ResourcesLeftPanel = {
  options: ResourcesLeftPanelOptions;
  content: ResourcesLeftPanelContent;
};

type Modules = {
  resourcesLeftPanel: ResourcesLeftPanel;
};

export type Config = BaseConfig & {
  modules: Modules;
};
