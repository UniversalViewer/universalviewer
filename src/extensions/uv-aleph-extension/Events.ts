export class Events {
  static namespace: string = "alephExtension.";

  static BOUNDING_BOX_ENABLED_CHANGE: string =
    Events.namespace + "boundingBoxEnabledChange";
  static CLEAR_GRAPH: string = Events.namespace + "clearGraph";
  static CONTROLS_TYPE_CHANGE: string = Events.namespace + "controlsTypeChange";
  static DELETE_ANGLE: string = Events.namespace + "deleteAngle";
  static DELETE_EDGE: string = Events.namespace + "deleteEdge";
  static DELETE_NODE: string = Events.namespace + "deleteNode";
  static DISPLAY_MODE_CHANGE: string = Events.namespace + "displayModeChange";
  static GRAPH_ENABLED_CHANGE: string =
    Events.namespace + "graphEnabledChangedChange";
  static LOADED: string = Events.namespace + "loaded";
  static ORIENTATION_CHANGE: string = Events.namespace + "orientationChange";
  static RECENTER: string = Events.namespace + "recenter";
  static SELECT_NODE: string = Events.namespace + "selectNode";
  static SET_GRAPH: string = Events.namespace + "setGraph";
  static SET_NODE: string = Events.namespace + "setNode";
  static SLICES_INDEX_CHANGE: string = Events.namespace + "slicesIndexChange";
  static SLICES_BRIGHTNESS_CHANGE: string =
    Events.namespace + "slicesBrightnessChange";
  static SLICES_CONTRAST_CHANGE: string =
    Events.namespace + "slicesWindowWidthChange";
  static UNITS_CHANGE: string = Events.namespace + "unitsChange";
  static VIEWER_CHANGE: string = Events.namespace + "viewerChange";
  static VOLUME_STEPS_CHANGE: string = Events.namespace + "volumeStepsChange";
  static VOLUME_BRIGHTNESS_CHANGE: string =
    Events.namespace + "volumeBrightnessChange";
  static VOLUME_CONTRAST_CHANGE: string =
    Events.namespace + "volumeContrastChange";
}
