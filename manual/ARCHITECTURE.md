[&larr; Manual Index](index.md)

<!-- omit in toc -->
# Architectural Overview of the Universal Viewer

- [Core: `UniversalViewer`](#core-universalviewer)
- [Content Handling: `BaseContentHandler`](#content-handling-basecontenthandler)
  - [`YouTubeContentHandler`](#youtubecontenthandler)
  - [`IIIFContentHandler`](#iiifcontenthandler)
- [Content Extensions](#content-extensions)
  - [`BaseExtension`](#baseextension)
  - [Content Specific `Extension`](#content-specific-extension)
- [Modules - UI Panels \& Dialogues](#modules---ui-panels--dialogues)
  - [Dialogues](#dialogues)
- [Event Handling](#event-handling)
    - [External Events](#external-events)
    - [Internal Events](#internal-events)
- [Localisation](#localisation)

<!-- omit in toc -->
## High-Level Summary

The Universal Viewer (UV) is designed to facilitate the presentation of diverse multimedia content types (images, videos, PDFs, IIIF manifests, etc.). Its architecture emphasizes support for multiple content handlers.

The core system is built around a central `UniversalViewer` class orchestrating content handling, user interface panels, and external resource interactions.

## Core: `UniversalViewer`

- **Role:** Core class for the entire system.
- **Responsibilities:**
  - Determining content type and loading the appropriate `ContentHandler`.
  - Handles global events, including resizing and full-screen toggle.
  - Provides an API for assigning external event handlers.
  - Provides an API for setting content of, resizing of, and disposing of, the `assignedContentHandler`.
- **Details:**
  - Extends `BaseContentHandler`, inheriting event management and lifecycle.
  - Receives `target` HTMLElement and configuration `data` from the `init` function

## Content Handling: `BaseContentHandler`

- **Role:** Abstract class for loading the content handler and firing external events.
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Handle content lifecycle: set, resize, dispose.
  - Communicate with the core container via events (`Events`, `IIIFEvents`, `YouTubeEvents`, extension-specific events).

### `YouTubeContentHandler`

- **Role:** Loads a YouTube player iframe.
- **Responsibilities:**
  - Load the YouTube iframe API script if not already present.
  - Provide the `onYouTubeIframeAPIReady` function to:
    - Create the player instance.
    - Handle player events and fire the relevant `YouTubeEvents` event.
  - Provide YouTube player specific implementations of `resize` and `dispose`.

### `IIIFContentHandler`

- **Role:** Parse the IIIF manifest and load & configure the correct Content Extension
- **Design Pattern:** Lazy-loaded modules via dynamic `import()` statements.
- **Responsibilities:**
  - Provide PubSub pattern for event handling.
  - Create and configure the required Extension.
- **Details:**
  - Assigns itself to the Extension as `extensionHost`.
  - Provides `publish` and `subscribe` API functions to give Extensions access to PubSub.

## Content Extensions
**Note:** Content Extensions are only used by the IIIFContentHandler

### `BaseExtension`

- **Role:** Abstract Extension class.
- **Responsibilities:**
  - Locale loading and replacement of locale string in default config.
  - Setup of general events e.g. arrow key presses.
  - Creation of Shell and common Modules

### Content Specific `Extension`

- **Role:** Content-type specific implementation of a 'Viewer'
- **Responsibilities:**
  - Load and display specific content types.
  - Manage content-specific UI and controls.
  - Provision of events to interact with content viewer.

## Modules - UI Panels & Dialogues

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
  - All modules call `setConfig(<moduleName>)` which causes the relevant section of `config.modules` to be loaded into the module.

### Dialogues

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

## Event Handling

The event system in the UV is divided into two parts, internal and external.

For a full list of events see [Events](EVENTS.md)

For a detailed overview of how the Event system works see [Execution - Events](EXECUTION.md)

#### External Events

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

#### Internal Events

- **Role:** Allow communication between components in a decoupled manner.
- **Design pattern:** Publish-Subscribe (PubSub)
- **Details:** 
  - Currently only used in IIIF content.
  - Allows system components to broadcast (publish) an event so that subscribers may respond appropriately. The broadcaster doesn't need to know who the subscribers are and vice-versa.
  - Extension Host (`this.extensionHost` aka `IIIFContentHandler`) serves as the 'Event Bus' providing the `subscribe` and `publish` methods.
  - Uses the `PubSub` class to store and fire event callbacks.
- **Passing internal events outside**
  - The `subscribeAll` functions in `IIIFContentHandler` and `PubSub` allow for a single handler to be fired when any internal event happens. 
  - This is currently used in `BaseExtension` to pass almost all events outside i.e. external handlers can be attached for events such as `openseadragonExtension.open`.

## Localisation

- **Role:** Allow all interface text to be available in a variety of languages, and for end users to be able to change language as needed.
- **Design pattern:** Key-based localisation
- **Details:** 
  - Translation strings are stored files named with the relevant language tag e.g. `en-GB.json`.
  - These contain an object consisting of key-value pairs of text strings.
  - Each key begins with a `$` to serve as a marker for replacement and config contains matching markers.
  - After config is loaded, `BaseExtension.ts#translateLocale()` handles replacement.
  - Values are then generally available in `this.content`.
  - When a user changes locale, the selected locale is moved to the beginning of the locales array and the extension is reloaded, which causes the new locale to be the one used.
- **Note:** Substitution of language strings into config takes place before the 'configure' event fires, so user-supplied config cannot make use of `$markers` and must provide literal values.
