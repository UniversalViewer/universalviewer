export class Events {
    static namespace: string = 'openseadragonExtension.';

    static CURRENT_VIEW_URI: string                             = Events.namespace + 'currentViewUri';
    static IMAGE_SEARCH: string                                 = Events.namespace + 'imageSearch';
    static MODE_CHANGED: string                                 = Events.namespace + 'modeChanged';
    static NEXT_SEARCH_RESULT: string                           = Events.namespace + 'nextSearchResult';
    static NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE: string        = Events.namespace + 'nextImagesSearchResultUnavailable';
    static PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE: string        = Events.namespace + 'prevImagesSearchResultUnavailable';
    static PAGE_SEARCH: string                                  = Events.namespace + 'pageSearch';
    static PAGING_TOGGLED: string                               = Events.namespace + 'pagingToggled';
    static PREV_SEARCH_RESULT: string                           = Events.namespace + 'prevSearchResult';
    static PRINT: string                                        = Events.namespace + 'print';
    static ROTATE: string                                       = Events.namespace + 'rotate';
    static SEADRAGON_ANIMATION_FINISH: string                   = Events.namespace + 'animationFinish';
    static SEADRAGON_ANIMATION_START: string                    = Events.namespace + 'animationStart';
    static SEADRAGON_ANIMATION: string                          = Events.namespace + 'animation';
    static SEADRAGON_OPEN: string                               = Events.namespace + 'open';
    static SEADRAGON_RESIZE: string                             = Events.namespace + 'resize';
    static SEADRAGON_ROTATION: string                           = Events.namespace + 'rotationChanged';
    static SEARCH_PREVIEW_FINISH: string                        = Events.namespace + 'searchPreviewFinish';
    static SEARCH_PREVIEW_START: string                         = Events.namespace + 'searchPreviewStart';
    static SEARCH: string                                       = Events.namespace + 'search';
    static XYWH_CHANGED: string                                 = Events.namespace + 'xywhChanged';
    static ZOOM_IN: string                                      = Events.namespace + 'zoomIn';
    static ZOOM_OUT: string                                     = Events.namespace + 'zoomOut';
}