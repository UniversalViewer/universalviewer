export class AlephExtensionEvents {
  static namespace: string = "alephExtension.";

  static BOUNDING_BOX_ENABLED_CHANGE: string =
    AlephExtensionEvents.namespace + "boundingBoxEnabledChange";
  static CLEAR_GRAPH: string = AlephExtensionEvents.namespace + "clearGraph";
  static CONTROLS_TYPE_CHANGE: string =
    AlephExtensionEvents.namespace + "controlsTypeChange";
  static DELETE_ANGLE: string = AlephExtensionEvents.namespace + "deleteAngle";
  static DELETE_EDGE: string = AlephExtensionEvents.namespace + "deleteEdge";
  static DELETE_NODE: string = AlephExtensionEvents.namespace + "deleteNode";
  static DISPLAY_MODE_CHANGE: string =
    AlephExtensionEvents.namespace + "displayModeChange";
  static GRAPH_ENABLED_CHANGE: string =
    AlephExtensionEvents.namespace + "graphEnabledChangedChange";
  static LOADED: string = AlephExtensionEvents.namespace + "loaded";
  static ORIENTATION_CHANGE: string =
    AlephExtensionEvents.namespace + "orientationChange";
  static RECENTER: string = AlephExtensionEvents.namespace + "recenter";
  static SELECT_NODE: string = AlephExtensionEvents.namespace + "selectNode";
  static SET_GRAPH: string = AlephExtensionEvents.namespace + "setGraph";
  static SET_NODE: string = AlephExtensionEvents.namespace + "setNode";
  static SLICES_INDEX_CHANGE: string =
    AlephExtensionEvents.namespace + "slicesIndexChange";
  static SLICES_BRIGHTNESS_CHANGE: string =
    AlephExtensionEvents.namespace + "slicesBrightnessChange";
  static SLICES_CONTRAST_CHANGE: string =
    AlephExtensionEvents.namespace + "slicesWindowWidthChange";
  static UNITS_CHANGE: string = AlephExtensionEvents.namespace + "unitsChange";
  static VIEWER_CHANGE: string =
    AlephExtensionEvents.namespace + "viewerChange";
  static VOLUME_STEPS_CHANGE: string =
    AlephExtensionEvents.namespace + "volumeStepsChange";
  static VOLUME_BRIGHTNESS_CHANGE: string =
    AlephExtensionEvents.namespace + "volumeBrightnessChange";
  static VOLUME_CONTRAST_CHANGE: string =
    AlephExtensionEvents.namespace + "volumeContrastChange";
}
