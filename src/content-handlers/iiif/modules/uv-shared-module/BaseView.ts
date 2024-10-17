const $ = require("jquery");
import { Panel } from "./Panel";
import { IExtension } from "./IExtension";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { ModuleConfig } from "../../BaseConfig";

export class BaseView<T extends ModuleConfig> extends Panel {
  config: T;
  content: T["content"];
  extension: IExtension;
  modules: string[];
  options: T["options"];

  constructor(
    $element: JQuery,
    fitToParentWidth?: boolean,
    fitToParentHeight?: boolean
  ) {
    super($element, fitToParentWidth, fitToParentHeight);
  }

  create(): void {
    this.extensionHost = this.$element
      .closest(".uv-iiif-extension-host")
      .data("component");

    // console.log("extensionHost", this.extensionHost);

    super.create();

    this.extension = <IExtension>(
      (<IIIFExtensionHost>this.extensionHost).extension
    );

    this.config = {} as T;
    this.config.content = {} as T["content"];
    this.config.options = {} as T["options"];

    var that = this;

    // build config inheritance chain
    if (that.modules && that.modules.length) {
      that.modules = that.modules.reverse();
      that.modules.forEach((moduleName: string) => {
        that.config = $.extend(
          true,
          that.config,
          that.extension.data.config!.modules[moduleName]
        );
      });
    }

    this.content = this.config.content;
    this.options = this.config.options;
  }

  init(): void {}

  setConfig(moduleName: string): void {
    if (!this.modules) {
      this.modules = [];
    }
    this.modules.push(moduleName);
  }

  resize(): void {
    super.resize();
  }
}
