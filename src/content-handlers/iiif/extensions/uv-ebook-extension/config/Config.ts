import {
  BaseConfig,
  LeftPanelContent,
  LeftPanelOptions,
} from "@/content-handlers/iiif/BaseConfig";

type EbookLeftPanelOptions = LeftPanelOptions & {
  expandFullEnabled: boolean;
  panelAnimationDuration: number;
  panelCollapsedWidth: number;
  panelExpandedWidth: number;
  panelOpen: boolean;
};

type EbookLeftPanelContent = LeftPanelContent & {
  title: string;
};

type EbookLeftPanel = {
  options: EbookLeftPanelOptions;
  content: EbookLeftPanelContent;
};

type Modules = {
  ebookLeftPanel: EbookLeftPanel;
};

export type Config = BaseConfig & {
  modules: Modules;
};
