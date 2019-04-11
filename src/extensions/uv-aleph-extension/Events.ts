export class Events {
    static namespace: string = 'alephExtension.';

    static LOADED: string                             = Events.namespace + 'loaded';
    static DISPLAY_MODE_CHANGED: string               = Events.namespace + 'displayModeChanged';
    static GRAPH_ENABLED_CHANGED: string              = Events.namespace + 'graphEnabledChangedChanged';
    static BOUNDING_BOX_VISIBLE_CHANGED: string       = Events.namespace + 'boundingBoxVisibleChanged';
    static SLICES_INDEX_CHANGED: string               = Events.namespace + 'slicesIndexChanged';
    static ORIENTATION_CHANGED: string                = Events.namespace + 'orientationChanged';
    static SLICES_WINDOW_CENTER_CHANGED: string       = Events.namespace + 'slicesWindowCenterChanged';
    static SLICES_WINDOW_WIDTH_CHANGED: string        = Events.namespace + 'slicesWindowWidthChanged';
    static VOLUME_STEPS_CHANGED: string               = Events.namespace + 'volumeStepsChanged';
    static VOLUME_WINDOW_CENTER_CHANGED: string       = Events.namespace + 'volumeWindowCenterChanged';
    static VOLUME_WINDOW_WIDTH_CHANGED: string        = Events.namespace + 'volumeWindowWidthChanged';
}