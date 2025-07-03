# UV Events
TODO
Document these with the rest of the documentation.
Simplify and consolidate (EXTERNAL_RESOURCE_OPENED and LOAD).
Add new events developers need.
Add passed information developers need.

## Descriptions
Events are subscribed to by using uv.on("event", handler) , where uv is an instance returned by UV.init("id", data) . See this example in the embed HTML.

## CONFIGURE
Fired by a ContentHandler (IIIF, YouTube) before setting the config of an Extension.
Passes an object to the event handler: ({ config, cb }).
config: the extension's default config
cb: a callback accepts a Promise<object>. The object is treated as a Config and merged into the loaded config and used to configure the Extension.

## CREATED
Fired by the YouTubeContentHandler when iframe fires "ready" event.
Fired by the Extensions of the IIIFContentHandler after the generated elements are added to the DOM and updated (render).
Passes no data to the event handler.

## DROP
Fired by the BaseExtension when a manifest is dropped onto the UV.
Passes the event handler one parameter: (manifestUri)manifestUri: the parsed query parameters from the manifest URI.

## ERROR
Not fired anywhere in the current code.
Passes the event hander one parameter: (message)message: string explanation of error.

## EXIT_FULLSCREEN
Fired by the BaseExtension when the UV switches from full screen to normal view.
Passes no data to the event handler.

## EXTERNAL_RESOURCE_OPENED
Fired by center panels (OpenSeadragon, ModelViewer, FileLink, Ebook, et al.) when the content is loaded. May be before displayed. In the case of OpenSeadragon, this is for a page/tile set instead of each individual tile.
Passes no data to the event handler.

## LOAD
Seems to be fired at the same time as EXTERNAL_RESOURCE_OPENED in most cases.
Passes no data to the event handler.

## LOAD
Fired by the YouTubeContentHander when the video is changed.
Passes an object to the event handler: `{ player, duration })` .
player: YT IFrame Player instance.
duration: duration in seconds (from player.getDuration() ).

## LOAD_FAILED
Fired by the Auth09 module when access to a manifest is restricted.
Passes no data to the event handler.

## RELOAD
Fired by the BaseExtension when application "re-bootstraps the application with new querystring params". .reload() is called when:
a new manifest is loaded
a collection is displayed
a manifest is dropped
the language is changed
Passes no data to the event handler.

## RESIZE
Fired by the BaseExtension when the UV is loaded (LOAD).
Most resize events are handled by listening to `window.resize` .
Passes no data to the event handler.

## TOGGLE_FULLSCREEN
Fired by the FooterPanel when the enter fullscreen or exit fullscreen button is clicked.
Fired by the media element extension when the browser enters or exits fullscreen mode (e.g. with F11).
Fired by the BaseExtension when the ESCAPE key is pressed while in fullscreen.
Passes no data to the event handler.
