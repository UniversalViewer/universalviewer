export class Events {
    static namespace: string = 'alephExtension.';

    static BOUNDING_BOX_ENABLED_CHANGED: string       = Events.namespace + 'boundingBoxEnabledChanged';
    static CLEAR_GRAPH: string                        = Events.namespace + 'clearGraph';
    static CONTROLS_TYPE_CHANGED: string              = Events.namespace + 'controlsTypeChanged';
    static DELETE_ANGLE: string                       = Events.namespace + 'deleteAngle';
    static DELETE_EDGE: string                        = Events.namespace + 'deleteEdge';
    static DELETE_NODE: string                        = Events.namespace + 'deleteNode';
    static DISPLAY_MODE_CHANGED: string               = Events.namespace + 'displayModeChanged';
    static GRAPH_ENABLED_CHANGED: string              = Events.namespace + 'graphEnabledChangedChanged';
    static LOADED: string                             = Events.namespace + 'loaded';
    static ORIENTATION_CHANGED: string                = Events.namespace + 'orientationChanged';
    static RECENTER: string                           = Events.namespace + 'recenter';
    static SELECT_NODE: string                        = Events.namespace + 'selectNode';
    static SET_GRAPH: string                          = Events.namespace + 'setGraph';
    static SET_NODE: string                           = Events.namespace + 'setNode';
    static SLICES_INDEX_CHANGED: string               = Events.namespace + 'slicesIndexChanged';
    static SLICES_BRIGHTNESS_CHANGED: string          = Events.namespace + 'slicesBrightnessChanged';
    static SLICES_CONTRAST_CHANGED: string            = Events.namespace + 'slicesWindowWidthChanged';
    static UNITS_CHANGED: string                      = Events.namespace + 'unitsChanged';
    static VIEWER_CHANGED: string                     = Events.namespace + 'viewerChanged';
    static VOLUME_STEPS_CHANGED: string               = Events.namespace + 'volumeStepsChanged';
    static VOLUME_BRIGHTNESS_CHANGED: string          = Events.namespace + 'volumeBrightnessChanged';
    static VOLUME_CONTRAST_CHANGED: string            = Events.namespace + 'volumeContrastChanged';
}