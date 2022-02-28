export class OpenSeadragonExtensionEvents {
  static namespace: string = "openseadragonExtension.";

  static CURRENT_VIEW_URI: string =
    OpenSeadragonExtensionEvents.namespace + "currentViewUri";
  static DOUBLECLICK: string =
    OpenSeadragonExtensionEvents.namespace + "doubleClick";
  static IMAGE_SEARCH: string =
    OpenSeadragonExtensionEvents.namespace + "imageSearch";
  static MODE_CHANGE: string =
    OpenSeadragonExtensionEvents.namespace + "modeChange";
  static NEXT_SEARCH_RESULT: string =
    OpenSeadragonExtensionEvents.namespace + "nextSearchResult";
  static NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE: string =
    OpenSeadragonExtensionEvents.namespace +
    "nextImagesSearchResultUnavailable";
  static PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE: string =
    OpenSeadragonExtensionEvents.namespace +
    "prevImagesSearchResultUnavailable";
  static PAGE_SEARCH: string =
    OpenSeadragonExtensionEvents.namespace + "pageSearch";
  static PAGING_TOGGLED: string =
    OpenSeadragonExtensionEvents.namespace + "pagingToggled";
  static PREV_SEARCH_RESULT: string =
    OpenSeadragonExtensionEvents.namespace + "prevSearchResult";
  static PRINT: string = OpenSeadragonExtensionEvents.namespace + "print";
  static ROTATE: string = OpenSeadragonExtensionEvents.namespace + "rotate";
  static OPENSEADRAGON_ANIMATION_FINISH: string =
    OpenSeadragonExtensionEvents.namespace + "animationFinish";
  static OPENSEADRAGON_ANIMATION_START: string =
    OpenSeadragonExtensionEvents.namespace + "animationStart";
  static OPENSEADRAGON_ANIMATION: string =
    OpenSeadragonExtensionEvents.namespace + "animation";
  static OPENSEADRAGON_OPEN: string =
    OpenSeadragonExtensionEvents.namespace + "open";
  static OPENSEADRAGON_RESIZE: string =
    OpenSeadragonExtensionEvents.namespace + "resize";
  static OPENSEADRAGON_ROTATION: string =
    OpenSeadragonExtensionEvents.namespace + "rotationChange";
  static SEARCH_PREVIEW_FINISH: string =
    OpenSeadragonExtensionEvents.namespace + "searchPreviewFinish";
  static SEARCH_PREVIEW_START: string =
    OpenSeadragonExtensionEvents.namespace + "searchPreviewStart";
  static SEARCH: string = OpenSeadragonExtensionEvents.namespace + "search";
  static XYWH_CHANGE: string =
    OpenSeadragonExtensionEvents.namespace + "xywhChange";
  static ZOOM_IN: string = OpenSeadragonExtensionEvents.namespace + "zoomIn";
  static ZOOM_OUT: string = OpenSeadragonExtensionEvents.namespace + "zoomOut";
}
