// const $ = require("jquery");
// import { AnnotationGroup, AnnotationRect } from "@iiif/manifold";
// import { Async, Bools, Dimensions } from "../../Utils";
// import {
//   Canvas,
//   IExternalResource,
//   IExternalImageResourceData,
//   IExternalResourceData,
//   Annotation,
//   AnnotationBody,
//   Service,
// } from "manifesto.js";
import {
  // debounce,
  sanitize,
} from "../../../../Utils";
// import { ViewingDirection } from "@iiif/vocabulary";
// import { IIIFEvents } from "../../IIIFEvents";
// import { XYWHFragment } from "../uv-shared-module/XYWHFragment";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
// import { CroppedImageDimensions } from "../../extensions/uv-openseadragon-extension/CroppedImageDimensions";
// import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
// import { IOpenSeadragonExtensionData } from "../../extensions/uv-openseadragon-extension/IOpenSeadragonExtensionData";
// import OpenSeadragon from "openseadragon";
// import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
// import "@openseadragon-imaging/openseadragon-viewerinputhook";
// import { MediaType } from "@iiif/vocabulary/dist-commonjs";
// import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class OpenSeadragonCenterPanel extends CenterPanel<
  Config["modules"]["openSeadragonCenterPanel"]
> {
  // controlsVisible: boolean = false;
  // currentAnnotationRect: AnnotationRect;
  // currentBounds: XYWHFragment | null;
  // handler: any;
  // initialBounds: XYWHFragment | null;
  // initialRotation: any;
  isCreated: boolean = false;
  // isLoaded: boolean = false;
  // isFirstLoad: boolean = true;
  // items: any[];
  // navigatedFromSearch: boolean = false;
  // nextButtonEnabled: boolean = false;
  // // pages: IExternalResource[];
  // prevButtonEnabled: boolean = false;
  // previousAnnotationRect: AnnotationRect;
  // userData: any;
  // viewer: any;
  // viewerId: string;
  // showAdjustImageButton: boolean;

  // $canvas: JQuery;
  // $goHomeButton: JQuery;
  // $navigator: JQuery;
  // $nextButton: JQuery;
  // $prevButton: JQuery;
  // $rotateButton: JQuery;
  // $spinner: JQuery;
  // $viewer: JQuery;
  // $viewportNavButtonsContainer: JQuery;
  // $viewportNavButtons: JQuery;
  // $zoomInButton: JQuery;
  // $zoomOutButton: JQuery;
  // $adjustImageButton: JQuery;
  // $choiceSwitchButton: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("openSeadragonCenterPanel");

    super.create();
  }

  resize(): void {
    super.resize();

    if (!this.isCreated) return;

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    if (this.extension.helper.isRightToLeft()) {
      this.$title.addClass("rtl");
    } else {
      this.$title.removeClass("rtl");
    }
  }
}
