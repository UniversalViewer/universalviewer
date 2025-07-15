# Source Code Structure & Execution Flow

- [Source Code Structure \& Execution Flow](#source-code-structure--execution-flow)
- [1. Entrypoint - index.ts](#1-entrypoint---indexts)
- [2. Initialisation - init.ts](#2-initialisation---initts)
  - [Resizing](#resizing)
  - [Fullscreen](#fullscreen)
- [3. The UniversalViewer Class](#3-the-universalviewer-class)
- [4. Content Handler \& Extension](#4-content-handler--extension)
  - [Choosing the Content Handler](#choosing-the-content-handler)
  - [Loading the Extension](#loading-the-extension)
  - [4.1 YouTubeContentHandler](#41-youtubecontenthandler)
- [5. Extensions](#5-extensions)
  - [Extension default config](#extension-default-config)
  - [Config loading \& localisation](#config-loading--localisation)
    - [2.5 The Event System](#25-the-event-system)
      - [2.3.1 External Events](#231-external-events)
      - [2.3.2 Internal Events](#232-internal-events)
        - [2.3.2.1 YouTubeEvents](#2321-youtubeevents)
        - [2.3.2.2 IIIFEvents](#2322-iiifevents)
  - [3. Extensions](#3-extensions)


The following makes the assumption that your implementation of the viewer matches the example HTML file i.e. UV loaded via `<script>` and `UV.init(<targetElementId>, { configJSON })` is called, with config coming from plain JSON, the URL Adapter, and/or callback(s) via the "configure" event.

```
<script>
  var urlAdapter = new UV.IIIFURLAdapter(true);

  const data = urlAdapter.getInitialData({
    embedded: true,
  });

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
</script>
```
# 1. Entrypoint - index.ts

The entrypoint file `index.ts` loads `shim-jquery` to import jQuery, and puts the `jQuery` and `$` objects in the global namespace `window`.

It then exports the following classes/enums:

1. ContentType
2. Events
3. IIIFEvents
4. YouTubeEvents

and also exports the `URLAdapater` (as `IIIFURLAdapter`), `UniversalViewer` (as `Viewer`) and finally, `init`.
 
# 2. Initialisation - init.ts

Init is a function in `init.ts` that initialises and embeds the viewer into a target container DOM element, handles resizing, fullscreen toggling, and error handling.

It returns an instance of [UniversalViewer](#universalviewer)

`init = (el: string | HTMLDivElement, data)`

If `el` is a string it will be assumed to be the `id` attribute of the element the viewer will be contained in.

This element is then emptied and pair of parent/child `div`s are added with the inner one being the `uvDiv` that the viewer loads in:

`el > div (parent) > div (uvDiv)`

This structure is required for fullscreen functionality to work in Safari browsers.

A new UniversalViewer instance is then created with `uvDiv` and `data` as args passed as a JSON object matching the `IUVOptions` type.

## Resizing

A resize function is defined that changes the width and height of `div (parent)` to match either the container (`el`) or `window` if the viewer is fullscreen.

This function is assigned as the handler for the standard `resize` and `orientationchange` events on `window` and is also called when handling the following from the `Events` enum:

- **CREATED**: Triggers a resize once the viewer is initialized.
- **EXTERNAL_RESOURCE_OPENED**: Resizes 100ms after resources are opened.
- **TOGGLE_FULLSCREEN**: A delayed resize is called after handling fullscreen events.

## Fullscreen

Handler functions are defined and bound to standard fullscreen events depending on the specific browser being used.

# 3. The UniversalViewer Class

*extends BaseContentHandler*

The UniversalViewer class is primarily responsible for determining the content type to be viewed and creating the relevant Content Handler class.

Currently the following content handlers exist:

- IIIFContentHandler
- YouTubeContentHandler

It dynamically imports the relevant handler (using Webpack's lazy-loading) from the `ContentHandler: IContentHandlerRegistry` constant and instantiates its `default` export, passing the `IUVOptions`, a `UVAdapter` instance (usually null, may be a `URLAdapater` instance), and any externally registered event handlers.

These external handlers are set via the `on()` function, e.g.

```
const configUrl = urlAdapter.get('config');
if (configUrl) {
  uv.on("configure", function({ config, cb }) {
    cb(
      new Promise(function (resolve) {
        fetch(configUrl).then(function (response) {
          resolve(response.json());
        });
      });
    );
  })
}
```

It also provides access to the following public functions. Calls to these functions are passed along to the equivalent function in the assigned Content Handler.

- exitFullScreen
- resize
- dispose
- set: one of two paths
  1. Content type has changed - creates a new handler
  2. Content type is the same - calls `set()` on the Content Handler
   
# 4. Content Handler & Extension

Content Handlers *extend BaseContentHandler* 

This section will mainly focus on the `IIIFContentHandler` class. 

It also covers the creation and configuration of Extensions, as the code for these is quite tightly coupled.

## Choosing the Content Handler

The constructor calls `_init()`, which in turn calls `set()`, which then (if first load) calls `_reload()`.

After `set()`, `resize()` is called which calls `extension.resize()`.

`_reload()` uses Manifold and Manifesto to parse the manifest, and based on the media type, rendering format, or external resource type found in the IIIF manifest, selects an appropriate UV extension (e.g., OpenSeadragon, PDF, etc.) to load.

## Loading the Extension

The relevant Extension class is dynamically imported and instantiated.

## 4.1 YouTubeContentHandler

TODO: Any differences between this and IIIFContentHandler apart from the obvious (manifest)

# 5. Extensions

## Extension default config

Each extension has its own `./config/config.json` file. These configs cover most of the basics required to configure the UV, plus anything relevant as a default for that extension and the modules/components it uses.

## Config loading & localisation

After the extension is created, `_loadAndApplyConfigToExtension()` is called. 

This first calls `BaseExtension#loadConfig()` which then calls `BaseExtension#translateLocale()` to load the relevant locale file from `src/locales` and replace translation markers with the correct language strings in the extension's default config.

This config is then returned to the Content Handler which then passes it to `BaseExtension#configure()` which resolves any configs passed externally via the "**configure**" event and merges them with config, overwriting any existing values.

Finally, in `_createExtension`, the `IIIFContentHandler` is assigned as the extension's `extensionHost`, the `data` variable that now contains the full config is set in the extension, as is the Manifesto `Helper` object.

Config is now available in the extension as `this.data.config.options|modules`.



### 2.5 The Event System

For a full list of events and how the events system functions, see [EVENTS.md](EVENTS.md)

#### 2.3.1 External Events

<!-- - CONFIGURE
- CREATED
- DROP
- ERROR
- EXIT_FULLSCREEN
- EXTERNAL_RESOURCE_OPENED
- LOAD
- LOAD_FAILED
- RELOAD
- RESIZE
- TOGGLE_FULLSCREEN -->

#### 2.3.2 Internal Events

##### 2.3.2.1 YouTubeEvents

<!--  -->

##### 2.3.2.2 IIIFEvents

## 3. [Extensions](EXTENSIONS.md)