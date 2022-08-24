const $ = window.$;
import { Panel } from "./Panel";
import { IExtension } from "./IExtension";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";

export class BaseView extends Panel {
  config: any;
  content: any;
  extension: IExtension;
  modules: string[];
  options: any;

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

    this.config = {};
    this.config.content = {};
    this.config.options = {};

    var that = this;

    // build config inheritance chain
    if (that.modules && that.modules.length) {
      that.modules = that.modules.reverse();
      that.modules.forEach((moduleName: string) => {
        that.config = $.extend(
          true,
          that.config,
          that.extension.data.config.modules[moduleName]
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
