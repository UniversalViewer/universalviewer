[&larr; Manual Index](index.md)

# Source Code Structure & Execution Flow

- [Source Code Structure \& Execution Flow](#source-code-structure--execution-flow)
- [1. Entrypoint](#1-entrypoint)
- [2. Initialisation](#2-initialisation)
  - [Resizing](#resizing)
  - [Fullscreen](#fullscreen)
- [3. The UniversalViewer Class](#3-the-universalviewer-class)
- [4. Content Handler \& Extension Creation](#4-content-handler--extension-creation)
  - [Choosing the Content Handler](#choosing-the-content-handler)
  - [Loading the Extension](#loading-the-extension)
  - [Config loading \& localisation](#config-loading--localisation)
  - [4.1 YouTubeContentHandler](#41-youtubecontenthandler)
- [5. Extensions](#5-extensions)
  - [Extension default config](#extension-default-config)
  - [Extension rendering](#extension-rendering)
    - [subscribeAll](#subscribeall)
    - [Extension modules](#extension-modules)


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

# 1. Entrypoint

The entrypoint file [index.ts](https://github.com/UniversalViewer/universalviewer/blob/dev/src/index.ts) loads `shim-jquery` to import jQuery, and puts the `jQuery` and `$` objects in the global namespace `window`.

It then exports the following classes/enums:

1. ContentType
2. Events
3. IIIFEvents
4. YouTubeEvents

and also exports the `URLAdapter` (as `IIIFURLAdapter`), `UniversalViewer` (as `Viewer`) and finally, `init`.
 
# 2. Initialisation

`init` is a function in [Init.ts](https://github.com/UniversalViewer/universalviewer/blob/dev/src/Init.ts) that initialises and embeds the viewer into a target container DOM element, handles resizing, fullscreen toggling, and error handling.

It returns an instance of [UniversalViewer](#3-the-universalviewer-class)

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

It dynamically imports the relevant handler (using Webpack's lazy-loading) from the `ContentHandler: IContentHandlerRegistry` constant and instantiates its `default` export, passing the `IUVOptions`, a `UVAdapter` instance (usually null, may be a `URLAdapter` instance), and any externally registered event handlers.

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
   
# 4. Content Handler & Extension Creation

Content Handlers *extend BaseContentHandler* 

This section will mainly focus on the `IIIFContentHandler` class. 

It also covers the creation and configuration of Extensions, as the code for these is quite tightly coupled.

## Choosing the Content Handler

The constructor calls `_init()`, which in turn calls `set()`, which then (if first load) calls `_reload()`.

After `set()`, `resize()` is called which calls `extension.resize()`.

`_reload()` uses Manifold and Manifesto to parse the manifest, and based on the media type, rendering format, or external resource type found in the IIIF manifest, selects an appropriate UV extension (e.g., OpenSeadragon, PDF, etc.) to load.

## Loading the Extension

The relevant Extension class is dynamically imported and instantiated.

## Config loading & localisation

After the extension is created, `_loadAndApplyConfigToExtension()` is called. 

This first calls the extension's `loadConfig()`function which then calls `translateLocale()` to load the relevant locale file from `src/locales` and replace translation markers with the correct language strings in the extension's [default config](#extension-default-config).

This config is then returned to the Content Handler which then passes it to `configure()` which resolves any configs passed externally via the "**configure**" event and merges them with config, overwriting any existing values.

Finally, in `_createExtension()`:
- the `IIIFContentHandler` is assigned as the extension's `extensionHost`,
- the `data` variable that now contains the full config is set in the extension, accessible via `this.data.config.options|modules`, 
- the Manifesto `Helper` object is set as `helper` in the extension,
- the extension's `create()` function is called

## 4.1 YouTubeContentHandler

TODO: Any differences between this and IIIFContentHandler apart from the obvious (manifest)

# 5. Extensions

## Extension default config

Each extension has its own `./config/config.json` file. This file covers most of the basics required to configure the UV, plus anything relevant as a default for that extension and the modules/components it uses.

A corresponding `./config/Config.ts` file defines the type for the extension in relation to its parent `BaseExtension` class, so entries in the JSON need to match this type definition.

## Extension rendering

The majority of what happens after an extension is created is beyond the scope of this document because it is very specific to that extension, however the following  most relevant code happens in all extensions via their parent `BaseExtension` class:

- `$element` is set by getting the target element from the extension host
- Locales initialised
- Various state classes set on the host e.g. `left-panel-enabled`, `mobile`, `fullscreen` etc.
- Keypress events bound to the host which are `publish()`ed upon activation
- Subscription to top-level IIIF Events
- Assignment of a handler to the host's `subscribeAll` function
- Creation of the `Shell`
- Module creation - `createModules()`

### subscribeAll

The subscribe all function allows for all internal events to be passed outside of the application so that implementations can react to them with their own handlers. For more information see [Events](EVENTS.md)

### Extension modules

Only a few very common dialogue modules are created in `BaseExtension`.

Each extension is responsible for creating the other modules it requires, such as the header, side panels, footer etc. which allows them to control which are displayed for their content type, and also to use extension-specific sub-classed versions.

One module that all extensions use is a center panel, because this contains the viewer needed to display the extension's content.

Each extension has its own center panel sub-class e.g. the PDF extension creates a `PDFCenterPanel`.

For extension-specific information see [Extensions](EXTENSIONS.md)


