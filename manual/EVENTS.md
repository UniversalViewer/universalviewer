[&larr; Manual Index](index.md)

<!-- omit in toc -->
# UV Events

- [Core Events](#core-events)
- [YouTube Events](#youtube-events)
- [IIIFEvents](#iiifevents)
- [Extension Events](#extension-events)

## Core Events

- **Source file:** Events.ts
- **Details:** 
  - Events are subscribed to by using `uv.on("event", handler)`.
  - For example, to pass additional configuration data to the UV you can use the 'configure' event:

```
uv = UV.init("uv", data);

uv.on("configure", function({ config, cb }) {
  cb({
    modules: {
      openSeadragonCenterPanel: {
        options: {
          doubleClickAnnotationEnabled: true,
        },
      },
    },
  });
});
```
   
TO DO
Document these with the rest of the documentation.
Simplify and consolidate (EXTERNAL_RESOURCE_OPENED and LOAD).
Add new events developers need.
Add passed information developers need.

<!-- omit in toc -->
### CONFIGURE
- Fired by a ContentHandler (IIIF, YouTube) before setting the config of an Extension.
- Passes an object to the event handler: ({ config, cb }).
- config: the extension's default config
- cb: a callback accepts a Promise&lt;object&gt;. The object is treated as a Config and merged into the loaded config and used to configure the Extension.

<!-- omit in toc -->
### CREATED
- Fired by the YouTubeContentHandler when iframe fires "ready" event.
- Fired by the Extensions of the IIIFContentHandler after the generated elements are added to the DOM and updated (render).
- Passes no data to the event handler.

<!-- omit in toc -->
### DROP
- Fired by the BaseExtension when a manifest is dropped onto the UV.
- Passes the event handler one parameter: (manifestUri)manifestUri: the parsed query parameters from the manifest URI.

<!-- omit in toc -->
### ERROR
- Not fired anywhere in the current code.
- Passes the event hander one parameter: (message)message: string explanation of error.

<!-- omit in toc -->
### EXIT_FULLSCREEN
- Fired by the BaseExtension when the UV switches from full screen to normal view.
- Passes no data to the event handler.

<!-- omit in toc -->
### EXTERNAL_RESOURCE_OPENED
- Fired by center panels (OpenSeadragon, ModelViewer, FileLink, Ebook, et al.) when the content is loaded. May be before displayed. In the case of OpenSeadragon, this is for a page/tile set instead of each individual tile.
- Passes no data to the event handler.

<!-- omit in toc -->
### LOAD
- Seems to be fired at the same time as EXTERNAL_RESOURCE_OPENED in most cases.
- Passes no data to the event handler.

<!-- omit in toc -->
### LOAD
- Fired by the YouTubeContentHander when the video is changed.
- Passes an object to the event handler: `{ player, duration })` .
- player: YT IFrame Player instance.
- duration: duration in seconds (from player.getDuration() ).

<!-- omit in toc -->
### LOAD_FAILED
- Fired by the Auth09 module when access to a manifest is restricted.
- Passes no data to the event handler.

<!-- omit in toc -->
### RELOAD
- Fired by the BaseExtension when application "re-bootstraps the application with new querystring params". .reload() is called when:
- a new manifest is loaded
- a collection is displayed
- a manifest is dropped
- the language is changed
- Passes no data to the event handler.

<!-- omit in toc -->
### RESIZE
- Fired by the BaseExtension when the UV is loaded (LOAD).
- Most resize events are handled by listening to `window.resize` .
- Passes no data to the event handler.

<!-- omit in toc -->
### TOGGLE_FULLSCREEN
- Fired by the FooterPanel when the enter fullscreen or exit fullscreen button is clicked.
- Fired by the media element extension when the browser enters or exits fullscreen mode (e.g. with F11).
- Fired by the BaseExtension when the ESCAPE key is pressed while in fullscreen.
- Passes no data to the event handler.

## YouTube Events

- **Source file:**
  - `content-handlers/youtube/YouTubeEvents.ts`

<!-- omit in toc -->
### Events

- UNSTARTED
- ENDED
- PLAYING
- PAUSED
- BUFFERING
- CUED

## IIIFEvents

- **Source file:**
  - `content-handlers/iiif/IIIFEvents.ts`

<!-- omit in toc -->
### Events

- ACCEPT_TERMS
- ANNOTATION_CANVAS_CHANGE
- ANNOTATION_CHANGE
- ANNOTATIONS_CLEARED
- ANNOTATIONS_EMPTY
- ANNOTATIONS
- BOOKMARK
- CANVAS_INDEX_CHANGE_FAILED
- CANVAS_INDEX_CHANGE
- CLEAR_ANNOTATIONS
- CLICKTHROUGH
- CLOSE_ACTIVE_DIALOGUE
- CLOSE_LEFT_PANEL
- CLOSE_RIGHT_PANEL
- COLLECTION_INDEX_CHANGE
- CREATE
- CURRENT_TIME_CHANGE
- RANGE_TIME_CHANGE
- DOWN_ARROW
- DOWNLOAD
- END
- ESCAPE
- EXTERNAL_LINK_CLICKED
- FEEDBACK
- FIRST
- FORBIDDEN
- GALLERY_DECREASE_SIZE
- GALLERY_INCREASE_SIZE
- GALLERY_THUMB_SELECTED
- HIDE_AUTH_DIALOGUE
- HIDE_CLICKTHROUGH_DIALOGUE
- HIDE_DOWNLOAD_DIALOGUE
- HIDE_EMBED_DIALOGUE
- HIDE_EXTERNALCONTENT_DIALOGUE
- HIDE_GENERIC_DIALOGUE
- HIDE_HELP_DIALOGUE
- HIDE_INFORMATION
- HIDE_LOGIN_DIALOGUE
- HIDE_MULTISELECT_DIALOGUE
- HIDE_OVERLAY
- HIDE_RESTRICTED_DIALOGUE
- HIDE_SETTINGS_DIALOGUE
- HIDE_SHARE_DIALOGUE
- HOME
- LAST
- LEFT_ARROW
- LEFTPANEL_COLLAPSE_FULL_FINISH
- LEFTPANEL_COLLAPSE_FULL_START
- LEFTPANEL_EXPAND_FULL_FINISH
- LEFTPANEL_EXPAND_FULL_START
- LOGIN_FAILED
- LOGIN
- LOGOUT
- MANIFEST_INDEX_CHANGE
- METRIC_CHANGE
- MINUS
- MULTISELECT_CHANGE
- MULTISELECTION_MADE
- NEXT
- NOT_FOUND
- OPEN_EXTERNAL_RESOURCE
- OPEN_LEFT_PANEL
- OPEN_RIGHT_PANEL
- OPEN_THUMBS_VIEW
- OPEN_TREE_VIEW
- OPEN
- PAGE_DOWN
- PAGE_UP
- PAUSE
- PINPOINT_ANNOTATION_CLICKED
- PLUS
- PREV
- RANGE_CHANGE
- REDIRECT
- REFRESH
- RESOURCE_DEGRADED
- RETRY
- RETURN
- RIGHT_ARROW
- RIGHTPANEL_COLLAPSE_FULL_FINISH
- RIGHTPANEL_COLLAPSE_FULL_START
- RIGHTPANEL_EXPAND_FULL_FINISH
- RIGHTPANEL_EXPAND_FULL_START
- SET_ROTATION
- SET_TARGET
- SET_MUTED
- SETTINGS_CHANGE
- SHOW_AUTH_DIALOGUE
- SHOW_CLICKTHROUGH_DIALOGUE
- SHOW_DOWNLOAD_DIALOGUE
- SHOW_EMBED_DIALOGUE
- SHOW_EXTERNALCONTENT_DIALOGUE
- SHOW_GENERIC_DIALOGUE
- SHOW_HELP_DIALOGUE
- SHOW_INFORMATION
- SHOW_LOGIN_DIALOGUE
- SHOW_MESSAGE
- MESSAGE_DISPLAYED
- SHOW_MULTISELECT_DIALOGUE
- SHOW_OVERLAY
- SHOW_RESTRICTED_DIALOGUE
- SHOW_SETTINGS_DIALOGUE
- SHOW_SHARE_DIALOGUE
- SHOW_TERMS_OF_USE
- TARGET_CHANGE
- TOGGLE_RIGHT_PANEL
- TOGGLE_LEFT_PANEL
- THUMB_MULTISELECTED
- THUMB_SELECTED
- TOGGLE_EXPAND_LEFT_PANEL
- TOGGLE_EXPAND_RIGHT_PANEL
- TREE_NODE_MULTISELECTED
- TREE_NODE_SELECTED
- UP_ARROW
- UPDATE_SETTINGS
- VIEW_FULL_TERMS
- WINDOW_UNLOAD
- SHOW_ADJUSTIMAGE_DIALOGUE
- HIDE_ADJUSTIMAGE_DIALOGUE

## Extension Events

- **[OpenSeaDragon](extensions/OSD.md#events)**