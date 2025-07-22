[&larr; Manual Index](../index.md) &nbsp;&nbsp; [&uarr; Extensions Index](index.md)

# OpenSeadragon Extension

TODO: Document how the OSD extension works, in particular how it functions with regards to interacting with the OSD library, searching & annotations, the gallery & tree modules, events, and anything else relevant. 

## Events

TODO: Which 'outer' events OSD hooks into. OSD specific events and when they are fired, and with what data.

All OpenSeadragon events are namespaced with `openseadragonExtension.`

- CURRENT_VIEW_URI
  - **Key:** `currentViewUri`
  - **Details:**
    - Fired as part of `OPENSEADRAGON_ANIMATION_FINISH` handler.
  - **Callback args:** 
      - cropUri
      - fullUri
- DOUBLECLICK
- IMAGE_SEARCH
- MODE_CHANGE
- NEXT_SEARCH_RESULT
- NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE
- PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE
- PAGE_SEARCH
- PAGING_TOGGLED
- PREV_SEARCH_RESULT
- PRINT
- ROTATE
- OPENSEADRAGON_ANIMATION_FINISH
- OPENSEADRAGON_ANIMATION_START
- OPENSEADRAGON_ANIMATION
- OPENSEADRAGON_OPEN
- OPENSEADRAGON_RESIZE
- OPENSEADRAGON_ROTATION
- SEARCH_PREVIEW_FINISH
- SEARCH_PREVIEW_START
- SEARCH
- XYWH_CHANGE
- ZOOM_IN
- ZOOM_OUT