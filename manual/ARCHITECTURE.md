<!-- Notes:

In IIIFContentHandler:153 Events.CREATED is given a handler, but it appears to never be called via the on/fire mechanism. In fact it's called through the PubSub system's subscribeAll which is set up in BaseExtension:274 to basically try and handle any internal event (PubSub) if an external handler has been provided for it e.g.

```
uv.on("openseadragonExtension.animationFinish", function (someArg) {
    console.log("Handling openseadragonExtension.animationFinish with someArg", someArg);
});
```

Sometimes events are also 'pushed' outside by having .fire called inside an extension. This calls fire() function in BaseExtension which in turns calls it in the Extension Host aka BaseContentHandler which has access to the events array set by its on() function. -->

<!-- omit in toc -->
# Architectural Overview of the Universal Viewer

- [1. Major Architectural Components](#1-major-architectural-components)
  - [1.1 Core: `UniversalViewer`](#11-core-universalviewer)
  - [1.2 Content Handling: `BaseContentHandler`](#12-content-handling-basecontenthandler)
    - [1.2.1 `YouTubeContentHandler`](#121-youtubecontenthandler)
    - [1.2.2 `IIIFContentHandler`](#122-iiifcontenthandler)
  - [1.3 Content Extensions](#13-content-extensions)
    - [1.3.1 `BaseExtension`](#131-baseextension)
    - [1.3.2 Content Specific `Extension`](#132-content-specific-extension)
  - [1.4 Modules / UI Panels / Dialogues](#14-modules--ui-panels--dialogues)
    - [1.4.1 Dialogues](#141-dialogues)
  - [1.5 Event Handling](#15-event-handling)
    - [1.5.1 External Events](#151-external-events)
    - [1.5.2 Internal Events](#152-internal-events)
  - [1.6 Localisation](#16-localisation)
- [2. Source Code Structure \& Execution Flow](#2-source-code-structure--execution-flow)
  - [2.1 Entry](#21-entry)
  - [2.2 Initialisation](#22-initialisation)
    - [Resizing](#resizing)
    - [Fullscreen](#fullscreen)
  - [2.3 UniversalViewer](#23-universalviewer)
  - [2.4 Content Handler \& Extension](#24-content-handler--extension)
    - [2.4.1 Choosing the Content Handler](#241-choosing-the-content-handler)
    - [2.4.2 Loading the Extension](#242-loading-the-extension)
      - [2.4.2.1 Extension default config](#2421-extension-default-config)
    - [2.4.3 Config loading \& localisation](#243-config-loading--localisation)
    - [2.4.4 YouTubeContentHandler](#244-youtubecontenthandler)
  - [2.5 The Event System](#25-the-event-system)
    - [2.3.1 External Events](#231-external-events)
    - [2.3.2 Internal Events](#232-internal-events)
      - [2.3.2.1 YouTubeEvents](#2321-youtubeevents)
      - [2.3.2.2 IIIFEvents](#2322-iiifevents)
- [3. Extensions](#3-extensions)

<!-- omit in toc -->
## High-Level Summary

The Universal Viewer (UV) is designed to facilitate the presentation of diverse multimedia content types (images, videos, PDFs, IIIF manifests, etc.). Its architecture emphasizes support for multiple content handlers.

The core system is built around a central `UniversalViewer` class orchestrating content handling, user interface panels, and external resource interactions.

## 1. Major Architectural Components

### 1.1 Core: `UniversalViewer`

- **Role:** Core class for the entire system.
- **Responsibilities:**
  - Determining content type and loading the appropriate `ContentHandler`.
  - Handles global events, including resizing and full-screen toggle.
  - Provides an API for assigning external event handlers.
  - Provides an API for setting content of, resizing of, and disposing of, the `assignedContentHandler`.
- **Details:**
  - Extends `BaseContentHandler`, inheriting event management and lifecycle.
  - Receives `target` HTMLElement and configuration `data` from the `init` function

### 1.2 Content Handling: `BaseContentHandler`

- **Role:** Abstract class for loading the content handler and firing external events.
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Handle content lifecycle: set, resize, dispose.
  - Communicate with the core container via events (`Events`, `IIIFEvents`, `YouTubeEvents`, extension-specific events).

#### 1.2.1 `YouTubeContentHandler`

- **Role:** Loads a YouTube player iframe.
- **Responsibilities:**
  - Load the YouTube iframe API script if not already present.
  - Provide the `onYouTubeIframeAPIReady` function to:
    - Create the player instance.
    - Handle player events and fire the relevant `YouTubeEvents` event.
  - Provide YouTube player specific implementations of `resize` and `dispose`.

#### 1.2.2 `IIIFContentHandler`

- **Role:** Parse the IIIF manifest and load & configure the correct Content Extension
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Provide PubSub pattern for event handling.
  - Create and configure the required Extension.
- **Details:**
  - Assigns itself to the Extension as `extensionHost`.
  - Provides `publish` and `subscribe` API functions to give Extensions access to PubSub.

### 1.3 Content Extensions

#### 1.3.1 `BaseExtension`

- **Role:** Abstract Extension class.
- **Responsibilities:**
  - Locale loading and replacement of locale string in default config.
  - Setup of general events e.g. arrow key presses.
  - Creation of Shell and common Modules

#### 1.3.2 Content Specific `Extension`

- **Role:** Content-type specific implementation of a 'Viewer'
- **Responsibilities:**
  - Load and display specific content types.
  - Manage content-specific UI and controls.
  - Provision of events to interact with content viewer.

### 1.4 Modules / UI Panels / Dialogues

- **Role:** Provide interface elements related to displayed content or UV settings.
- **Panel types:**
  - UV Shared Panels.
  - Header, Footer, Left, Right, Center main layout panels.
  - Extension-specific panels.
- **Center Panel:**
  - Key panel, contains content viewer. 
  - Each extension has an implementation specific version.
- **Details:**
  - `Shell` class creates panel containers and the dialogue container (named 'overlays') and adds them to the `target` element.

#### 1.4.1 Dialogues

- **Role:** Provide pop-up dialogue boxes (a.k.a. 'overlays') in the UI displaying various features and information
- **Dialogue types:**
  - genericDialogue: displays messages e.g. the authorisation failed message
  - adjustImage: shows image adjustment settings: contrast, brightness, saturation
  - auth: redirects user to an external auth page, e.g. this manifest: https://iiifauth.digtest.co.uk/manifest/01_standard-login; dialogue content is provided by the auth service
  - download: displays options for downloading content
  - clickthrough: displays terms and conditions the user must acknowledge; determined by the auth service via the Auth09 module
  - login: shows a login window defined by the login service in Auth09
  - help: displays a title and text content that can be set in the config
  - restricted: shows restrictions put on the content
  - multiselect: select multiple images for download
  - share: provides URLs for the current viewer state, the manifest, and an embed snippet
  - settings: provides user settings for the viewer
  - externalContent: displays an iframe allowing external content to be rendered in the viewer
- **Details:**
  - Most dialogues are common to the Extensions and found in modules/uv-dialogues-module; Share and Settings are specific to each Extension and so are found in the relevant extensions folder; the multiSelect dialogue has its own folder in the modules.

### 1.5 Event Handling

The event system in the UV is divided into two parts, internal and external.

For a full list of events see [EVENTS.md](EVENTS.md)

#### 1.5.1 External Events

- **Role:** Enable external applications or embedding pages to listen to and react to events within the Universal Viewer.
- **Core methods:**
  - `UnniversalViewer#on(name: string, cb: Function)`: Registers an event listener for a specific event. Used by the consuming page / application.
  - `BaseContentHandler#fire(name: string, ...args: any[])`: Calls `apply()` on all assigned callback functions for the given event.
  - `BaseExtension#fire(name: string, ...args: any[])`: Gives extensions access to `fire()` on the extension host.
- **Details:**
  - Events passed to `UniversalViewer#on()` are added to its `__externalEventListeners` array.
  - When creating a content handler, `__externalEventListeners` is passed to its constructor and in turn to parent class `BaseContentHandler`.
  - `BaseContentHandler` iterates and adds each event to the `_eventListeners` property.
  - `BaseContentHandler#fire()` is used to trigger the callbacks when the relevant event occurs.

#### 1.5.2 Internal Events

- **Role:** Allow communication between components in a decoupled manner.
- **Design pattern:** Publish-Subscribe (PubSub)
- **Details:** 
  - Currently only used in IIIF content.
  - Allows system components to broadcast (publish) an event so that subscribers may respond appropriately. The broadcaster doesn't need to know who the subscribers are and vice-versa.
  - Extension Host (`this.extensionHost` aka `IIIFContentHandler`) serves as the 'Event Bus' providing the `subscribe` and `publish` methods.
  - Uses the `PubSub` class to store and fire event callbacks.
- **Passing internal events outside**
  - The `subscribeAll` functions in `IIIFContentHandler` and `PubSub` allow for a single handler to be fire when any internal event happens. 
  - This is currently used in `BaseExtension` to pass almost all events to external handlers.
  - So external handlers can be attached for events such as `openseadragonExtension.open`.

<!-- The UV internal event system uses the Publish–Subscribe (PubSub) pattern to manage communication between different components in a decoupled and modular way i.e. it allows one part of the application (the publisher) to broadcast an event, and other parts (the subscribers) to respond to that event without the publisher needing to know who the subscribers are.

This means that components don't directly call each other; they communicate indirectly through events.

In UV, the Extension Host, usually referenced as `this.extensionHost` and which is currently always `IIIFContentHandler`, is typically the central event bus that uses the PubSub pattern. Components like extensions, UI panels, and dialogues use it to communicate. -->

### 1.6 Localisation

- **Role:** Allow all interface text to be available in a variety of languages, and for users to be able to change language as needed.
- **Design pattern:** Key-based localisation
- **Details:** 
  - Translation strings are stored files named with the relevant language tag e.g. `en-GB.json`.
  - These contain an object consisting of key-value pairs of text strings.
  - Each key begins with a `$` to serve as a marker for replacement and config contains matching markers.
  - After config is loaded, `BaseExtension.ts#translateLocale()` handles replacement.
  - Values are then generally available in `this.content`.
  - When a user changes locale, the selected locale is moved to the beginning of the locales array and the extension is reloaded, which causes the new locale to be the one used.
- **Note:** Substitution of language strings into config takes place before the 'configure' event fires, so user-supplied config cannot make use of `$markers` and must provide literal values.

## 2. Source Code Structure & Execution Flow

The following makes the assumption that your implementation of the viewer matches the example HTML file i.e. UV loaded via `<script>` and `UV.init(<elementId>, { configJSON })` is called, with added config coming from the URL Adapter and/or callback(s) via the "configure" event.

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
### 2.1 Entry

The entrypoint file `index.ts` loads `shim-jquery` to import jQuery, and puts the `jQuery` and `$` objects in the global namespace `window`.

It then exports the following classes/enums:

1. ContentType
2. Events
3. IIIFEvents
4. YouTubeEvents

and also exports the `URLAdapater` (as `IIIFURLAdapter`), `UniversalViewer` (as `Viewer`) and finally, `init`.

### 2.2 Initialisation

Init is a function in `init.ts` that initialises and embeds the viewer into a target container DOM element, handles resizing, fullscreen toggling, and error handling.

It returns an instance of [UniversalViewer](#universalviewer)

`init = (el: string | HTMLDivElement, data)`

If `el` is a string it will be assumed to be the `id` attribute of the element the viewer will be contained in.

This element is then emptied and pair of parent/child `div`s are added with the inner one being the `uvDiv` that the viewer loads in:

`el > div (parent) > div (uvDiv)`

This structure is required for fullscreen functionality to work in Safari browsers.

A new UniversalViewer instance is then created with `uvDiv` and `data` as args passed as a JSON object matching the `IUVOptions` type.

#### Resizing

A resize function is defined that changes the width and height of div (parent) to match either the container (`el`) div or `window` if the viewer is fullscreen.

This function is assigned as the handler for the standard `resize` and `orientationchange` events on `window` and is also called when handling the following from the `Events` enum:

- **CREATED**: Triggers a resize once the viewer is initialized.
- **EXTERNAL_RESOURCE_OPENED**: Resizes 100ms after resources are opened.
- **TOGGLE_FULLSCREEN**: A delayed resize is called after handling fullscreen events.

#### Fullscreen

Handler functions are defined and bound to standard fullscreen events depending on the specific browser being used.

### 2.3 UniversalViewer

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
   
### 2.4 Content Handler & Extension

Content Handlers *extend BaseContentHandler* 

This section will mainly focus on the `IIIFContentHandler` class. 

It also covers the creation and configuration of Extensions, as the code for these is quite tightly coupled.

#### 2.4.1 Choosing the Content Handler

The constructor calls `_init()`, which in turn calls `set()`, which then (if first load) calls `_reload()`.

After `set()`, `resize()` is called which calls `extension.resize()`.

`_reload()` uses Manifold and Manifesto to parse the manifest, and based on the media type, rendering format, or external resource type found in the IIIF manifest, selects an appropriate UV extension (e.g., OpenSeadragon, PDF, etc.) to load.

#### 2.4.2 Loading the Extension

The relevant Extension class is dynamically imported and instantiated.

##### 2.4.2.1 Extension default config

Each extension has its own `./config/config.json` file. These configs cover most of the basics required to configure the UV, plus anything relevant as a default for that extension and the modules/components it uses.

#### 2.4.3 Config loading & localisation

After the extension is created, `_loadAndApplyConfigToExtension()` is called. 

This first calls `BaseExtension#loadConfig()` which then calls `BaseExtension#translateLocale()` to load the relevant locale file from `src/locales` and replace translation markers with the correct language strings in the extension's default config.

This config is then returned to the Content Handler which then passes it to `BaseExtension#configure()` which resolves any configs passed externally via the "**configure**" event and merges them with config, overwriting any existing values.

Finally, in `_createExtension`, the `IIIFContentHandler` is assigned as the extension's `extensionHost`, the `data` variable that now contains the full config is set in the extension, as is the Manifesto `Helper` object.

Config is now available in the extension as `this.data.config.options|modules`.

#### 2.4.4 YouTubeContentHandler

TODO: Any differences between this and IIIFContentHandler apart from the obvious (manifest)

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
